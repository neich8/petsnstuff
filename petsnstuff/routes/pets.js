var User = require("../models/user")["User"];
var Pet = require("../models/user")["Pet"];
var Shot = require("../models/user")["Shot"]; //Guido

module.exports = function(app) {

app.post('/create/:id', function(req, res) {
	var id = req.params.id

           // var shot = {
           // 	shotName: req.body.shotName,
           // 	examDate: req.body.date

           // }
			var pet = {
			name: req.body.name,
			age: req.body.age,
			weight: req.body.weight,
			license: req.body.license,
			breed: req.body.breed,
			markings: req.body.markings
			//photo: req.body.photo
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
					// user.pets.shots.push(shot) // Guido 
					user.save(function(err, user) {})
					res.redirect("/profile/" + id)
				}
			})
	});
}