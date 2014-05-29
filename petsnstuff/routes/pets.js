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

				console.log(users)

				user = users[0]
				user.pets.push(pet)
				user.pets[user.pets.length-1].shots.push(shot)
				user.save(function(err, user) {
					if(err){
						console.log(err)
						console.log("shits broke yo")
					}
					else {
														console.log("\n\n\n\n\n\n\n\n\\n\n\n\n\n\n\n\n\n")
						console.log(user.pets)
										console.log("\n\n\n\n\n\n\n\n\\n\n\n\n\n\n\n\n\n")
					}
				})
				res.send({pet: pet})
			}
		})
	});

	app.post('/delete', function(req, res){
		User.find({fbId: req.user.fbId}, function(err, user) {
			if(err) {
				console.log("Cannot find pets")
			}
			else {
				user = user[0]
				for (var i = 0; i < user.pets.length; i++) {
					if (user.pets[i].id === req.body.petid) {
						user.pets[i].remove( function ( err, pet ){
				 			if(err) {
				 				console.log("its not deleted")
				 			}
				 			else {
				 				user.save( function(err, user){
				 					if(err){
				 						console.log(err)
				 					}
				 					res.send("Success")
				 				})

				 			}
				 		})
				 	}
				}
			}
		})
	});
};


