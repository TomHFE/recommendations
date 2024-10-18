import "./post.css";
// @ts-ignore
import cryingGif from "../pictures/michael-scott-crying.gif";
// @ts-ignore
import { useState } from "react";
// @ts-ignore
import iconlike from "../pictures/iconlikebutton.png";
// @ts-ignore
import commentsicon from "../pictures/commentsicon.png";
// @ts-ignore
import Commentsalert from "./commentsalert.jsx";
import { LikeButton } from "./LikeButton";
import { CommentButton } from "./CommentButton";
import { useNavigate } from "react-router-dom";

function Recipe(props) {
  console.log("props: ", props)
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate(`/profile/${props.post.user.username}`)
  }

  return (
    <>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "white",
          marginTop: "1rem",
          marginBottom: "1rem",
          borderRadius: "1rem",
        }}
      >
        
        <article key={props.post._id} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <div style={{display: "flex", flexDirection: "column"}}>
          <img onClick={handleNavigateToProfile} src={props.post.user.profilePictureURL} style={{maxWidth: "4rem", maxHeight: "4rem", marginRight: "3rem", borderRadius: "1rem", cursor: 'pointer'}} />
          </div>
          <div
            key={props.post._id}
            style={{ display: "flex", flexDirection: "column", }}
          >
            {props.post.message}
            {props.post.pictureURL && (
              <img src={props.post.pictureURL} alt="Post visual" />
            )}
            
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  maxWidth: "5rem",
                  justifyContent: "flex-start",
                }}
              >
                <LikeButton
                  number={props.post.likes.length}
                  postId={props.post._id}
                />
                <CommentButton
                  comments={props.post.comments}
                  postId={props.post._id}
                />
              </div>
            
          </div>
        </article>
        {/* <div className="like-button-container">
          <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                  src={iconlike} 
                  alt="Post visual" 
                  className="post-image" 
                  onClick={handleLikeClick} 
                  style={{ cursor: 'pointer' }} 
              />
              <span style={{ marginLeft: '10px' }}>{props.post.likes} {props.post.likes === 1 ? 'Like' : 'Likes'}</span>
            </div>
        </div> */}
        {/* <div className='comments-button-container'>
          <img 
            src={commentsicon} 
            alt="Post visual" 
            className="post-image" 
            onClick={handleCommentsClick} 
            style={{ cursor: 'pointer',  }} 
          />
        </div> */}

      </div>
    </>
  );
}
export default Recipe;
