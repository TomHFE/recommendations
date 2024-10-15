const mongoose = require("mongoose");


const RecipeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  image: String,
  summary: String,
  instructions: String, 
  created_at: { type: Date, default: Date.now },
  SearchingParameters: [{
      nationalities: {
          type: String,
          required: false,
        },
        dishType: [{
            type: String,
            required: false
        }],
        preparationMinutes: Number,
        cookingMinutes: Number,
        servings: Number,
        ingredients: [{ 
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Ingredients',
            required: true,
        }],
        Requirements: [{
           allergies: [{
            type: String,
            required: false,
           }],
           vegeterian: Boolean,
           vegan: Boolean,
           glutenFree: Boolean,
           dairyFree: Boolean,
           healthy: Boolean,
           costFriendly: Number,
           readyInMinutes: Number, required: false,
        }]
  }],

  comments: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Comment',
  }],
  favourites: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: false,
  }],
});

const Post = mongoose.model("Recipe", RecipeSchema);


module.exports = Post;