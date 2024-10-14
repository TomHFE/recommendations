const request = require("supertest");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email, username, password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", username: "someone-12345", password: "1234567L!" });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "1234567L!", username: "someone-12345" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
      expect(newUser.username).toEqual("someone-12345");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com", username: "someone-12345" });
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234", username: "someone-12345" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });



// user sends friend request


  describe("POST, when user sends friend request", () => {
    test("response code is 201", async () => {
      const user1 = new User({
        email: "alexhall@test.com",
        password: "Passwordencrypted!",
        username: "someone-12345",
      });
      
      const user2 = new User({
        email: "tomengland@test.com",
        password: "Passwordencrypted!",
        username: "someoneelse-12345",
      });
      await user1.save()
      await user2.save()

        const friendRequest = await request(app)
        .post("/users/friend_request")
        .send({senderId: user2._id, recipientId: user1._id})
        
        expect(friendRequest.statusCode).toEqual(201);
      });
    });

    describe("POST, when request is sent with wrong recipient 404", () => {

        test("response code is 404", async () => {
          
          const user1 = new User({
            email: "alexhall@test.com",
            password: "Passwordencrypted!",
            username: "someone-12345",
          });
          
          const user2 = new User({
            email: "tomengland@test.com",
            password: "Passwordencrypted!",
            username: "someoneelse-12345",
          });
          await user1.save()
          await user2.save()
          
          const friendRequest = await request(app)
          .post("/users/friend_request")
          .send({senderId: user2._id, recipientId: '6703e8ff4c0cab5c923d38e6'})
          expect(friendRequest.statusCode).toEqual(404);
        });
      });
      describe("POST, when request is sent with wrong recipient 402", () => {

        test("response code is 402", async () => {
          
          const user1 = new User({
            email: "alexhall@test.com",
            password: "Passwordencrypted!",
            username: "someone-12345",
          });
          
          const user2 = new User({
            email: "tomengland@test.com",
            password: "Passwordencrypted!",
            username: "someoneelse-12345",
          });
          await user1.save()
          await user2.save()
          
          const friendRequest = await request(app)
          .post("/users/friend_request")
          .send({senderId: user2._id, recipientId: user1._id})
          const friendRequestSentTwice = await request(app)
          .post("/users/friend_request")
          .send({senderId: user2._id, recipientId: user1._id})
          expect(friendRequestSentTwice.statusCode).toEqual(402);
        });
      });


      
      // when user accepts friend request
      
      describe("POST, when user accepts sends friend request", () => {
        test("response code is 201", async () => {
          
          const user1 = new User({
            email: "alexhall@test.com",
            password: "Passwordencrypted!",
            username: "someone-12345",
          });
          
          const user2 = new User({
            email: "tomengland@test.com",
            password: "Passwordencrypted!",
            username: "someoneelse-12345",
          });
          await user1.save()
          await user2.save()
          
          
          
          const friendRequest = await request(app)
          .post("/users/friend_request")
          .send({senderId: user2._id, recipientId: user1._id})
          const accept_friend_request = await request(app)
          .post("/users/accept_friend_request")
          .send({senderId: user2._id, recipientId: user1._id})
          
          expect(accept_friend_request.statusCode).toEqual(201);
          
        });
      });  

      describe("POST, when user tries to accept friend request but recipient doesnt exist", () => {
        test("response code is 404", async () => {
    
          const user1 = new User({
            email: "alexhall@test.com",
            password: "Passwordencrypted!",
            username: "someone-12345",
          });
          
          const user2 = new User({
            email: "tomengland@test.com",
            password: "Passwordencrypted!",
            username: "someoneelse-12345",
          });
          await user1.save()
          await user2.save()
    
           
    
            const friendRequest = await request(app)
            .post("/users/accept_friend_request")
            .send({senderId: user2._id, recipientId: '6703e8ff4c0cab5c923d38e6'})
            
            expect(friendRequest.statusCode).toEqual(404);
    
        });
      });  

    // when user declines friend request

      describe("POST, when user declines friend request", () => {
        test("response code is 201", async () => {
    
          const user1 = new User({
            email: "alexhall@test.com",
            password: "Passwordencrypted!",
            username: "someone-12345",
          });
          
          const user2 = new User({
            email: "tomengland@test.com",
            password: "Passwordencrypted!",
            username: "someoneelse-12345",
          });
          await user1.save()
          await user2.save()
    
        
            const friendRequest = await request(app)
            .post("/users/friend_request")
            .send({senderId: user2._id, recipientId: user1._id})
            const decline_friend_request = await request(app)
            .post("/users/decline_friend_request")
            .send({senderId: user2._id, recipientId: user1._id})
  
            expect(decline_friend_request.statusCode).toEqual(201);
    
        });
  });  

  describe("POST, when user tries to decline friend request but recipient doesnt exist", () => {
    test("response code is 404", async () => {

      const user1 = new User({
        email: "alexhall@test.com",
        password: "Passwordencrypted!",
        username: "someone-12345",
      });
      
      const user2 = new User({
        email: "tomengland@test.com",
        password: "Passwordencrypted!",
        username: "someoneelse-12345",
      });
      await user1.save()
      await user2.save()

      
        const friendRequest = await request(app)
        .post("/users/decline_friend_request")
        .send({senderId: user2._id, recipientId: '6703e8ff4c0cab5c923d38e6'})
        
        expect(friendRequest.statusCode).toEqual(404);

    });
  });  

  describe("POST, when user tries to decline friend request but sender not in recipients incoming request list", () => {
    test("response code is 402", async () => {

      const user1 = new User({
        email: "alexhall@test.com",
        password: "Passwordencrypted!",
        username: "someone-12345",
      });
      
      const user2 = new User({
        email: "tomengland@test.com",
        password: "Passwordencrypted!",
        username: "someoneelse-12345",
      });
      await user1.save()
      await user2.save()

      
        const friendRequest = await request(app)
        .post("/users/decline_friend_request")
        .send({senderId: user2._id, recipientId: user1._id})
        
        expect(friendRequest.statusCode).toEqual(402);

    });
  });  

  // get users friend requests

  describe("GET, when user gets friend request list", () => {
    test("response code is 201", async () => {

      const user1 = new User({
        email: "alexhall@test.com",
        password: "Passwordencrypted!",
        username: "someone-12345",
      });
      
      const user2 = new User({
        email: "tomengland@test.com",
        password: "Passwordencrypted!",
        username: "someoneelse-12345",
      });
      await user1.save()
      await user2.save()

    
        const friendRequest = await request(app)
        .post("/users/friend_request")
        .send({senderId: user2._id, recipientId: user1._id})
        const get_incoming_requests = await request(app)
        .get("/users/get_incoming_requests")
        .send({userId: user1._id})

        expect(get_incoming_requests.statusCode).toEqual(201);

    });
});  
describe("GET, when user fails to get incoming request as userId doesnt exist", () => {
  test("response code is 404", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });
    await user1.save()
    await user2.save()

  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const get_incoming_requests = await request(app)
      .get("/users/get_incoming_requests")
      .send({userId: '6703f8250d25d3f7caea9db2'})

      expect(get_incoming_requests.statusCode).toEqual(404);

  });
}); 

