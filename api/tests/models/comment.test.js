require("../mongodb_helper");
const Comment = require("../../src/models/comment");
const ObjectId = require('mongodb').ObjectId;

describe("Comment model", () => {
  beforeEach(async () => {
    await Comment.deleteMany({});
  });

  it("When a comment is made, userId, message, created_at, and recipe_id data are present", () => {
    const fakeUserId = new ObjectId();
    const fakeRecipeId = new ObjectId();
    const mockDate = new Date('2024-10-04T12:04:15.024Z');
    const comment = new Comment({
      user: fakeUserId, 
      message: "test message", 
      created_at: mockDate, 
      recipe_id: fakeRecipeId
    });
    
    expect(comment.user).toEqual(fakeUserId);
    expect(comment.message).toBe("test message");
    expect(comment.created_at).toEqual(mockDate);
    expect(comment.recipe_id).toEqual(fakeRecipeId);
  });

  it("can save a comment with a message, user, and recipe_id", async () => {
    const fakeUserId = new ObjectId();
    const fakeRecipeId = new ObjectId();
    const comment = new Comment({
      user: fakeUserId, 
      message: "test message", 
      recipe_id: fakeRecipeId
    });
    
    await comment.save();
    const comments = await Comment.find();
    expect(comments[0].message).toEqual("test message");
    expect(comments[0].recipe_id).toEqual(fakeRecipeId);
  });

  it("cannot save a comment without user id", async () => {
    const fakeRecipeId = new ObjectId();
    const comment = new Comment({ 
      message: "some message", 
      recipe_id: fakeRecipeId 
    });
    
    try {
      await comment.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: user: Path `user` is required.');
    }
  });

  it("cannot save a comment without recipe_id", async () => {
    const fakeUserId = new ObjectId();
    const comment = new Comment({ 
      user: fakeUserId, 
      message: "some message" 
    });
    
    try {
      await comment.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: recipe_id: Path `recipe_id` is required.');
    }
  });

  it("can save a comment with an optional rating and image", async () => {
    const fakeUserId = new ObjectId();
    const fakeRecipeId = new ObjectId();
    const comment = new Comment({
      user: fakeUserId, 
      message: "test message", 
      recipe_id: fakeRecipeId, 
      rating: 4, 
      image: "test-image-url.jpg"
    });
    
    await comment.save();
    const comments = await Comment.find();
    expect(comments[0].rating).toEqual(4);
    expect(comments[0].image).toBe("test-image-url.jpg");
  });

  it("should enforce rating value to be between 0 and 5", async () => {
    const fakeUserId = new ObjectId();
    const fakeRecipeId = new ObjectId();
    const comment = new Comment({
      user: fakeUserId, 
      message: "test message", 
      recipe_id: fakeRecipeId, 
      rating: 6 // invalid rating
    });
    
    try {
      await comment.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: rating: Path `rating` (6) is more than maximum allowed value (5).');
    }
  });
});
