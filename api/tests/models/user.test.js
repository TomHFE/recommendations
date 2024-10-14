require("../mongodb_helper");
const User = require("../../models/user");

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
  it("can add incoming requests", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username: "someone-12345",
      friendsData: {
        incomingRequests: ['6700059cf4b7d7882098a353']
      }
    });

    await user.save();
    const users = await User.find();

    expect(users[0].friendsData.incomingRequests.length).toEqual(1);
    expect(users[0].friendsData.incomingRequests[0].toString()).toEqual("6700059cf4b7d7882098a353");
  });
  it("can add friends list", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username: "someone-12345",
      friendsData: {
        friendsList: ['6700059cf4b7d7882098a353']
      }
    });

    await user.save();
    const users = await User.find();

    expect(users[0].friendsData.friendsList.length).toEqual(1);
    expect(users[0].friendsData.friendsList[0].toString()).toEqual("6700059cf4b7d7882098a353");
  });
});
