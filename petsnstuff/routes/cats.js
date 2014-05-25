var User = require("../models/user");
var Nutrition = require("../models/nutrion");
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
			req.session.userName = "Hello"
			console.log(user)
			res.redirect("profile/" + user._id);
		}
	});

});

app.post("/signin", function(req, res) {
console.log("signin")

})

app.get("/profile/:id", function(req, res) {
	console.log(req.session.userName)

		var id = req.params.id

		User.findById(id, function(err,user) {
				  if (err) {
	 	  console.log('meow');
		}
		else {
			console.log(user)
			res.render('profile', {
            "profile" : user
        });
		}
	});
})

app.post("/edit/:id")

}

