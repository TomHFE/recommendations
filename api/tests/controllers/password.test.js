
const bcrypt = require("bcrypt")

const verifyPassword = require('../../src/utilities/passCheck')
require("../mongodb_helper");


describe("verifyPassword",  () => {
  test("Returns true if the password is hashed correctly", async () => {
    const password = 'tomsmells'
    const hashedPassword = await bcrypt.hash(password, 10)
    const verifedPassword = await verifyPassword(password, hashedPassword)
    expect(verifedPassword).toBe(true)
  })

})
// describe("/users", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});
//   });
// //   when you login with a specific password it will be the same as a password we have hashed of the same input
//   describe("When login password is hashed", () => {
//     test("the response code is 201", async () => {
//       const response = await request(app)
//         .post("/users")
//         .send({ email: "poppy@email.com", username: "someone-12345", password: "Password123!" });
//         const users = await User.findOne({email: "poppy@email.com"});

//         expect(users.password).not.toEqual("Password123!");
//         // expect(response.statusCode).toBe(201);
//     });
// })
// describe("When login password can be compared through verification", () => {
//     test("verify password is same returns true", async () => {
//       const response = await request(app)
//         .post("/users")
//         .send({ email: "poppy@email.com", username: "someone-12345", password: "Password123!" });
//         const users = await User.findOne({email: "poppy@email.com"});
//         const passwordIsTrue = await verifyPassword("Password123!", users.password)
//         expect(passwordIsTrue).toEqual(true);
//     });
// })
// describe("When login password can be compared through verification", () => {
//     test("verify password is not the same returns false", async () => {
//       const response = await request(app)
//         .post("/users")
//         .send({ email: "poppy@email.com", username: "someone-12345", password: "Password123!" });
//         const users = await User.findOne({email: "poppy@email.com"});
//         const passwordIsTrue = await verifyPassword("wrong!", users.password)
//         expect(passwordIsTrue).toEqual(false);
//     });
// })
// })

//     test("a user is created", async () => {
//       await request(app)
//         .post("/users")
//         .send({ email: "scarconstt@email.com", password: "1234", username: "someone-12345" });

//       const users = await User.find();
//       const newUser = users[users.length - 1];
//       expect(newUser.email).toEqual("scarconstt@email.com");
//       expect(newUser.username).toEqual("someone-12345");
//     });
//   });
// })

// // test("a user is created", async () => {
// //     await request(app)
// //       .post("/users")
// //       .send({ email: "scarconstt@email.com", password: "1234", username: "someone-12345" });

// //     const users = await User.find();
// //     const newUser = users[users.length - 1];
// //     expect(newUser.email).toEqual("scarconstt@email.com");
// //     expect(newUser.username).toEqual("someone-12345");