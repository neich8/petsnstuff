var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	userName: {
  	type: String, 
  	required: true
  },
  email: String,
  pet: [{
  		name: String,
	age: Number,
	shots: String,
	weight: Number,
	type: String,
	photo: String
  }]


});

module.exports = mongoose.model('User', userSchema);