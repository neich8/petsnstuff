var User = require("../models/user")["User"];
var Pet = require("../models/user")["Pet"];
module.exports = function(app) {
	app.post('/create/:id', function(req, res) {
		console.log("Pet is creating")
		var id = req.params.id
		var pet = {
			name: req.body.name,
			age: req.body.age,
			shots: req.body.shots,
			weight: req.body.weight,
			type: req.body.type,
			photo: req.body.photo
		}

		// console.log(pet)
		User.find({_id: id}, function(err, users) {
			if(err) {
				console.log("Shits broke yo")
			}
			else {
				console.log(users[0])
				user = users[0]
				user.pets.push(pet)
				user.save(function(err, user) {})
				res.redirect("/profile/" + id)
			}
		})
	});
};