// delete friend from friends list

describe("PATCH, friend deleted from friends list", () => {
  test("response code is 201", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });
    await user1.save()
    await user2.save()

  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const accept_friend_request = await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user1._id, senderId: user2._id})
      
      const delete_friend = await request(app)
      .patch("/users/delete_friend")
      .send({userId: user1._id, friendId: user2._id})
      

      expect(delete_friend.statusCode).toEqual(201);

  });
}); 
describe("PATCH, friend deleted from friends list but friend not in friend list", () => {
  test("response code is 402", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });
    await user1.save()
    await user2.save()

  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const accept_friend_request = await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user1._id, senderId: user2._id})
      
      const delete_friend = await request(app)
      .patch("/users/delete_friend")
      .send({userId: user1._id, friendId: "67051162137ea954dc6fe171"})

      console.log(user2)

      expect(delete_friend.statusCode).toEqual(402);

  });
}); 
describe("PATCH, friend deleted from friends list but user does not exist", () => {
  test("response code is 404", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });
    await user1.save()
    await user2.save()

  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const accept_friend_request = await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user1._id, senderId: user2._id})
      
      const delete_friend = await request(app)
      .patch("/users/delete_friend")
      .send({userId: "67051162137ea954dc6fe171", friendId: user2._id})


      expect(delete_friend.statusCode).toEqual(404);

  });
}); 


// get all friends data

describe("GET, Get all friends data", () => {
  test("response code is 201", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });
    await user1.save()
    await user2.save()

  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const accept_friend_request = await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user1._id, senderId: user2._id})
      
      const get_friends_list = await request(app)
      .get("/users/get_friends_list")
      .send({userId: user1._id})

     await console.log(get_friends_list.body.incomingRequestList.friendsData.friendsList[0])

      expect(get_friends_list.statusCode).toEqual(201);

  });
}); 
describe("GET, Get all friends data, user does not exist", () => {
  test("response code is 404", async () => {
 
      
      const get_friends_list = await request(app)
      .get("/users/get_friends_list")
      .send({userId: '670513aca8da15d50a510134'})


      expect(get_friends_list.statusCode).toEqual(404);

  });
}); 


// get user by id

describe("GET, Get all users by id", () => {
  test("response code is 201", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });
    await user1.save()
    await user2.save()

  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const accept_friend_request = await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user1._id, senderId: user2._id})
      
      const get_friends_data = await request(app)
      .get("/users/get_user_by_id")
      .send({userId: user1._id})

    //  await console.log(get_friends_list.body.incomingRequestList.friendsData.friendsList[0])

      expect(get_friends_data.statusCode).toEqual(201);

  });
}); 
describe("GET, Get all users by id", () => {
  test("response code is 201", async () => {

    const user1 = new User({
      email: "alexhall@test.com",
      password: "Passwordencrypted!",
      username: "someone-12345",
    });
    
    const user2 = new User({
      email: "tomengland@test.com",
      password: "Passwordencrypted!",
      username: "someoneelse-12345",
    });

    const user3 = new User({
      email: "dave@test.com",
      password: "Passwordencrypted!",
      username: "someoneelseelse-12345",
    });
    await user1.save()
    await user2.save()
    await user3.save()
  
      const friendRequest = await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user1._id})
      const accept_friend_request = await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user1._id, senderId: user2._id})
      await request(app)
      .post("/users/friend_request")
      .send({senderId: user2._id, recipientId: user3._id})
      await request(app)
      .post("/users/accept_friend_request")
      .send({recipientId: user3._id, senderId: user2._id})
      const get_friends_list = await request(app)
      .get("/users/get_friends_list")
      .send({userId: user2._id})
      const get_friends_data = await request(app)
      .get("/users/get_user_by_id")
      .send({userId: get_friends_list.body.incomingRequestList.friendsData.friendsList})

      await console.log(get_friends_data.body.message)

      expect(get_friends_data.statusCode).toEqual(201);

  });
}); 

});
