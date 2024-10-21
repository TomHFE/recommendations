import "./Commentsalert.css";
import { createComment } from "../services/recipes/createComment";
import { useEffect, useState } from "react";

function Commentsalert({ comments, onClose, recipe_id }) {
  const [commentState, setCommentState] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setCommentState(comments);
  }, [comments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const thisComment = await createComment(token, comment, recipe_id);
      console.log("thisComment is " + thisComment);
      const newComment = thisComment.comment;
      setCommentState((prev) => [...prev, newComment]); //avoid page reload
      setComment(""); // Clear input
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
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
