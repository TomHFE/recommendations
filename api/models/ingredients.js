const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const IngredientsSchema = new mongoose.Schema({
  ingredients: [{
      name: String,
      quantity: Number,
      unit: String,
  }]

});

const Ingredients = mongoose.model("Ingredients", IngredientsSchema);

module.exports = Ingredients;
