var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shotSchema = new Schema ({
	shotName: String,
	examDate: Date
})

var petSchema = new Schema({
	name: String,
	age: Number,
	weight: Number,
	license: String,
	breed: String,
	markings: String,
	shots: [shotSchema],
	photo: String
})

var userSchema = new Schema({
	userName: {
  	type: String,
  	required: true
  },
  fbId: String,
  pets: [petSchema],
//was going to add shots here but thinking that is contained in pets array
});

module.exports = ({
	Shot: mongoose.model('Shot', shotSchema),
	Pet: mongoose.model('Pet', petSchema),
	User: mongoose.model('User', userSchema)
})
// module.exports = mongoose.model('User', userSchema);
