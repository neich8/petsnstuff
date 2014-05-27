var express = require('express');

//fileupload
var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var s3 = new aws.S3();

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var multer  = require('multer')
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var methodOverride = require('method-override');
var session = require('cookie-session')

var routes = require('./routes/index');
var users = require('./routes/users');
var messageBoard = require('./routes/messageboard')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/petsnstuff');
var User = require("./models/user");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser());
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(multer());
app.use(session({keys: ["asdf"]}))

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', routes);
app.use('/users', users);

require("./routes/index")(app);
require("./routes/messageboard")(app);
require("./routes/pets")(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(req, res) {
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.writeHead(303, { Connection: 'close', Location: '/' });
      res.end();
    });
});

module.exports = app;


