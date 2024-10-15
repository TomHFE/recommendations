const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const RecipeSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
  favourites: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  instructions: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructions",
      required: true,
    },
  ],
  ingredients: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Ingredients",
      required: true,
    },
  ],
});

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Recipe = mongoose.model("Recipe", RecipeSchema);

// These lines will create a test post every time the server starts.
// You can delete this once you are creating your own posts.
//const dateTimeString = new Date().toLocaleString("en-GB");
//new Post({ message: `Test message, created at ${dateTimeString}` }).save();

module.exports = Recipe;
