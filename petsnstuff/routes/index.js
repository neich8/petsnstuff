var User = require("../models/user")["User"];
var Nutrition = require("../models/nutrition");
var Ingredient = require("../models/ingredient")

var satelize = require('satelize');

var satelize = require('satelize');

var passport = require('passport')

var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('././AwsConfig.json');
var s3 = new aws.S3();

module.exports = function(app){


  app.get('/', function(req, res) {
  	 passport.authenticate('facebook',
  	  	 { successRedirect: '/profile',
        failureRedirect: '/' })
  	Nutrition.find({ Brand: "Alpo Dog Food (Dry)"}).select('-_id').exec(function(err, food) {
  		Ingredient.find({}, function(err, ingredients) {
  			res.render('index', { title: "Pets 'n Stuff", foods: food, ingredients: ingredients, req: req} );
  		});
  	});
  });

  app.post('/brands/:brand_name', function(req, res) {
  	Nutrition.find({ Brand: req.params.brand_name}, function(err, food) {
  		Ingredient.findOne({ Brand: req.params.brand_name}, function(err, ingredient) {
  				res.send({foods: food, ingredient:ingredient});
  		});
  	});
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  app.get("/profile", function(req, res) {
  		console.log(req.isAuthenticated())
  	if (req.isAuthenticated()) {
  			res.render('profile', {
          "title" : "User profile",
          "profile" : req.user,
          "pets" : req.user.pets.reverse(),
          req: req
        });
    }
  	});

  
  app.get('/weather', function(req, res) {
    satelize.satelize({ip: '46.19.37.108'}, function(err, geoData) {
    var obj = JSON.parse(geoData);
    var request = require('request');
    
    request('https://api.forecast.io/forecast/30a281d92fd821b0e1ce3ef138ab59d4/' + obj.longitude + "," + obj.latitude , function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var weather = JSON.parse(response.body)
        var img = weatherSolver(weather)
        res.send("https://s3.amazonaws.com/pets-n-stuff/" + img)
      }
    })
  });
});



  app.post('/file-upload/:user_id/:pet_id', function (req, res){
    User.findOne({fbId: req.user.fbId}, function(err, user) {
      console.log(req.files.thumbnail.size)
        if(err) {
          console.log("Cannot find pets")
        }
        if (req.files.thumbnail.size > 250000) {
          console.log("Error: File is over 25KB")
          res.redirect('/profile')
        }
        else {
          for (var i = 0; i < user.pets.length; i++ ) {
            if (user.pets[i].id === req.params.pet_id) {
              //console.log(user.pets[i].photo)
              var pet = user.pets[i]
              var remotelocation = "https://s3.amazonaws.com/pets-n-stuff/pets/" + req.files.thumbnail.name
              pet.photo = remotelocation

              function uploadImages() {
                var CODE_PATH = 'resources/images/';
                var fileList = getFileList('./' + CODE_PATH);


                fileList.forEach(function(entry) {
                  uploadFile(CODE_PATH + entry, './' + CODE_PATH + entry);
                });
              }


              function getFileList(path) {
                var i, fileInfo, filesFound;
                var fileList = [];

                filesFound = fs.readdirSync(path);
                for (i = 0; i < filesFound.length; i++) {
                  fileInfo = fs.lstatSync(path + filesFound[i]);
                  if (fileInfo.isFile()) fileList.push(filesFound[i]);
                }

                return fileList;
              }

              uploadFile(req.files.thumbnail.name, req.files.thumbnail.path)

              function uploadFile(remoteFilename, fileName) {
                var fileBuffer = fs.readFileSync(fileName);
                var metaData = getContentTypeByFile(fileName);

                s3.putObject({
                  ACL: 'public-read',
                  Bucket: 'pets-n-stuff/pets',
                  Key: remoteFilename,
                  Body: fileBuffer,
                  ContentType: metaData
                }, function(error, response) {
                  console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
                  console.log(arguments);
                });
              }


              function getContentTypeByFile(fileName) {
                var rc = 'application/octet-stream';
                var fileNameLowerCase = fileName.toLowerCase();

                if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
                else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
                else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
                else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
                else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
                else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

                return rc;
              }

              pet.save(function(err, pet) {})
              user.save(function(err, user) {})
              res.render('/profile')

            }
          }
        }
      })
    console.log(req.files.thumbnail)
  })



}

function weatherSolver(weather) {
  var temp = parseFloat(weather.currently.temperature)
  var condition = weather.currently.icon
  var three = Math.floor(Math.random() * 3) + 1
  switch(condition) {
    case "rain":
    case "hail":
    case "thunderstorm":
    case "tornado":
      var img = "cat_pics/rain/r" + three + ".jpg"
      break;
    case "snow":
    case "sleet":
      var img = "cat_pics/snow/s" + three + ".jpg"
      break;
    case "fog":
      var img = "cat_pics/fog/f" + three + ".jpg"
      break;
  }
  if(!img) {
    if(temp > 80 ) {
      var img = "cat_pics/hot/h" + (Math.floor(Math.random() * 5) + 1) + ".jpg"
    }
    else if(temp < 45) {
      var img = "/cat_pics/hot/c" + three + ".jpg"
    }
    else {
      var img = "/cat_pics/mild/" + three + ".jpg"
    }
  }
  return img
}