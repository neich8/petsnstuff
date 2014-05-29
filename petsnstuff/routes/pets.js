var User = require("../models/user")

// var Shot = require("../models/shots")

module.exports = function(app) {
	app.get('/create', function(req, res) {

		var shot = {
      shotName: req.body.shotName,
      examDate: req.body.shotDate
		}

		var pet = {
			name: "req.body.petName",
			age: "req.body.age",
			weight: "req.body.weight",
			license: "req.body.license",
			breed: "req.body.breed",
			shots: "shot",
			markings: "req.body.markings",
			photo: "req.body.photo"
		}
		console.log(req.user.fbId)
		User.find({fbId: req.user.fbId}, function(err, users) {
			console.log("FUCK THIS")
			if(err) {
				console.log("Cannot find pets")
			}
			else {
				console.log("These are the pets")
				console.log(users)

				user = users[0]
				user.pets.push(pet)

				console.log(user.pets)
				user.pets[user.pets.length-1].shots.push(shot)
				user.save(function(err, user) {
					if(err){
						console.log(err)
						console.log("shits broke yo")
					}
					else { 
						res.send({pet: pet})	
					}
				})
				
			}
		})
	});
};
