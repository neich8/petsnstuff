var User = require("../models/user")["User"];
var Pet = require("../models/user")["Pet"];
var Shot = require("../models/user")["Shot"];

module.exports = function(app) {

	app.post('/create/:id', function(req, res) {
		console.log("Pet is creating")
		var id = req.params.id
	});


	app.post('/create/:data', function(req, res) {
		var id = req.session.user;
		var form_data = JSON.parse(req.params.data);
		var name = form_data[0].value;
		var age = form_data[1].value;
		var weight = form_data[2].value;
		var licensenumber = form_data[3].value;
		var type = form_data[4].value;
		var markings = form_data[5].value;
		var shotname = form_data[6].value;
		var shotdate = form_data[7].value;
		var photo = "test.png";

		var shot = {
      shotName: shotname,
      examDate: shotdate
		}


		var pet = {
			name: name,
			age: age,
			weight: weight,
			license: licensenumber,
			breed: type,
			shots: shot,
			markings: markings,
			photo: photo
		}
	User.find({_id: id}, function(err, users) {
		if(err) {
			console.log("Cannot find pets")
		}
		else {
			console.log(users[0])
			user = users[0]
			user.pets.push(pet)
			user.pets[user.pets.length-1].shots.push(shot)
			user.save(function(err, user) {})
			console.log(users[0])
			res.send({pet: pet})

			//res.redirect("/profile/" + id)
		}
	});

		
	});
}
