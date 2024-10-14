const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profilePictureURL : {type: String, required: false, },
  friendsData: {
    friendsList: [
       {
          type:  mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false
        }
        
    ],
    incomingRequests: [ {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      }
    ]
  }

});

const User = mongoose.model("User", UserSchema);

module.exports = User;
