import { useState } from "react";
import commentsIcon from "../pictures/speech-bubble.png";
import Commentsalert from "./commentsalert.jsx";

export const CommentButton = (props) => {
  console.log('this is the props for comments', props)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState(props.comments)
  const handleCommentsClick = () => {
    setIsCommentsOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "4rem",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <p style={{ marginRight: "0.2rem" }}>{comments.length}</p>
      <img
        src={commentsIcon}
        alt="Comments icon"
        style={{ maxWidth: "1.5rem", maxHeight: "1.5rem", cursor: "pointer" }}
        onClick={handleCommentsClick}
      />
      {isCommentsOpen && (
        <Commentsalert
          comments={comments}
          onClose={closeCommentsModal}
          recipe_id={props.recipeId}
          setComments={setComments}
        />
      )}
    </div>
  );
};
