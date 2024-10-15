const User = require("../models/user");
const hashpass = require("../components/encryptPass");
const isPasswordValid = require("../components/isPasswordValid");
const { generateToken } = require("../lib/token");

async function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const profilePictureURL = req.body.profilePictureURL;
  const emailExist = await doesEmailExist(email);
  const usernameExist = await doesUsernameExist(username);

  if (usernameExist) {
    console.log("Username already exists");
    res.status(400).json({ message: "Username already exists" });
  } else if (emailExist) {
    console.log("Email already exists");
    res.status(400).json({ message: "Email already exists" });
  } else if (password == null) {
    console.log("Password is missing");
    res.status(400).json({ message: "Password is missing" });
  } else if (!isPasswordValid(password)) {
    console.log("Password invalid");
    res.status(400).json({ message: "Password invalid" });
  } else if (!verifyEmail(email)) {
    console.log("Email address invalid");
    res.status(400).json({ message: "Email address invalid" });
  } else {
    const encryptpass = await hashpass(password);

    const user = new User({
      email: email,
      password: encryptpass,
      username: username,
      profilePictureURL: profilePictureURL,
    });

    user
      .save()
      .then((user) => {
        console.log("User created, id:", user._id.toString());
        res.status(201).json({ message: "OK" });
      })
      .catch((err) => {
        console.error("after", err);
        res.status(400).json({ message: "Something went wrong" });
      });
  }
}

async function getAllUsers(req, res) {
  const Users = await User.find();
  res.status(200).json({ message: Users });
}

async function getUserById(req, res) {
  console.log("this is req.body: ", req.body);
  // const userIds = req.body.friendsIds.friendsData.friendsList
  const userIds = req.body.friendsIds;

  console.log("line53", userIds);
  if (typeof userIds !== "string") {
    try {
      const userList = await Promise.all(
        userIds.map(async (userId) => {
          return User.findById(userId);
        })
      );
      const currentUserDetails = await User.findById(req.user_id);
      res.status(201).json({
        message: userList,
        currentUserData: currentUserDetails,
        UsersLength: typeof req.user_id,
      });
    } catch (error) {
      res.status(500).json({ message: "error retrieving users", error: error });
    }
  } else {
    try {
      const user = await User.findById(userIds);
      res.status(201).json({ message: user, UsersLength: typeof req.user_id });
    } catch (error) {
      res.status(500).json({ message: "error retrieving users", error: error });
    }
  }
}

async function doesUsernameExist(username) {
  const users = await User.find({ username: username });
  return users.length > 0;
}

async function doesEmailExist(email) {
  const users = await User.find({ email: email });
  return users.length > 0;
}

async function findEmail(req, res) {
  const Users = await User.find({ email: req.body.email });
  return Users;
}

async function userExists(userId) {
  return await User.exists({ _id: userId });
}

async function createFollowerRequest(req, res) {
  const senderId = req.user_id;
  const recipientId = req.body.recipientId;
  console.log("line108", recipientId);
  console.log(senderId);
  const recipient = await userExists(recipientId);

  if (recipient !== null) {

      try {
        const updatedRecipient = await User.findOneAndUpdate(
          { _id: recipientId },
          { $addToSet: { "followingData.followers": senderId } },
          { new: true }
        );
        res.status(201).json({ message: "OK", user_added: updatedRecipient });

        const updatedSender = await User.findOneAndUpdate(
          { _id: senderId },
          { $addToSet: { "followingData.following": recipientId } },
          { new: true }
        );
        res.status(201).json({ message: "OK", user_added: updatedSender });
      } catch (error) {
        res
          .status(401)
          .json({ message: "this is the error message: " + error.message });
      }
    } else {
      res
        .status(402)
        .json({ message: "request already sent by either sender or reciever" });
    }
};

async function getFollowerList(req, res) {
  const userId = req.user_id;
  const doesUserExists = await userExists(userId);

  if (doesUserExists !== null) {
    try {
      const user = await User.findById(userId, "followingData.followers");
      const token = generateToken(req.user_id);
      res
        .status(201)
        // removed incomingRequestList: user from .json as we were unsure if it's needed
        .json({ message: "OK", token: token });
    } catch (error) {
      res.status(401).json({ message: "error message: " + error.message });
    }
  } else {
    res.status(404).json({ message: "user does not exist" });
  }
}

