var User = require("../models/user")["User"];
var Pet = require("../models/user")["Pet"];
var Shot = require("../models/user")["Shot"];

module.exports = function(app) {
	app.post('/create', function(req, res) {
		console.log(req.body)
		var shot = {
      shotName: req.body.shotName,
      examDate: req.body.shotDate
		}

		var pet = {
			name: req.body.petName,
			age: req.body.age,
			weight: req.body.weight,
			license: req.body.license,
			breed: req.body.breed,
			shots: shot,
			markings: req.body.markings,
			photo: req.body.photo
		}

		User.find({fbId: req.user.fbId}, function(err, users) {
			if(err) {
				console.log("Cannot find pets")
			}
			else {
				user = users[0]
				user.pets.push(pet)
				user.pets[user.pets.length-1].shots.push(shot)
				user.save(function(err, user) {})
				res.send({pet: pet})
			}
		})
	});
};