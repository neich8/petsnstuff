var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ingredientSchema = new Schema ({
  Brand: String,
  Ingredients: String
});

module.exports = mongoose.model('Ingredient', ingredientSchema);