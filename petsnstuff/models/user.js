var mongoose = require('mongoose');

var Schema = mongoose.Schema;




var petSchema = new Schema({
	name: String,
	age: Number,
	shots: String,
	weight: Number,
	type: String,
	photo: String
})


var userSchema = new Schema({
	userName: String,
	fbId: String,
  pets: [petSchema]
});

module.exports = ({
	Pet: mongoose.model('Pet', petSchema),
	User: mongoose.model('User', userSchema)
})
// module.exports = mongoose.model('User', userSchema);