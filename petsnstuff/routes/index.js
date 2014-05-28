var User = require("../models/user")["User"];
var Nutrition = require("../models/nutrition");
var Ingredient = require("../models/ingredient")

var satelize = require('satelize');

var satelize = require('satelize');

var passport = require('passport')
module.exports = function(app){

app.get('/', function(req, res) {
		console.log(req.isAuthenticated());
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
app.get('/weather', function(req, res) {
		satelize.satelize({ip: '46.19.37.108'}, function(err, geoData) {
		var obj = JSON.parse(geoData);
		var request = require('request');
		
		request('https://api.forecast.io/forecast/30a281d92fd821b0e1ce3ef138ab59d4/' + obj.longitude + "," + obj.latitude , function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var weather = JSON.parse(response.body)
				var	img = weatherSolver(weather)
				res.send("https://s3.amazonaws.com/pets-n-stuff/" + img)
			}
		})
	});
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
			var img = "/cat_pics/rain/r" + three
			break;
		case "snow":
		case "sleet":
			var img = "/cat_pics/snow/s" + three
			break;
		case "fog":
			var img = "/cat_pics/fog/f" + three
			break;
	}
	if(!img) {
		if(temp > 80 ) {
			var img = "/cat_pics/hot/h" + Math.floor(Math.random() * 5) + 1
		}
		else if(temp < 45) {
			var img = "/cat_pics/hot/c" + three
		}
		else {
			var img = "/cat_pics/mild/" + three
		}
	}
	return img
}



