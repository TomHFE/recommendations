import "./Commentsalert.css";
import { createComment } from "../services/recipes/createComment";
import { useEffect, useState } from "react";

function Commentsalert({ comments, onClose, recipe_id, setComments }) {
  const [commentState, setCommentState] = useState([]);
  const [comment, setComment] = useState("");
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    setCommentState(comments);
  }, [comments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted!");
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    
    try {
      const thisComment = await createComment(token, comment, recipe_id);
      console.log("thisComment is " + thisComment);
      const newComment = thisComment.comment;
      setComments((prev) => {
        const updatedComments = [...prev, newComment];
        console.log("Updated comments:", updatedComments); // Log updated comments
        return updatedComments;
      });      
      setComment(""); // Clear input
      setUpdateKey(prev => prev + 1); // Force a re-render
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal" key={updateKey}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3>Comments Section</h3>

        {commentState.length > 0 ? (
          <ul>
            {commentState.map((comment, index) => (
              <li key={index}>{comment.message}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
        <div>
          <form onSubmit={handleSubmit}>
            <input
              id="commentInput"
              type="text"
              placeholder="Type your comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <input type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Commentsalert;
