var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var nutritionSchema = new Schema ({
  Brand: String,
  Method: String,
  Protein: Number,
  Fat: Number,
  Carbs: Number
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
