var User = require("../models/user")["User"];;
var Nutrition = require("../models/nutrition");
var Ingredient = require("../models/ingredient")

var passport = require('passport')
module.exports = function(app){


app.get('/', function(req, res) {

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

app.post("/newuser", function(req, res) {

	var user = new User({
		userName: req.body.username,
		email: req.body.email});
		user.save(function (err, user) {
	  if (err) {
	 	  console.log('meow');
		}
		else {
			req.session.userid = user._id
			console.log(req.session.userid)
			res.redirect("/profile");
		}
	});

});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook',
  	 { successRedirect: '/',
      failureRedirect: '/login' }));

app.post("/signin/:id", function(req, res) {

		var username = req.body.username
		var email = req.body.email
		User.find({userName: username}, function(err, user) {

		if(user[0].email === email) {

			res.redirect("/profile")
		}
		else {
			console.log('user login failed')
			res.redirect("/")
		}
	});
})

app.get("/profile", function(req, res) {
	console.log("hello")
	console.log(req.session.userid)

		var id = req.session.userid
		if(id) {
		User.findById(id, function(err,user) {
			if (err) {
				console.log("shits broke yo!")
	 	  res.redirect("/")
			}
		else {
			console.log(user)
			res.render('profile', {
            "profile" : user
        });
		}
	});
	}
	else {
	res.redirect("/")
}
})

app.post("/edit/:id")

}

