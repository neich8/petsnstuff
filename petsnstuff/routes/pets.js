var Pet = require("../models/pets")
module.exports = function(app) {

app.post("/create", function(req, res){
	var pet = new Pet ({
		name: req.body.name,
		age: req.body.age,
		shots: req.body.shots,
		weight: req.body.weight,
		type: req.body.type,
		photo: req.body.photo,
	})
	pet.save(function(err, pet) {
		if(err) {
			console.log("Shits broke yo")
		}
		else {
			console.log("shits saved")
			res.redirect("/")
		}
	})
});






}