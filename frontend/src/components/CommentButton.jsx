import { useState } from "react";
import commentsIcon from "../pictures/commentsicon.png";
import Commentsalert from "./commentsalert.jsx";

export const CommentButton = (props) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
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
      <p style={{ marginRight: "0.2rem" }}>{props.comments.length}</p>
      <img
        src={commentsIcon}
        style={{ maxWidth: "1.5rem", maxHeight: "1.5rem", cursor: "pointer" }}
        onClick={handleCommentsClick}
      />
      {isCommentsOpen && (
        <Commentsalert
          comments={props.comments}
          onClose={closeCommentsModal}
          post_id={props.postId}
        />
      )}
    </div>
  );
};
