# exif-image-auto-rotation
Auto rotate uploaded images based on their exif data.

This module requires imagemagick or graphicsmagick installed on your server for gm to run, however I am guessing if you are looking for this kind of module you may already have that bit sorted.
See here for more info: https://www.npmjs.com/package/gm

That said, the installation of this module is fairly straight forward; either:
1) run "npm install exif-image-auto-rotation"
or
2) add "exif-image-auto-rotation": "latest" to your package.json file.

Example 1 - pass an array of image paths to auto-rotate:
```
var autoRotate = require('exif-image-auto-rotation');
var images = [
	'/var/image_uploads/image_one.jpeg',
	'/var/image_uploads/image_two.jpeg',
];
autoRotate( images );
```

Example 2 - pass a single image to correct
```
var autoRotate = require('exif-image-auto-rotation');
autoRotate( '/var/image_uploads/image_one.jpeg' );
```

Example 3 - run callback after rotation of image(s) have completed
```
var autoRotate = require('exif-image-auto-rotation');
var images = [
	'/var/image_uploads/image_one.jpeg',
	'/var/image_uploads/image_two.jpeg',
];
autoRotate( images, function(){
	//something really cool!
} );
```