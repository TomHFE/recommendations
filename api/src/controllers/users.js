const User = require("../models/user");
const hashpass = require("../utilities/encryptPass");
const isPasswordValid = require("../utilities/isPasswordValid");
const { generateToken } = require("../lib/token");

async function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const profilePictureURL = req.body.profilePictureURL;
  const emailExist = await doesEmailExist(email);
  const usernameExist = await doesUsernameExist(username);

  if (usernameExist) {
    res.status(400).json({ message: "Username already exists" });
  } else if (emailExist) {
    res.status(400).json({ message: "Email already exists" });
  } else if (password == null) {
    res.status(400).json({ message: "Password is missing" });
  } else if (!isPasswordValid(password)) {
    res.status(400).json({ message: "Password invalid" });
  } else if (!verifyEmail(email)) {
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
       // console.log("User created, id:", user._id.toString());
        res.status(201).json({ message: "OK"});
      })
      .catch((err) => {
        //console.error("after", err);
        res.status(400).json({ message: "Something went wrong" });
      });
  }
}

async function getAllUsers(req, res) {
  const Users = await User.find();
  res.status(200).json({ message: Users });
}

async function getUserDetails(req,res) {
  const userId = req.user_id

  try {
    const userDetails = await User.find({_id: userId})
    const token = generateToken(userId)
    res.status(201).json({
      message: userDetails,
      token: token,
    });
  }
  catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

//This gets a following
async function getUserById(req, res) {
//  console.log("this is req.body: ", req.body);
  // const userIds = req.body.friendsIds.friendsData.friendsList
  const userIds = req.body.friendsIds;
//  console.log('line 80', userIds)
//  console.log('line 81', req.user_id)
//  console.log("line53", userIds);
  if (typeof userIds !== "string") {
    try {
      const userList = await Promise.all(
        userIds.map(async (userId) => {
          return User.findById(userId);
        })
      );
      const currentUserDetails = await User.findById(req.user_id);
      const token = generateToken(req.user_id)
      res.status(201).json({
        message: userList,
        currentUserData: currentUserDetails,
        UsersLength: typeof req.user_id,
        token: token,
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

/* async function createFollowerRequest(req, res) {
  const senderId = req.user_id;
  const recipientId = req.body.recipientId;
//  console.log("line108", recipientId);
//  console.log(senderId);
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
} */

async function getFollowerList(req, res) {
  const userId = req.user_id;
  const doesUserExists = await userExists(userId);
  //console.log("Looking up user by ID:", userId); // Log the userId here

  if (doesUserExists !== null) {
    try {
      const user = await User.findById(userId);
      // const user = await User.findById(userId).select('followers');

      const token = generateToken(req.user_id);
      res
        .status(201)
        // removed incomingRequestList: user from .json as we were unsure if it's needed
        .json({ message: "OK", user: user.followingData.followers, token: token });
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
 // console.log('this is the userid             ' , userId)
  if (doesUserExists !== null) {
    try {
      const user = await User.findById(userId);
      const token = generateToken(req.user_id);

      res.status(201).json({ message: "OK", user: user.followingData.following, token: token });
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
}

function verifyEmail(email) {
  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailPattern.test(email);
}

/* async function deleteFollowing(req, res) {
  const userId = req.user_id;
  const followingId = req.body.followingId;
  const userReal = await userExists(userId);
  const subjectNotInUserFollowingList = await User.exists({
    _id: userId,
    "followingData.followingList": followingId,
  });
 // console.log(subjectNotInUserFollowingList);

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
} */

async function findByUsername(req, res) {
  const userSearchName = req.body.userSearchName;
//  console.log("this is the user search name", userSearchName);
  try {
    const users = await User.find({
      username: { $regex: userSearchName, $options: "i" },
    }).select("_id username");
 //   console.log(users);
    const token = generateToken(req.user_id);
    res.status(201).json({ users: users, token: token });
  } catch (error) {
  //  console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function toggleFollowing(req, res) {
  const user_id = req.user_id;
  const target_id = req.body.target_id;

  try {
    const user = await User.findById(user_id);
    const target = await User.findById(target_id);
    if (!user || !target) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already following the target
    const hasFollowed = await User.findOne({
      _id: user_id,
      'followingData.following': { $in: [target_id] },
    });
   // Remove from favourites
   if (hasFollowed) {
   await User.updateOne({ _id: user_id }, { $pull: { 'followingData.following': target_id } });
   await User.updateOne({ _id: target_id }, { $pull: { 'followingData.followers': user_id } });
    
   const user = await User.findById({_id: user_id})
  //  // Get updated objects
  //  updatedRecipe = await Recipe.findById(recipe_id);
  //  updatedUser = await User.findById(user_id);
  const token = generateToken(user_id)

  res.status(200).json({ message: user.followingData, token: token });

 } else {
   // Add to favourites
   await User.updateOne({ _id: user_id }, { $push: { 'followingData.following': target_id } });
   await User.updateOne({ _id: target_id }, { $push: { 'followingData.followers': user_id } });
  const token = generateToken(user_id)
  //  // Get updated objects
  //  updatedRecipe = await Recipe.findById(recipe_id);
  //  updatedUser = await User.findById(user_id);
  const user = await User.findById({_id: target_id})

  res.status(200).json({ message: user.followingData, token: token });
 }

//  return { updatedRecipe, updatedUser };
  } catch (error) {
    console.error("Error in toggleFollowing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function getPublicDetailsById(req, res) {
  const user_id = req.body.user_id;

  try {
    const publicUserDetails = await User.find({ _id: user_id }).select(
      "username profilePictureURL followingData.followingList"
    );
    const token = generateToken(req.user_id);
    res.status(200).json({ user_details: publicUserDetails, token: token });
  } catch (error) {
  //  console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
async function getPublicDetailsByUsername(req, res) {
  const username = req.body.username;

  try {
    const publicUserDetails = await User.find({ username: username }).select(
      "username profilePictureURL followingData.followingList"
    );
    const token = generateToken(req.user_id);
    res.status(200).json({ user_details: publicUserDetails, token: token });
  } catch (error) {
  //  console.log(error);
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
  getUserDetails: getUserDetails,

  //createFollowerRequest: createFollowerRequest,
  //deleteFollowing: deleteFollowing,
  getAllFollowingData: getAllFollowingData,

  getFollowingList: getFollowingList,
  getFollowerList: getFollowerList,
  toggleFollowing: toggleFollowing,
};

module.exports = UsersController;
