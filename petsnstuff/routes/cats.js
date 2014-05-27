var User = require("../models/user")["User"];
var Nutrition = require("../models/nutrition");
var Ingredient = require("../models/ingredient")

var passport = require('passport')
module.exports = function(app){

app.get('/', function(req, res) {
	 passport.authenticate('facebook',
	  	 { successRedirect: '/profile',
      failureRedirect: '/' })
	Nutrition.find({ Brand: "Alpo Dog Food (Dry)"}).select('-_id').exec(function(err, food) {
		Ingredient.find({}, function(err, ingredients) {
			res.render('index', { title: "Pets 'n Stuff", foods: food, ingredients: ingredients} );
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



app.get("/profile", function(req, res, user) {
		 passport.authenticate('facebook',
	  	 { successRedirect: '/profile',
      failureRedirect: '/' })
	if(req.user) {
			res.render('profile', {
        "title" : "User profile",
        "profile" : user,
        "pets" : user.pets.reverse()
      });
		}
	}
		res.redirect("/")

});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook',
  	 { successRedirect: '/profile',
      failureRedirect: '/' }
  )
);

}

