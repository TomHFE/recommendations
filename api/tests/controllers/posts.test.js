const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      user_id: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let token;
describe("/posts", () => {
  beforeAll(async () => {
    const user = new User({
      email: "post-test@test.com",
      password: "12345678",
      username: "someone-12345"
    });
    await user.save();
    await Post.deleteMany({});
    token = createToken(user.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
    });

    test("creates multiple posts and lists them newest first", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World 1!!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World 2!!" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World 3!!" });

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send()

      const posts = response.body.posts;
      expect(posts.length).toEqual(3);
      expect(posts[0].message).toBe("Hello World 3!!");
      expect(posts[1].message).toEqual("Hello World 2!!");
      expect(posts[2].message).toEqual("Hello World 1!!");
    })

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);

      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
      });
      const post1 = new Post({ message: "some message", user: user });
      const post2 = new Post({ message: "I've never cared for GOB", user: user });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("Gets user details alongside the post", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345",
        profilePictureURL: "https://www.todayifoundout.com/wp-content/uploads/2015/02/smell.png"
      });
      await user.save()
      console.log('this is user:      ', user)
      const post1 = new Post({ message: "some message", pictureURL: "https://dankmemer.lol/gif/pepe-dancing.gif", user: user });
      await post1.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);
      console.log('this is the console.log:  ', response.body.posts[0])
      expect(response.status).toEqual(200);
      expect(response.body.posts[0].user.username).toBe("someone-12345");
      expect(response.body.posts[0].user.profilePictureURL).toBe("https://www.todayifoundout.com/wp-content/uploads/2015/02/smell.png");
    })

    test("Gets picture URL in a post", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
        
      });

      const post1 = new Post({ message: "some message", pictureURL: "https://dankmemer.lol/gif/pepe-dancing.gif", user: user });
      await post1.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body.posts[0].pictureURL).toBe("https://dankmemer.lol/gif/pepe-dancing.gif");
    })

    test("returns every post in the collection", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
      });
      const post1 = new Post({ message: "howdy!", user: user });
      const post2 = new Post({ message: "hola!", user: user });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      const firstPost = posts[0];
      const secondPost = posts[1];

      expect(firstPost.message).toEqual("howdy!");
      expect(secondPost.message).toEqual("hola!");
    });

    test("returns a new token", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
      });
      const post1 = new Post({ message: "First Post!", user: user });
      const post2 = new Post({ message: "Second Post!", user: user });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
      });
      const post1 = new Post({ message: "howdy!", user: user });
      const post2 = new Post({ message: "hola!", user: user });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
      });
      const post1 = new Post({ message: "howdy!", user: user });
      const post2 = new Post({ message: "hola!", user: user });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const user = new User({
        email: "post-test@test.com",
        password: "12345678",
        username: "someone-12345"
      });
      const post1 = new Post({ message: "howdy!", user: user });
      const post2 = new Post({ message: "hola!", user: user });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });
});
