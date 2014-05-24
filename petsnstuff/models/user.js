var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName:  {
  	type: String, 
  	required: true
  },
  email: String



});

module.exports = mongoose.model('User', userSchema);