const request = require("supertest");
const app = require("../../app");
const User = require("../../src/models/user");
const { generateToken } = require("../../src/lib/token");
const { toggleFollowing } = require("../../src/controllers/users");
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
    

    test("POST /users, a user is created", async () => {
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

  // Testing the get_user_by_id 
  describe("GET users/get_user_by_id", () => {
    let token, user1, user2;

    beforeEach(async () => {
      await User.deleteMany({});

      user1 = new User({
        email: "user1@test.com",
        password: "password1!",
        username: "user1",
      });
      user2 = new User({
        email: "user2@test.com",
        password: "password2!",
        username: "user2",
      });

      await user1.save();
      await user2.save();

      token = generateToken(user1._id); 
    });

    // Test successful retrieval of multiple users by ID
    test("should return users by their IDs", async () => {
      const response = await request(app)
        .post("/users/get_user_by_id")
        .set("Authorization", `Bearer ${token}`)
        .send({
          friendsIds: [user1._id.toString(), user2._id.toString()],
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message.length).toBe(2); 
      expect(response.body.message[0].email).toEqual(user1.email);
      expect(response.body.message[1].email).toEqual(user2.email);
      if (response.body.token) {
        expect(response.body.token).toBeDefined();
      }
        });

    // Test successful retrieval of a single user by ID
    test("should return a single user by ID when only one is provided", async () => {
      const response = await request(app)
        .post("/users/get_user_by_id")
        .set("Authorization", `Bearer ${token}`)
        .send({
          friendsIds: user1._id.toString(),
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message.email).toEqual(user1.email);
      if (response.body.token) {
        expect(response.body.token).toBeDefined();
      }
        });

    // Test error handling when an invalid ID is passed
    test("should return an error message when an invalid user ID is provided", async () => {
      const invalidId = "invalidUserId";
      const response = await request(app)
        .post("/users/get_user_by_id")
        .set("Authorization", `Bearer ${token}`)
        .send({
          friendsIds: [invalidId],
        });

      expect(response.body.message).toContain("error retrieving users");
    });

    // Test handling when no friendsIds are passed in the request
    test("should return 500 when no friendsIds are provided", async () => {
      const response = await request(app)
        .post("/users/get_user_by_id")
        .set("Authorization", `Bearer ${token}`)
        .send({
          friendsIds: [],
        });

      expect(response.body.message).toBeDefined();
      });


  // Test successful retrieval of multiple users by IDs
  test("should return users by their IDs", async () => {
    const response = await request(app)
      .post("/users/get_user_by_id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        friendsIds: [user1._id.toString(), user2._id.toString()],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message.length).toBe(2); 
    expect(response.body.message[0].email).toEqual(user1.email);
    expect(response.body.message[1].email).toEqual(user2.email);
    expect(response.body.token).toBeDefined();
  });


  // Test error handling when an invalid ID is passed
  test("should return an error message when an invalid user ID is provided", async () => {
    const invalidId = "invalidUserId";
    const response = await request(app)
      .post("/users/get_user_by_id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        friendsIds: [invalidId],
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toContain("error retrieving users");
  });


  // Test handling when friendsIds is not an array
  test("should return 500 when friendsIds is not an array", async () => {
    const response = await request(app)
      .post("/users/get_user_by_id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        friendsIds: "notAnArray",
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toContain("error retrieving users");
  });
});




const request = require("supertest");
const app = require("../../app");
const User = require("../../src/models/user");
const { generateToken } = require("../../src/lib/token");
require("../mongodb_helper");

describe("GET /users/get_user_details", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({});

    // Create a user for testing
    user = new User({
      email: "user@test.com",
      password: "password!",
      username: "user",
    });

    await user.save();
    token = generateToken(user._id); 
  });

  // Test successful retrieval of user details
  test("should return user details when a valid user ID is provided", async () => {
    const response = await request(app)
      .get("/users/get_user_details")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.message[0].email).toEqual(user.email);
    expect(response.body.token).toBeDefined();
  });

 // Test error handling when the user ID is invalid
 test("should return a 404 error when user ID is invalid", async () => {
  const invalidUserId = "invalidUserId"; // An invalid ObjectId
  const invalidToken = generateToken(invalidUserId); // Generate token with invalid ID

  const response = await request(app)
    .get("/users/get_user_details")
    .set("Authorization", `Bearer ${invalidToken}`);

  expect(response.statusCode).toBe(404);
});
});

describe('POST /users/findByUsername', () => {
  let token, user1, user2;

  beforeEach(async () => {
    await User.deleteMany({});

    // Create test users
    user1 = new User({ email: 'user1@test.com', password: 'password1!', username: 'user1' });
    user2 = new User({ email: 'user2@test.com', password: 'password2!', username: 'testUser' });
    await user1.save();
    await user2.save();

    // Generate token
    token = generateToken(user1._id);
  });

  test('should return matching users based on username', async () => {
    const response = await request(app)
      .post('/users/findByUsername')
      .set('Authorization', `Bearer ${token}`)
      .send({ userSearchName: 'test' }); 

    expect(response.statusCode).toBe(201);
    expect(response.body.users.length).toBe(1);
    expect(response.body.users[0].username).toBe('testUser');
    expect(response.body.token).toBeDefined();
  });
})
})