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
      comment: String,
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
  favourites: [
    {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
  ],
//   user_id: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: "User",
//     required: true,
//   },
  title: String,
  image: String,
  summary: String,
  instructions: String,
  SearchingParameters: [
    {
      nationalities: [{
        type: String,
        required: false,
      }],
      dishType: [
        {
          type: String,
          required: false,
        },
      ],
      preparationMinutes: Number,
      cookingMinutes: Number,
      servings: Number,
      Requirements: [
        {
          allergies: [
            {
              nuts: Boolean,
              shellfish: Boolean,
              dairy: Boolean,
              soy: Boolean,
              eggs: Boolean,
              required: false,
            },
          ],
          vegeterian: Boolean,
          vegan: Boolean,
          pescatarian: Boolean,
          glutenFree: Boolean,
          dairyFree: Boolean,
          healthy: Boolean,
          costFriendly: Number,
          readyInMinutes: Number,
          required: false,
        },
      ],
    },
  ],
  ingredients: [
  {
    name: String,
    quantity: Number,
    unit: String,
}]

});

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Recipe = mongoose.model("Recipe", RecipeSchema);

// These lines will create a test post every time the server starts.
// You can delete this once you are creating your own posts.
//const dateTimeString = new Date().toLocaleString("en-GB");
//new Post({ message: `Test message, created at ${dateTimeString}` }).save();

module.exports = Recipe;
