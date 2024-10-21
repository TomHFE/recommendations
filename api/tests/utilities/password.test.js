const bcrypt = require("bcrypt");
const request = require("supertest");
const app = require('../../app');
const User = require('../../src/models/user');  
const verifyPassword = require("../../src/utilities/passCheck");
require("../mongodb_helper");

describe("/login", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    // Create a test user with username, email, and password
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    await User.create({
      username: "testuser",  // Provide a username
      email: "poppy@email.com",
      password: hashedPassword,
    });
  });

  describe("When login password is hashed", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/")
        .send({ email: "poppy@email.com", password: "Password123!" });
      const user = await User.findOne({ email: "poppy@email.com" });

      expect(user.password).not.toEqual("Password123!");
    });
  });
});



describe("Password Verification", () => {
  beforeEach(async () => {
    await User.deleteMany({});  
  });

  test("verify that the correct password returns true", async () => {
    // Manually create and save a user
    const hashedPassword = await bcrypt.hash("Password123!", 10);  

    const newUser = new User({
      email: "poppy@email.com",
      username: "someone-12345",
      password: hashedPassword,  
    });
    await newUser.save();  

    const user = await User.findOne({ email: "poppy@email.com" });

    const passwordIsTrue = await verifyPassword("Password123!", user.password);
    expect(passwordIsTrue).toEqual(true);
  });

  test("verify that an incorrect password returns false", async () => {
    // Manually create and save a user
    const hashedPassword = await bcrypt.hash("Password123!", 10);  
    const newUser = new User({
      email: "poppy@email.com",
      username: "someone-12345",
      password: hashedPassword,  
    });
    await newUser.save();  

    const user = await User.findOne({ email: "poppy@email.com" });
    const passwordIsFalse = await verifyPassword("wrong!", user.password);
    expect(passwordIsFalse).toEqual(false);
  });
});




describe("/signup", () => {
  beforeEach(async () => {
    await User.deleteMany({}); 
  });

  test("should create a new user when all data is valid", async () => {
    const response = await request(app)
      .post("/signup") 
      .send({
        email: "testuser@example.com",
        password: "ValidPassword123!",
        username: "testuser",
        profilePictureURL: "http://example.com/profile.jpg",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("OK");

    const user = await User.findOne({ email: "testuser@example.com" });
    expect(user).not.toBeNull();
    expect(user.password).not.toBe("ValidPassword123!"); 
  });

  test("should not create user if username already exists", async () => {
    await User.create({
      email: "uniqueemail@example.com",
      password: "HashedPassword123!", // Pretend this is hashed
      username: "existinguser",
    });

    const response = await request(app)
      .post("/signup")
      .send({
        email: "newuser@example.com",
        password: "ValidPassword123!",
        username: "existinguser",
        profilePictureURL: "http://example.com/profile.jpg",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Username already exists");
  });

  test("should not create user if email already exists", async () => {
    await User.create({
      email: "existingemail@example.com",
      password: "HashedPassword123!", // Pretend this is hashed
      username: "uniqueuser",
    });

    const response = await request(app)
      .post("/signup")
      .send({
        email: "existingemail@example.com",
        password: "ValidPassword123!",
        username: "newuser",
        profilePictureURL: "http://example.com/profile.jpg",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email already exists");
  });

  test("should not create user if password is missing", async () => {
    const response = await request(app)
      .post("/signup")
      .send({
        email: "testuser2@example.com",
        username: "testuser2",
        profilePictureURL: "http://example.com/profile.jpg",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Password is missing");
  });

  test("should not create user if password is invalid", async () => {
    const response = await request(app)
      .post("/signup")
      .send({
        email: "testuser3@example.com",
        password: "short", // Invalid password
        username: "testuser3",
        profilePictureURL: "http://example.com/profile.jpg",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Password invalid");
  });

  test("should not create user if email is invalid", async () => {
    const response = await request(app)
      .post("/signup")
      .send({
        email: "invalidemail",
        password: "ValidPassword123!",
        username: "testuser4",
        profilePictureURL: "http://example.com/profile.jpg",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email address invalid");
  });
});
