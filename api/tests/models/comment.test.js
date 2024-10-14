require("../mongodb_helper");
const Comment = require("../../models/comment");
const ObjectId = require('mongodb').ObjectId;

describe("Comment model", () => {
    beforeEach(async () => {
    await Comment.deleteMany({});
  });

  it("When comment is made, userId, message and created_at data is present", () => {
    const fakeUserId = new ObjectId();
    const mockDate = new Date('2024-10-04T12:04:15.024Z');
    const comment = new Comment({user: fakeUserId, message: "test message", created_at: mockDate})
    expect(comment.user).toEqual(fakeUserId)
    expect(comment.message).toBe("test message"),
    expect(comment.created_at).toEqual(mockDate)
  })

  it("can save a comment", async () => {
    const fakeUserId = new ObjectId();
    const fakePostId = new ObjectId()
    const mockDate = new Date('2024-10-04T12:04:15.024Z');
    const comment = new Comment({user: fakeUserId, message: "test message", post_id: fakePostId})
    await comment.save();
    const comments = await Comment.find();
    expect(comments[0].message).toEqual("test message");
  });

  it("cannot save a comment without user id", async () => {
    const fakePostId = new ObjectId()
    const comment = new Comment({ message: "some message", post_id: fakePostId});
    try {
      await comment.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: user: Path `user` is required.')
    }
  });

    it("user id is required to create a comment", async () => {
    const fakePostId = new ObjectId()
    const comment = new Comment({ message: "some message", post_id: fakePostId});
    try {
      await comment.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: user: Path `user` is required.')
    }
  });

  
})
