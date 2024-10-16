const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profilePictureURL : {type: String },
  followingData: {
    followers: [
       {
          type:  mongoose.Schema.Types.ObjectId,
          ref: 'User',
        }
        
    ],
    following: [ {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  favourites: 
    [ {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    }
   ]


});

const User = mongoose.model("User", UserSchema);

module.exports = User;
