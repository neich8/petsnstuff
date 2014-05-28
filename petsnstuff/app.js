var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// var session = require('cookie-session')

//faceBook Oauth begin
var passport = require('passport')
var util = require('util')
var FacebookStrategy = require('passport-facebook').Strategy;
//facebook Oauth end
var config = require("./config")
//FB KEYS



var routes = require('./routes/index');
var users = require('./routes/users');
var messageBoard = require('./routes/messageboard')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/petsnstuff');
var User = require("./models/user")["User"];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser() );
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "asdf",
    store: new MongoStore({
      db : "petsnstuff",
    })
  }));


  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log(user)
  done(null, user.fbId);
});

passport.deserializeUser(function(fbId, done) {

  User.findOne({fbId: fbId}, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne({fbId: profile.id}, function(err, user) {

      if (err) {
       return done(err); 
      }
      else if(!user.length){
        User.create({
          userName: profile.displayName,
          fbId: profile.id
        }, function(err, user){
          if(err){
            return done(err);
          }
          else {
            done(null, user);
          }
        });
      }
      else {
        done(null, user);
      }
    });
  }
));


app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/profile',
                                      failureRedirect: '/' }));
      


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




module.exports = app;


