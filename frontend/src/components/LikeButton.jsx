import { useState } from "react";
// import iconlike from "../pictures/iconlikebutton.png";
// import { createLike } from "../services/createFavourite";

export const LikeButton = (props) => {
  const handleLike = async () => {
    const token = localStorage.getItem("token");
    console.log("LikeButtonProps", props);
    const liked = await createLike(token, props.postId);
    console.log(liked);
    window.location.reload();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "4rem",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginRight: "1rem",
      }}
    >
      <p style={{ marginRight: "0.2rem" }}>{props.number}</p>
      <img
        src={iconlike}
        style={{ maxWidth: "1.5rem", maxHeight: "1.5rem", cursor: "pointer" }}
        onClick={handleLike}
      />
    </div>
  );
};
