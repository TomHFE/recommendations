import "./Commentsalert.css";
import { createComment } from "../services/createComment";
import { useEffect, useState } from "react";

function Commentsalert({ comments, onClose, post_id }) {
  const [ commentState, setCommentState ] = useState([])
  const [comment, setComment] = useState("");

  useEffect(() => {
    setCommentState(comments)
  }, [comments])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const thisComment = await createComment(token, comment, post_id);
    setCommentState((prev) => [...prev, thisComment.comment]); // Append the new comment to the current state
    setComment("");
    window.location.reload() //temporary solution
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
