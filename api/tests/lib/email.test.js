// import UsersController from "../../controllers/users";
const  UsersController  = require("../../controllers/users")
const app = require("../../app");
const User = require("../../models/user");
const request = require("supertest");
require("../mongodb_helper");


describe("/users", () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });


describe("EmailValidation", () => {
    describe("Email does not follow valid format", () => {
        test("email has no @", () => {

        const wrongEmail = 'thisiswrong_gmail.com';
        const verify = UsersController.verifyEmail(wrongEmail)
        
        
        expect(verify).toEqual(false);
      });
    });
    describe("Email already exists", () => {
    test("correct response code and correct response message", async () => {
        const response = await request(app)
        .post("/users")
        .send({ email: "tomengland1995@gmail.com", username: "someone-12345", password: "Password123!" })
        const response_2 = await request(app)
        .post("/users")
        .send({ email: "tomengland1995@gmail.com", username: "someone-123456", password: "Password123!" });
        expect(response_2.body.message).toBe('Email already exists')
        expect(response_2.statusCode).toBe(400);
    });
      });
      describe("wrong email format", () => {
        test("wrong email format", async () => {
            const response = await request(app)
            .post("/users")
            .send({ email: "tomengland19gmail.com", username: "someone-12345", password: "Password123!" })
            expect(response.body.message).toBe('Email address invalid')
            expect(response.statusCode).toBe(400);
        });
          });
    });
  });
  