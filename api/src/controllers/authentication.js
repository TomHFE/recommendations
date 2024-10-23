const User = require("../models/user");
const { generateToken } = require("../lib/token");
const verifyPassword = require("../utilities/passCheck");

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  //console.log("user, line 9: ", user)
  let passwordVerified = false
  if (user) {
    passwordVerified = await verifyPassword(password, user.password);
  }

  if (!user) {
   // console.log("Auth Error: User not found");
    res.status(401).json({ message: "User not found" });
  } else if (!passwordVerified) {
  //  console.log("Auth Error: Passwords do not match");
    res.status(406).json({ message: "Password incorrect" });
  } else {
    const token = generateToken(user.id);
    res.status(201).json({ token: token, message: "OK" });
  }
}

const AuthenticationController = {
  createToken: createToken,
};

module.exports = AuthenticationController;
