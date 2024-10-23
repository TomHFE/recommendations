const UsersController = require("../../src/controllers/users");
const app = require("../../app");
const User = require("../../src/models/user");
const request = require("supertest");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Mock the JWT token for the tests
  function generateMockToken(userId) {
    const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
  }

  describe("EmailValidation", () => {
    describe("Email does not follow valid format", () => {
      test("email has no @", () => {
        const wrongEmail = 'thisiswrong_gmail.com';
        const verify = UsersController.verifyEmail(wrongEmail);
        expect(verify).toEqual(false);
      });

      test("email has no domain", () => {
        const wrongEmail = 'test@wrong';
        const verify = UsersController.verifyEmail(wrongEmail);
        expect(verify).toEqual(false);
      });

      test("valid email format", () => {
        const validEmail = 'test@gmail.com';
        const verify = UsersController.verifyEmail(validEmail);
        expect(verify).toEqual(true);
      });
    });

    describe("Email already exists", () => {
      test("correct response code and correct response message", async () => {
        // First, create a mock user
        const token = generateMockToken("dummyUserId");

        await request(app)
          .post("/users")
          .set("Authorization", `Bearer ${token}`) // Mock token
          .send({ email: "tomengland1995@gmail.com", username: "someone-12345", password: "Password123!" });

        // Attempt to create another user with the same email
        const response = await request(app)
          .post("/users")
          .set("Authorization", `Bearer ${token}`) // Mock token
          .send({ email: "tomengland1995@gmail.com", username: "someone-123456", password: "Password123!" });

        expect(response.body.message).toBe('Email already exists');
        expect(response.statusCode).toBe(400);
      });
    });

    describe("Wrong email format", () => {
      test("incorrect email format should return validation error", async () => {
        const token = generateMockToken("dummyUserId");

        const response = await request(app)
          .post("/users")
          .set("Authorization", `Bearer ${token}`) 
          .send({ email: "tomengland19gmail.com", username: "someone-12345", password: "Password123!" });

        expect(response.body.message).toBe('Email address invalid');
        expect(response.statusCode).toBe(400);
      });

      test("missing email should return validation error", async () => {
        const token = generateMockToken("dummyUserId");

        const response = await request(app)
          .post("/users")
          .set("Authorization", `Bearer ${token}`) 
          .send({ username: "someone-12345", password: "Password123!" });

        expect(response.body.message).toBe('Email address invalid');
        expect(response.statusCode).toBe(400);
      });
    });
  });


  
});
