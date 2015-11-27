var fs = require("fs"),
	exifParser = require('exif-parser'),
    gm = require('gm'),
    async = require('async');

function requiresRotating( original, callback ){
	//get the exif data
	fs.open(original, 'r', function (err, fd) {
		if (err){
			log(err);
		}

		// Read first 64K of image file (EXIF data located here)
		var headSize = 65536;
		var buffer = new Buffer(headSize);
		fs.read(fd, buffer, 0, buffer.length, null, function (err, bytesRead, buffer) {
			fs.close(fd);
			if (err){
				log(err);
				return callback(false);
			}

			var parser = exifParser.create(buffer);
			var exifResult = parser.parse();
			if( exifResult.tags ){
				if( exifResult.tags.Orientation ){
					switch( exifResult.tags.Orientation	) {
						case 1: return callback(false); // top-left  - no transform
						case 2: return callback(true); // top-right - flip horizontal
						case 3: return callback(true); // bottom-right - rotate 180
						case 4: return callback(true); // bottom-left - should flip
						case 5: return callback(true); // left-top - rotate 90 and flip horizontal
						case 6: return callback(true); // right-top - rotate 90
						case 7: return callback(true); // right-bottom - rotate 270 and flip horizontal
						case 8: return callback(true); // left-bottom - rotate 270
						default: return callback(false); // ... just to be safe
					}
				}
			}

			//default to false
			return callback(false);
		});
	});
}
function doesFileExist( path, callback ){
	fs.stat( path, function(err) {
		if(err == null) {
			return callback( true );
		} else {
			return callback( false );
		}
	});
}
function log( a ){
	console.log( a );
}
module.exports = function( images, callback ){
	images = images || []; callback = callback || false;

	if( !Array.isArray(images) ){
		images = [images];
	}
	//save the image in the correct orientation if required.. this typically happens with apple devices when taking portrait images.
	//running through each image one at a time to lower cpu overhead.
	async.forEach(images, function( image, forEachCallback ){
		doesFileExist(image, function( pass ){
			if( pass === false ){
				return forEachCallback();
			}
			requiresRotating( image, function( needsRotating ){
				if(needsRotating){
					gm( image )
						.autoOrient()
						.write( image, function (err) {
							if (err) {
								log( 'Could not write rotated image to disk:' );
								log( err );
							}
							return forEachCallback();
						});
				} else {
					return forEachCallback();
				}
			});
		});
	}, function( err ){
		if( err ){
			log( 'Error with the aync foreach:' );
			log( err );
		}
		//last but not least run the callback passed to this module, or just return.
		if( callback ){
			return callback();
		} else {
			return true;
		}
	});
};