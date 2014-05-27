var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// var expressSession = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session')

//faceBook Oauth begin
var passport = require('passport')
var util = require('util')
var FacebookStrategy = require('passport-facebook').Strategy;
//facebook Oauth end

//FB KEYS
var FACEBOOK_APP_ID = "249952498528444"
var FACEBOOK_APP_SECRET = "";


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
app.use(session({keys: ["asdf"]}))

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  // app.use(passport.session());

//
//Facebook OAUTH Begin
//

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
// passport.serializeUser(function(user, done) {

//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      app.set("profile", profile)
      return done(null, profile);
    });
  }
));

      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      
//       return done(null, profile);
//     });
//   }
// ));

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


