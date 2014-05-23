var User = require("../models/user");
module.exports = function(app){



app.get('/', function(req, res) {
  res.render('index', { title: "Pets 'n Stuff" });
});


app.post("/newuser", function(req, res) {
	console.log(req.body)

	var user = new User({
		userName: req.body.username,
		email: req.body.email});
		user.save(function (err, user) {
	  if (err) {
	 	  console.log('meow');
		} 
		else {
			console.log(user)
			res.redirect("profile/" + user._id);
		}
	});

});

app.post("/signin", function(req, res) {



})

app.get("/profile/:id", function(req, res) {
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

