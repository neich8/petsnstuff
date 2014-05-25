var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var petSchema = new Schema ({
	name: String,
	age: Number,
	shots: String,
	weight: Number,
	type: String,
	photo: String
});



module.exports = mongoose.model('Pet', petSchema);