async function getFollowingList(req, res) {
  const userId = req.user_id;
  const doesUserExists = await userExists(userId);

  if (doesUserExists !== null) {
    try {
      const user = await User.findById(userId, "followingData.followingList");
      res.status(201).json({ message: "OK" });
    } catch (error) {
      res.status(401).json({ message: "error message: " + error.message });
    }
  } else {
    res.status(404).json({ message: "user does not exist" });
  }
}
async function getAllFollowingData(req, res) {
  const userId = req.user_id;
  const doesUserExists = await userExists(userId);

  if (doesUserExists !== null) {
    try {
      const user = await User.findById(userId, "followingData");
      res.status(201).json({ message: "OK" });
    } catch (error) {
      res.status(401).json({ message: "error message: " + error.message });
    }
  } else {
    res.status(404).json({ message: "user does not exist" });
  } 
};



function verifyEmail(email) {
  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailPattern.test(email);
}

async function deleteFollowing(req, res) {
  const userId = req.user_id;
  const followingId = req.body.followingId;
  const userReal = await userExists(userId);
  const subjectNotInUserFollowingList = await User.exists({
    _id: userId,
    "followingData.followingList": followingId,
  });
  console.log(subjectNotInUserFollowingList);

  if (userReal !== null) {
    if (subjectNotInUserFollowingList !== null) {
      try {
        const userFollowingList = await User.findByIdAndUpdate(
          userId,
          { $pull: { "followingData.followingList": followingId } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          followingId,
          { $pull: { "followingData.followerList": userId } },
          { new: true }
        );
        res.status(201).json({ message: "OK" });
      } catch (error) {
        res
          .status(401)
          .json({ message: "this is the error message: " + error.message });
      }
    } else {
      res.status(402).json({ message: "user is not being followed" });
    }
  } else {
    res.status(404).json({ message: "user doesnt exist" });
  }
}
async function findByUsername(req, res) {
  const userSearchName = req.body.userSearchName;
  console.log("this is the user search name", userSearchName);
  try {
    const users = await User.find({
      username: { $regex: userSearchName, $options: "i" },
    }).select("_id username");
    console.log(users);
    const token = generateToken(req.user_id);
    res.status(201).json({ users: users, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getPublicDetailsById(req, res) {
  const user_id = req.body.user_id;

  try {
    const publicUserDetails = await User.find({ _id: user_id }).select(
      "username profilePictureURL friendsData.friendsList"
    );
    const token = generateToken(req.user_id);
    res.status(200).json({ user_details: publicUserDetails, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
async function getPublicDetailsByUsername(req, res) {
  const username = req.body.username;

  try {
    const publicUserDetails = await User.find({ username: username }).select(
      "username profilePictureURL friendsData.friendsList"
    );
    const token = generateToken(req.user_id);
    res.status(200).json({ user_details: publicUserDetails, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

const UsersController = {
  create: create,
  getAllUsers: getAllUsers,
  findByUsername: findByUsername,
  getPublicDetailsById: getPublicDetailsById,
  getPublicDetailsByUsername: getPublicDetailsByUsername,
  getUserById: getUserById,
  verifyEmail: verifyEmail,
  createFollowerRequest: createFollowerRequest,
  deleteFollowing: deleteFollowing,
  getAllFollowingData: getAllFollowingData,
  getFollowingList: getFollowingList,
  getFollowerList: getFollowerList,

};

module.exports = UsersController;

// const User = require("../models/user");
// const hashpass = require("../components/encryptPass");
// const isPasswordValid = require("../components/isPasswordValid");
// const { generateToken } = require("../lib/token");

// async function create(req, res) {
//   const email = req.body.email;
//   const password = req.body.password;
//   const username = req.body.username;
//   const profilePictureURL = req.body.profilePictureURL;
//   const emailExist = await doesEmailExist(email);
//   const usernameExist = await doesUsernameExist(username)

//   if (usernameExist) {
//     console.log("Username already exists")
//     res.status(400).json({ message: "Username already exists" });
//   } else if (emailExist) {
//     console.log("Email already exists")
//     res.status(400).json({ message: "Email already exists" });
//   } else if (password == null) {
//     console.log("Password is missing")
//     res.status(400).json({ message: "Password is missing" });
//   } else if (!isPasswordValid(password)) {
//     console.log("Password invalid")
//     res.status(400).json({ message: "Password invalid" })
//   } else if (!verifyEmail(email)) {
//     console.log("Email address invalid")
//     res.status(400).json({ message: "Email address invalid" })
//   } else {
//     const encryptpass = await hashpass(password)

//     const user = new User({ email: email, password: encryptpass, username: username, profilePictureURL: profilePictureURL })

//     user
//       .save()
//       .then((user) => {
//         console.log("User created, id:", user._id.toString());
//         res.status(201).json({ message: "OK" });
//       })
//       .catch((err) => {
//         console.error("after", err);
//         res.status(400).json({ message: "Something went wrong" });
//       });
//     }
//   }

// async function getAllUsers(req, res) {
//   const Users = await User.find();
//   res.status(200).json({ message: Users });
// }
// async function getUserByUsername(req, res) {
//   console.log("this is req.body: ", req.body)
//   // const userIds = req.body.friendsIds.friendsData.friendsList
//     const userIds = req.body.friendsIds

//   console.log('line53',userIds)
//   if (typeof(userIds) !== "string" ) {
//     try {
//       const userList = await Promise.all(userIds.map(async (userId) => {
//         return User.findById(userId);
//       }));
//       const currentUserDetails = await User.findById(req.user_id)
//       res.status(201).json({ message: userList, currentUserData: currentUserDetails,UsersLength: typeof(req.user_id)});
//     }
//     catch (error) {
//       res.status(500).json({ message: 'error retrieving users', error: error});
//     }
//   }
//   else {
//     try {

//       const user = await User.findById(userIds);
//   res.status(201).json({ message: user, UsersLength: typeof(req.user_id)});
//     }
//     catch (error) {
//       res.status(500).json({ message: 'error retrieving users', error: error});
//     }
//   }
// }

// async function getUserById(req, res) {
//   console.log("this is req.body: ", req.body)
// const userIds = req.body.friendsIds.friendsData.friendsList
//     const userIds = req.body.friendsIds

//   console.log('line53',userIds)
//   if (typeof(userIds) !== "string" ) {
//     try {
//       const userList = await Promise.all(userIds.map(async (userId) => {
//         return User.findById(userId);
//       }));
//       const currentUserDetails = await User.findById(req.user_id)
//       res.status(201).json({ message: userList, currentUserData: currentUserDetails,UsersLength: typeof(req.user_id)});
//     }
//     catch (error) {
//       res.status(500).json({ message: 'error retrieving users', error: error});
//     }
//   }
//   else {
//     try {

//       const user = await User.findById(userIds);
//   res.status(201).json({ message: user, UsersLength: typeof(req.user_id)});
//     }
//     catch (error) {
//       res.status(500).json({ message: 'error retrieving users', error: error});
//     }
//   }
// }

// async function doesUsernameExist(username) {
//   const users = await User.find({ username: username });
//   return users.length > 0;
// }

// async function doesEmailExist(email) {
//   const users = await User.find({ email: email });
//   return users.length > 0;
// }

// async function findEmail(req, res) {
//   const Users = await User.find({ email: req.body.email });
//   return Users;
// }

// async function userExists(userId) {
//   return await User.exists({_id : userId})
// }

// async function createFriendRequest (req, res) {
//   const senderId = req.user_id
//   const recipientId =req.body.senderId
//   const recipient = await userExists(recipientId)
//   const requestExists = await requestNotYetExists(req, res)
//   console.log(requestExists)

//   if (recipient !== null) {
//     if (requestExists == null) {
//       try {
//           const updatedRecipient =  await User.findOneAndUpdate(
//           { _id: recipientId },
//           { $addToSet: { 'friendsData.incomingRequests' : senderId }
//           } ,
//           { new: true }
//         );
//         res.status(201).json({ message: "OK", user_added: updatedRecipient});
//       }
//       catch(error) {
//         res.status(401).json({ message: 'this is the error message: ' + error.message });

//       }
//     }
//     else {
//       res.status(402).json({ message: 'request already sent by either sender or reciever' });

//     }
//   }
//   else {
//     res.status(404).json({ message: "User no longer exists" });
//   }

// }

// // generate token

// async function acceptFriendRequest(req, res) {
//   const senderId = req.body.senderId
//   const recipientId = req.user_id
//   const recipient = await userExists(recipientId)
//   if (recipient !== null) {
//     try {
//       await User.findOneAndUpdate(
//         { _id: recipientId },
//         { $addToSet: { 'friendsData.friendsList' : senderId }
//       } ,
//       { new: true }
//     );
//     const updatedRecipient =  await User.findOneAndUpdate(
//       { _id: senderId },
//       { $addToSet: { 'friendsData.friendsList' : recipientId }
//     } ,
//     { new: true }
//   );
//   const incomingRequestList = await User.findByIdAndUpdate(
//     recipientId,
//     { $pull:{ 'friendsData.incomingRequests': senderId}},
//     {new: true}
//   );
//   await User.findByIdAndUpdate(
//     senderId,
//     { $pull:{ 'friendsData.incomingRequests': recipientId}},
//     {new: true}
//   );
//     const token =  generateToken(req.user_id)
//     res.status(201).json({ message: "OK", token: token, user_added: updatedRecipient, incoming_requests: incomingRequestList});
//   }
//   catch(error) {
//     res.status(401).json({ message: 'this is the error message: ' + error.message });

//   }
//   }
//   else {
//     res.status(404).json({ message: 'recipient doesnt exist' });

//   }

// }
// async function declineFriendRequest(req, res) {
//   console.log('sender',req.body.senderId)
//   console.log('recipient',req.user_id)
//   const senderId = req.body.senderId
//   const recipientId = req.user_id
//   const recipient = await userExists(recipientId)
//   const senderNotInRecipientsIncomingList = await User.exists({
//     _id : recipientId,
//     'friendsData.incomingRequests': senderId,
//   })
//   console.log(senderNotInRecipientsIncomingList)

//   if (recipient !== null) {
//     if (senderNotInRecipientsIncomingList !== null) {

//       try {
//       const incomingRequestList = await User.findByIdAndUpdate(
//         recipientId,
//         { $pull:{ 'friendsData.incomingRequests': senderId}},
//         {new: true}
//       );
//       await User.findByIdAndUpdate(
//         senderId,
//         { $pull:{ 'friendsData.incomingRequests': recipientId}},
//         {new: true}
//       )
//       res.status(201).json({ message: "OK", incoming_requests: incomingRequestList});
//     }
//     catch(error) {
//       res.status(401).json({ message: 'this is the error message: ' + error.message });

//     }
//     }
//     else {
//       res.status(402).json({ message: 'sender not in recipients incoming request list' });
//     }
//   }
//   else {
//     res.status(404).json({ message: 'recipient doesnt exist' });

//   }

// }
// async function getIncomingRequest(req, res) {
//   const userId = req.user_id
//   const doesUserExists = await userExists(userId)

//   if (doesUserExists !== null) {
//     try {
//       const user = await User.findById(userId, 'friendsData.incomingRequests');
//       const token = generateToken(req.user_id)
//       res.status(201).json({message: 'OK', incomingRequestList: user, token: token})
//     }
//     catch(error) {
//       res.status(401).json({message: 'error message: ' + error.message})
//     }
//   }
//   else {
//     res.status(404).json({ message: 'user does not exist' });
//   }

// }
// async function getFriendsList(req, res) {
//   const userId = req.user_id
//   const doesUserExists = await userExists(userId)

//   if (doesUserExists !== null) {
//     try {
//       const user = await User.findById(userId, 'friendsData.friendsList');
//       res.status(201).json({message: 'OK', incomingRequestList: user})
//     }
//     catch(error) {
//       res.status(401).json({message: 'error message: ' + error.message})
//     }
//   }
//   else {
//     res.status(404).json({ message: 'user does not exist' });
//   }

// }
// async function getAllFriendsData(req, res) {
//   const userId = req.user_id
//   const doesUserExists = await userExists(userId)

//   if (doesUserExists !== null) {
//     try {
//       const user = await User.findById(userId, 'friendsData');
//       res.status(201).json({message: 'OK', incomingRequestList: user})
//     }
//     catch(error) {
//       res.status(401).json({message: 'error message: ' + error.message})
//     }
//   }
//   else {
//     res.status(404).json({ message: 'user does not exist' });
//   }

// }

// async function requestNotYetExists (req, res) {
//   const sender = req.body.senderId
//   const recipient = req.user_id

//   const senderNotInRecipientFriendsList = await User.exists({
//     _id : recipient,
//     'friendsData.friendsList': sender,

//   })
//   const recipientNotInSenderFriendsList = await User.exists({
//     _id : sender,
//     'friendsData.friendsList': recipient,

//   })
//   const senderNotInRecipientIncomingRequestsList = await User.exists({
//     _id : recipient,
//     'friendsData.incomingRequests': sender,

//   })
//   const recipientNotInSenderIncomingRequestsList = await User.exists({
//     _id : sender,
//     'friendsData.incomingRequests': recipient,

//   })
//   return senderNotInRecipientFriendsList || recipientNotInSenderFriendsList || senderNotInRecipientIncomingRequestsList || recipientNotInSenderIncomingRequestsList
// }

// function verifyEmail(email) {
//   const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//   return emailPattern.test(email);
// }

// async function deleteFriend(req, res) {
//   const userId = req.user_id
//   const friendId = req.body.friendId
//   const userReal = await userExists(userId)
//   const friendNotInUserFriendList = await User.exists({
//     _id : userId,
//     'friendsData.friendsList': friendId,
//   })
//   console.log(friendNotInUserFriendList)

//   if (userReal !== null) {
//     if (friendNotInUserFriendList !== null) {

//       try {
//       const userFriendList = await User.findByIdAndUpdate(
//         userId,
//         { $pull:{ 'friendsData.friendsList': friendId}},
//         {new: true}
//       );
//       await User.findByIdAndUpdate(
//         friendId,
//         { $pull:{ 'friendsData.friendsList': userId}},
//         {new: true}
//       );
//       res.status(201).json({ message: "OK", deletedfriend: userFriendList});
//     }
//     catch(error) {
//       res.status(401).json({ message: 'this is the error message: ' + error.message });

//     }
//     }
//     else {
//       res.status(402).json({ message: 'friend not in friendList' });
//     }
//   }
//   else {
//     res.status(404).json({ message: 'user doesnt exist' });

//   }

// }

// async function findByUsername(req, res) {
//   const userSearchName = req.body.userSearchName;
//   try {
//     const users = await User.find({username: { "$regex": userSearchName, "$options": "i" }}).select('_id username')
//     const token = generateToken(req.user_id);
//     res.status(200).json({ users: users, token: token })
//   } catch(error) {
//     console.log(error)
//     res.status(500).json({message: "Server error"})
//   }
// }

// async function getPublicDetailsById(req, res) {
//   const user_id = req.body.user_id;

//   try {
//     const publicUserDetails = await User.find({_id: user_id}).select('username profilePictureURL friendsData.friendsList')
//     const token = generateToken(req.user_id);
//     res.status(200).json({ user_details: publicUserDetails, token: token })
//   } catch(error) {
//     console.log(error)
//     res.status(500).json({message: "Server error"})
//   }
// }
// async function getPublicDetailsByUsername(req, res) {
//   const username = req.body.username;

//   try {
//     const publicUserDetails = await User.find({username: username}).select('username profilePictureURL friendsData.friendsList')
//     const token = generateToken(req.user_id);
//     res.status(200).json({ user_details: publicUserDetails, token: token })
//   } catch(error) {
//     console.log(error)
//     res.status(500).json({message: "Server error"})
//   }
// }

// const UsersController = {
//   create: create,
//   getAllUsers: getAllUsers,
//   getUserById: getUserById,
//   verifyEmail: verifyEmail,
//   createFriendRequest: createFriendRequest,
//   acceptFriendRequest: acceptFriendRequest,
//   declineFriendRequest: declineFriendRequest,
//   deleteFriend: deleteFriend,
//   getIncomingRequest: getIncomingRequest,
//   getFriendsList: getFriendsList,
//   getAllFriendsData: getAllFriendsData,
//   findByUsername: findByUsername,
//   getPublicDetailsById: getPublicDetailsById,
//   getPublicDetailsByUsername: getPublicDetailsByUsername
// };

// module.exports = UsersController;
