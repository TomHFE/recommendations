const request = require("supertest");
const app = require("../../app");
const User = require("../../src/models/user");
const { generateToken } = require("../../src/lib/token");
const { toggleFollowing } = require("../../src/controllers/users");
require("../mongodb_helper");
const mongoose = require("mongoose");


describe("/users", () => {
  let token, user1, user2;

  beforeEach(async () => {
    await User.deleteMany({});

    user1 = new User({ email: "user1@test.com", password: "password1!", username: "user1" });
    user2 = new User({ email: "user2@test.com", password: "password2!", username: "user2" });
    await user1.save();
    await user2.save();

    token = generateToken(user1._id);  
  });


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


describe("GET /users/get_user_details", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      email: "user@test.com",
      password: "password!",
      username: "user",
    });

    await user.save();
    token = generateToken(user._id); 
  });

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
    const invalidUserId = "invalidUserId"; 
    const invalidToken = generateToken(invalidUserId); 

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

    user1 = new User({ email: 'user1@test.com', password: 'password1!', username: 'user1' });
    user2 = new User({ email: 'user2@test.com', password: 'password2!', username: 'testUser' });
    await user1.save();
    await user2.save();

    token = generateToken(user1._id);
  });

  test('should return matching users based on username', async () => {
    const response = await request(app)
      .post('/users/find_by_username')
      .set('Authorization', `Bearer ${token}`)
      .send({ userSearchName: 'test' }); 

    expect(response.statusCode).toBe(201);
    expect(response.body.users.length).toBe(1);
    expect(response.body.users[0].username).toBe('testUser');
    expect(response.body.token).toBeDefined();
  });
})

describe("POST /users/get_public_details", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      email: "user@test.com",
      password: "password1!",
      username: "user1",
      profilePictureURL: "http://example.com/user1.jpg",
      followingData: { followingList: [] },
    });

    await user.save();
    token = generateToken(user._id);
  });

  test("should return public user details when a valid user ID is provided", async () => {
    const response = await request(app)
      .post("/users/public_details_id")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: user._id.toString() });

      expect(response.statusCode).toBe(200);
      expect(response.body.user_details[0].username).toBe(user.username); 
      expect(response.body.user_details[0].profilePictureURL).toBe(user.profilePictureURL); 
      expect(response.body.token).toBeDefined();
  });

  test("should return 500 when an invalid user ID is provided", async () => {
    const response = await request(app)
      .post("/users/public_details_id")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: "invalidUserId" });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toEqual("Server error");
  });
});

describe("POST /users/get_public_details_by_username", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      email: "user@test.com",
      password: "password1!",
      username: "user1",
      profilePictureURL: "http://example.com/user1.jpg",
      followingData: { followingList: [] },
    });

    await user.save();
    token = generateToken(user._id);
  });

  test("should return public user details when a valid username is provided", async () => {
    const response = await request(app)
      .post("/users/public_details_username")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: user.username });

    expect(response.statusCode).toBe(200);
    expect(response.body.user_details[0].username).toBe(user.username);
    expect(response.body.user_details[0].profilePictureURL).toBe(user.profilePictureURL);
    
    if (response.body.user_details[0].followingData) {
      expect(response.body.user_details[0].followingData.followingList).toEqual(user.followingData.followingList);
    }
    expect(response.body.token).toBeDefined();
  });

  test("should return a 404 error code when username is not found", async () => {
    const response = await request(app)
      .post("/users/public_details_by_username")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "nonexistentuser" }); 

      expect(response.statusCode).toBe(404);
    });
});

describe("GET /users/get_following_list", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      email: "user@test.com",
      password: "password1!",
      username: "user1",
      followingData: { following: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()] }, // Use 'new' to create ObjectId
    });

    await user.save();
    token = generateToken(user._id); 
  });

  test("should return the following list when user exists", async () => {
    // Mock User.exists to return true (user exists)
    jest.spyOn(User, 'exists').mockResolvedValue(true);

    const response = await request(app)
      .get("/users/get_following_list")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(201); 
    expect(response.body.message).toBe("OK"); 
    expect(response.body.user).toEqual(user.followingData.following.map(String)); // Check if the following list matches
    expect(response.body.token).toBeDefined(); 
  });

  test("should return 404 when user does not exist", async () => {
    jest.spyOn(User, 'exists').mockResolvedValue(null);

    const response = await request(app)
      .get("/users/get_following_list")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404); 
    expect(response.body.message).toBe("user does not exist"); 
  });

  test("should return 401 if there is an error", async () => {
    jest.spyOn(User, 'exists').mockResolvedValue(true);
    jest.spyOn(User, 'findById').mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get("/users/get_following_list")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(401); 
    expect(response.body.message).toContain("error message: Database error"); // Check the error message
  });
});

