const mongoose = require("mongoose");

const InstructionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  image: String,
  summary: String,
  instructions: String,
  created_at: { type: Date, default: Date.now },
  SearchingParameters: [
    {
      nationalities: {
        type: String,
        
      },
      dishType: [
        {
          type: String,
          
        },
      ],
      preparationMinutes: Number,
      cookingMinutes: Number,
      servings: Number,
      Requirements: [
        {
          allergies: [
            {
              type: String,
              
            },
          ],
          vegeterian: Boolean,
          vegan: Boolean,
          glutenFree: Boolean,
          dairyFree: Boolean,
          healthy: Boolean,
          costFriendly: Number,
          readyInMinutes: Number,
          
        },
      ],
    },
  ],
});

const Instructions = mongoose.model("instructions", InstructionsSchema);

module.exports = Instructions;
