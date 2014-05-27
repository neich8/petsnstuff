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




app.get("/profile", function(req, res, user) {
		 passport.authenticate('facebook',
	  	 { successRedirect: '/profile',
      failureRedirect: '/' })
	
	console.log("At the profile page!")
	console.log(req.user)
	res.render('profile', {
		"title" : "User profile",
		"profile" : req.user[0]
	})
	// if(id) {
	// User.findById(id, function(err,user) {
	// 	if (err) {
	// 		console.log("shits broke yo!")
	//  	  // res.redirect("/")
	//  	  res.render('profile')
	// 	}
	// 	else {
	// 		console.log(user)
	// 		res.render('profile', {
 //        "title" : "User profile",
 //        "profile" : user
 //      });
	// 	}
	// });
	// }
	// else {
	// // res.redirect("/")
	// };
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook',
  	 { successRedirect: '/profile',
      failureRedirect: '/' }
  )
);

}

