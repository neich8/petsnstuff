var User = require("../models/user")


module.exports = function(app) {
	app.post('/create', function(req, res) {

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
		console.log(req.user.fbId)
		User.find({fbId: req.user.fbId}, function(err, users) {

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


// 	app.get("/pet_edit/:petid", function(req, res){
// 		User.find({fbId: req.user.fbId}, function(err, user) {
// 			if(err) {
// 				console.log("Cannot find pets")
// 			}
// 			else {
// 				var user = user[0]
// 				for (var i = 0; i < user.pets.length; i++) {

// 					if (user.pets[i].id == req.params.petid) {
// 						res.render("pet_edit", {"title" : "Edit Pet",
// 												"pet" : user.pets[i],
// 												req : req})
// 					}
// 				}
// 			}
// 		})
// 	});

// 	app.post("/edit_pet/:petid", function(req, res){
// 		console.log("Hey Im posting")
// 		var shot = {
//       shotName: req.body.shotName,
//       examDate: req.body.shotDate
// 		}

// 		var pet = {
// 			name: req.body.petName,
// 			age: req.body.age,
// 			weight: req.body.weight,
// 			license: req.body.license,
// 			breed: req.body.breed,
// 			shots: shot,
// 			markings: req.body.markings,
// 			photo: req.body.photo
// 		}
// 		console.log("****************HERE**************")
// 		console.log(pet)
// 		User.find({fbId: req.user.fbId}, function(err, user) {
// 			if(err) {
// 				console.log("Shits broke yo")
// 			}
// 			else{
// 				console.log("User found!")
// 				var user1 = user[0]

// 				for (var i = 0; i < user1.pets.length; i++) {
// 					console.log(req.params.petid)
// 					if(user1.pets[i].id == req.params.petid){
// 						console.log("pet found!")
// 						user[0].pets[i].remove()
// 						user[0].pets[].save()
// 										res.redirect("/profile")


// 					}
// 				}
// 			}
// 		})
// })


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