describe("GET /users/get_follower_list", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({}); 
  
    user = new User({
      _id: new mongoose.Types.ObjectId(), 
      email: "user@test.com",
      password: "password1!",
      username: "user1",
      followingData: { followers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()] }
    });
  
    await user.save(); 
    token = generateToken(user._id); 
  });
  

  test("should return the follower list when user exists", async () => {
    const mockedFollowers = [new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()];
  
    // Mock User.findById to return a user with the mocked followers
    jest.spyOn(User, 'findById').mockResolvedValue({
      _id: new mongoose.Types.ObjectId().toString(), // Mock a valid ObjectId string
      followingData: { followers: mockedFollowers } // Mock the followers array
    });
  
    jest.spyOn(User, 'exists').mockResolvedValue(true);
  
    const response = await request(app)
      .get("/users/get_follower_list")
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.statusCode).toBe(201); 
    expect(response.body.message).toBe("OK"); 
  
    // Compare the response's followers to the mocked followers array
    expect(response.body.user).toEqual(mockedFollowers); 
    expect(response.body.token).toBeDefined(); 
  });
  
  test("should return 404 when user does not exist", async () => {
    // Mock User.exists to return null (user does not exist)
    jest.spyOn(User, 'exists').mockResolvedValue(null);

    const response = await request(app)
      .get("/users/get_follower_list")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404); 
    expect(response.body.message).toBe("user does not exist"); 
  });

  test("should return 401 if there is an error", async () => {
    jest.spyOn(User, 'exists').mockResolvedValue(true);

    // Mock an error when User.findById is called
    jest.spyOn(User, 'findById').mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get("/users/get_follower_list")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(401); 
    expect(response.body.message).toContain("error message: Database error");
  });
});


describe("POST /users/get_user_by_id", () => {
  test("should return 500 if an invalid userId type is passed", async () => {
    const response = await request(app)
      .post("/users/get_user_by_id")
      .set("Authorization", `Bearer ${token}`)
      .send({ friendsIds: [12345] }); // Invalid type for user ID

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toContain("error retrieving users");
  });

  test("should return 201 and empty array when no matching users are found", async () => {
    const response = await request(app)
      .post("/users/get_user_by_id")
      .set("Authorization", `Bearer ${token}`)
      .send({ friendsIds: [new mongoose.Types.ObjectId()] });

    expect(response.body.message).toEqual("error retrieving users");
  });
});


describe("POST /users/get_public_details_by_username", () => {
  let token, user;

  beforeEach(async () => {
    await User.deleteMany({});

    user = new User({
      email: "user@test.com",
      password: "password1!",
      username: "user1",
      profilePictureURL: "http://example.com/user1.jpg",
      followingData: { followingList: [] },
    });

    await user.save();
    token = generateToken(user._id);
  });

  // Test successful retrieval of public details
  test("should return public user details when a valid username is provided", async () => {
    const response = await request(app)
      .post("/users/public_details_username")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: user.username });

    expect(response.statusCode).toBe(200);
    expect(response.body.user_details[0].username).toBe(user.username);
    expect(response.body.user_details[0].profilePictureURL).toBe(user.profilePictureURL);
    if (response.body.user_details[0].followingData) {
      expect(response.body.user_details[0].followingData.followingList).toEqual(user.followingData.followingList);
    }
    expect(response.body.token).toBeDefined();
  });

  // Test error handling: Simulate an error in the User.find query
  test("should return a 500 error if there is an internal server error", async () => {
    // Mock User.find to throw an error
    jest.spyOn(User, 'find').mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .post("/users/public_details_username")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: user.username });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toEqual("Server error");
  });
});


jest.mock('../../src/models/user.js');

describe('toggleFollowing', () => {
  let req, res;

  beforeEach(() => {
    // Mocking req and res objects
    req = {
      user_id: 'mockUserId',
      body: { target_id: 'mockTargetId' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should follow the target user if not already followed', async () => {
    // Mocking User.findById to return user and target user
    User.findById.mockResolvedValueOnce({
      _id: 'mockUserId',
      followingData: { following: [] },
      save: jest.fn(),
    });

    User.findById.mockResolvedValueOnce({
      _id: 'mockTargetId',
      followingData: { followers: [] },
      save: jest.fn(),
    });

    await toggleFollowing(req, res);

    expect(User.findById).toHaveBeenCalledTimes(2);

    // Expect followers and following to be updated
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'mockTargetId followed',
      token: expect.any(String),
    });
  });

  it('should unfollow the target user if already followed', async () => {
    User.findById.mockResolvedValueOnce({
      _id: 'mockUserId',
      followingData: { following: ['mockTargetId'] },
      save: jest.fn(),
    });

    User.findById.mockResolvedValueOnce({
      _id: 'mockTargetId',
      followingData: { followers: ['mockUserId'] },
      save: jest.fn(),
    });

    await toggleFollowing(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'mockTargetId unfollowed',
      token: expect.any(String),
    });
  });


  it('should handle errors during the process', async () => {
    User.findById.mockRejectedValueOnce(new Error('Database error'));
    await toggleFollowing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

});
