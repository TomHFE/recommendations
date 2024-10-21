const request = require("supertest");
const app = require("../../app");
const User = require("../../src/models/user");
const { generateToken } = require("../../src/lib/token");
require("../mongodb_helper");



describe("/users", () => {
  let token, user1, user2;

  beforeEach(async () => {
    await User.deleteMany({});

    // Create two users and generate their tokens
    user1 = new User({ email: "user1@test.com", password: "password1!", username: "user1" });
    user2 = new User({ email: "user2@test.com", password: "password2!", username: "user2" });
    await user1.save();
    await user2.save();

    token = generateToken(user1._id);  
  });



  // Test user creation with email, username, and password
  describe("POST /users, when valid details provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`) 
        .send({ email: "poppy@email.com", password: "1234567L!", username: "poppy" });

      expect(response.statusCode).toBe(201);
    });

    describe("POST /users, when username is missing", () => {
      test("the response code is 400", async () => {
        const response = await request(app)
          .post("/users")
          .set("Authorization", `Bearer ${token}`)  
          .send({ email: "testuser@test.com", password: "validPass1!" });
    
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Something went wrong");
      });
    });

    describe("POST /users, when password is too short", () => {
      test("the response code is 400", async () => {
        const response = await request(app)
          .post("/users")
          .set("Authorization", `Bearer ${token}`)  
          .send({ email: "shortpass@test.com", password: "123", username: "shortpassuser" });
    
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Password invalid");
      });
    });


  describe("POST /users, when email is incorrectly formatted", () => {
    test("the response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)  
        .send({ email: "invalidemail@", password: "ValidPass1!", username: "newuser" });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("Email address invalid");
    });
  });
    

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)  
        .send({ email: "scarconstt@email.com", password: "1234567L!", username: "scarconstt" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
      expect(newUser.username).toEqual("scarconstt");
    });
  });

  // Test user creation with existing username
  describe("POST /users, when username already exists", () => {
    test("the response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)  
        .send({ email: "newemail@test.com", password: "validPass1!", username: "user1" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("Username already exists");
    });
  });

  // Test user creation with existing email
  describe("POST /users, when email already exists", () => {
    test("the response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)  
        .send({ email: "user1@test.com", password: "validPass1!", username: "newusername" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("Email already exists");
    });
  });

  // Test user creation with missing password
  describe("POST /users, when password is missing", () => {
    test("the response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`) 
        .send({ email: "newemail@test.com", username: "newusername" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("Password is missing");
    });
  });

  // Test user creation with invalid password
  describe("POST /users, when password is invalid", () => {
    test("the response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)  
        .send({ email: "newemail@test.com", password: "123", username: "newusername" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("Password invalid");
    });
  });

  // Test user creation with invalid email
  describe("POST /users, when email is invalid", () => {
    test("the response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)  
        .send({ email: "invalid-email", password: "validPass1!", username: "newusername" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("Email address invalid");
    });
  });

  // Test fetching all users (GET /users)
  describe("GET /users", () => {
    test("the response code is 200 and returns all users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);  

      expect(response.statusCode).toBe(200);
      expect(response.body.message.length).toBe(2);  // 2 users in beforeEach
    });
  });
});
