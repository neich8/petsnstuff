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
<<<<<<< HEAD
					else { 
						res.send({pet: pet})	
=======
					else {
														console.log("\n\n\n\n\n\n\n\n\\n\n\n\n\n\n\n\n\n")
						console.log(user.pets)
										console.log("\n\n\n\n\n\n\n\n\\n\n\n\n\n\n\n\n\n")
>>>>>>> b9333af8fc81fb451381dfd6c56fd0d83fc2c99b
					}
				})
				
			}
		})
	});
<<<<<<< HEAD
};
=======

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


>>>>>>> b9333af8fc81fb451381dfd6c56fd0d83fc2c99b
