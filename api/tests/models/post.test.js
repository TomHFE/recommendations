require("../mongodb_helper");
const Post = require("../../models/post");
const ObjectId = require('mongodb').ObjectId;


describe("Post model", () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it("has a message", () => {
    const post = new Post({ message: "some message" });
    expect(post.message).toEqual("some message");
  });

  it("has a pictureURL", () => {
    const post = new Post({ pictureURL: "example.com" });
    expect(post.pictureURL).toEqual("example.com");
  })

  it("has a date when it was created", async () => {
    const fakeUserId = new ObjectId();
    const mockDate = new Date('2024-10-04T12:04:15.024Z');
    const post = new Post({ message: "some message", user: fakeUserId, created_at: mockDate });
    expect(post.created_at).toEqual(mockDate)
  })

  it("can list all posts", async () => {
    const posts = await Post.find();
    expect(posts).toEqual([]);
  });

  it('can have a post with a like', async () => {
    const fakeUserId1 = new ObjectId();
    const post = new Post({ message: "some message", user: fakeUserId1, likes: [fakeUserId1] });
    expect(post.likes[0]).toEqual(fakeUserId1)
  })
  
  it('can have a post with a comment', async () => {
    const fakeUserId1 = new ObjectId();
    const fakeCommentId1 = new ObjectId();
    const post = new Post({ message: "some message", user: fakeUserId1, comments: [fakeCommentId1] });
    expect(post.comments[0]).toEqual(fakeCommentId1)
  })

  it("can save a post", async () => {
    const fakeUserId = new ObjectId();
    const post = new Post({ message: "some message", user: fakeUserId });
    await post.save();
    const posts = await Post.find();
    expect(posts[0].message).toEqual("some message");
  });

  it("cannot save a post without user id", async () => {
    const post = new Post({ message: "some message" });
    try {
      await post.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: user: Path `user` is required.')
    }
  });

  // it("user id is required to like a post", async () => {
  //   // const fakeObjectId = "638c6c2875345eefb8aafa28"
  //   const fakeUserId = new ObjectId();
  //   const post = new Post({ message: "some message", user: fakeUserId, likes: [{}] });
  //   try {
  //     await post.save();
  //   } catch(error) {
  //     expect(error.toString()).toBe('ValidationError: likes.0.user: Path `user` is required.')
  //   }
  // });
  

});
