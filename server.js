// setup ======================================================================
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 10080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');
var multer = require('multer'); // File upload
var done = false;
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'slektstresessionsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// File upload
var newFilename = 'error maybe';
var newFilePath = 'error maybe';
var fileDestinationFolder = './WWW/uploads/';

app.use(multer({
    dest: fileDestinationFolder,
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        newFilename = file.name;
        newFilePath = file.path;
        done = true;
    }
}));

// routes static  ======================================================================
app.post('/api/photo', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (done == true) {
        res.end(newFilePath);
    }
});

// css static for .ejs login page
app.all('/css/*', function (req, res, next) {
    next(); // allow the next route to run
})
app.use('/css', express.static('css'));

// let middleware do its job, even with static files
app.all('/WWW/*', function(req, res, next) {
  if (req.user && req.user._id) {
    next(); // allow the next route to run
  } else {
    // require the user to log in
    res.redirect("/login"); 
  }
})
app.use('/WWW', express.static('WWW'));		// sets up /WWW as a static directory for file hosting

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);