require("../mongodb_helper");
const User = require("../../src/models/user");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("has a username, email and password", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username: "someone-12345"
    });
    expect(user.password).toEqual("password");
    expect(user.email).toEqual("someone@example.com");
    expect(user.username).toEqual("someone-12345");
  });

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username: "someone-12345"
    });

    await user.save();
    const users = await User.find();

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
    expect(users[0].username).toEqual("someone-12345");
  });

  it("can add followers", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username: "someone-12345",
      followingData: {
        followers: ['6700059cf4b7d7882098a353']
      }
    });
  
    await user.save();
    const users = await User.find();
  
    expect(users[0].followingData.followers.length).toEqual(1);
    expect(users[0].followingData.followers[0].toString()).toEqual("6700059cf4b7d7882098a353");
  });
  
  it("can add following list", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username: "someone-12345",
      followingData: {
        following: ['6700059cf4b7d7882098a353']
      }
    });
  
    await user.save();
    const users = await User.find();
  
    expect(users[0].followingData.following.length).toEqual(1);
    expect(users[0].followingData.following[0].toString()).toEqual("6700059cf4b7d7882098a353");
  });
});
