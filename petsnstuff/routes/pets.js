var User = require("../models/user")
module.exports = function(app) {

app.post('/create/:id', function(req, res) {
	var id = req.params.id

			var newPet = {
			name: req.body.name,
			age: req.body.age,
			shots: req.body.shots,
			weight: req.body.weight,
			type: req.body.type,
			photo: req.body.photo
		}
		console.log(newPet)
			user = User.find({_id: id}, function(err, user) {
				if(err) {
					console.log("Shits broke yo")
				}
				else {
					console.log(user)
					var update = user.pet.push(newPet)
					console.log("\n\n\n\n\n\n\n\n\n")
					console.log(user.pet)
				}
			})
			



});





}