import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./feedpage.css";
import { getPosts } from "../../services/getposts";
import { createPosts } from "../../services/createPosts";
import Post from "../../components/Post";
//import PostsController from "../../../../api/controllers/posts";
import LogoutButton from "../../components/LogoutButton";
import ProfileButton from "../../components/profileButton";
import Spacescene from "./spacescene2";
import NavBar from "../../navbar/navbar";


export function FeedPage() {
  const [posts, setPosts] = useState([]);

  const [newpost, setnewpost] = useState({ message: "", pictureURL: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await createPosts(token, newpost);
      setPosts((prevPosts) => [data.post, ...prevPosts]);
      //setnewpost('')
      setnewpost({ message: "", pictureURL: "" });

      localStorage.setItem("token", data.token);

      window.location.reload()
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <>
    <NavBar/>
    <div style={{marginTop: '10vh'}}>
      <div className="container"><Spacescene/></div>
      <div className="newpost">
      <h1>Neeeeew post!!</h1>
      <form onSubmit={handleSubmit}>
        <input 
        //value = {newpost}
        value={newpost.message}
       onChange={(e) => setnewpost({...newpost, message:e.target.value})}
       //onChange={(e) => setnewpost( e.target.value)}
        placeholder="Type a new post ..."></input>
         <input 
            value={newpost.pictureURL} 
            onChange={(e) => setnewpost({...newpost, pictureURL:e.target.value})} 
            placeholder="Paste Url picture here...">
            </input>
        <button type='submit'>Post</button>
      </form>

      </div>
      <h2>Astro-Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
      <div className="logout"> <LogoutButton /></div>
     <div className="myprofile"><ProfileButton /></div>     
    </div>
    </>
  );
}
