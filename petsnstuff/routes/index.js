var User = require("../models/user")["User"];
var Nutrition = require("../models/nutrition");
var Ingredient = require("../models/ingredient")

var passport = require('passport')
module.exports = function(app){

app.get('/', function(req, res) {
	req.session.user = "Hello"

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

		 console.log("makin pets")
	if(req.user.pets) {
			res.render('profile', {
        "title" : "User profile",
        "profile" : user,
        "pets" : user.pets.reverse()
      });
		}
		if(req.user) {
			res.render('profile', {
				"title": "User profile",
				"profile" : user
			})
		}
		res.redirect("/")
	});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', 
		{ failureRedirect: '/' },
		function(req, res) {
			req.ip
			var profile = app.get("profile")
			console.log(profile)
			User.find({fbId: profile.id}, function(err, user){
				if(user.length > 0) {
					console.log("\n\n\n\n\n\n\n\n\n\n\n" + user._id)
					console.log(req.ip)
				}
				else {
					var usr = new User({
						userName: profile.name,
						fbId: profile.id})
					usr.save(function(err, user){
						if(err) {
							console.log("Yo shits broke")
						}
						else {

							req.session.user = user._id
						}
					});
				}
				res.redirect('/');
			});
		}
	)
);

}

