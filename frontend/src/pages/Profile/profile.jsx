import Spacescene from "./spacescene3";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import GoBack from "../../components/gobackbutton";
import { getUserPosts } from "../../services/getuserposts";
import {createPosts} from "../../services/createPosts";
import Post from "../../components/Post";
import './profile.css'
import FriendList  from "./friendlist";
import RequestsList from './friendrequests';

export function Profile(){
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [newpost,setnewpost]=useState({message:'',pictureURL:''})
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
          getUserPosts(token)
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

     
  const handleSubmit= async (event)=>{
    event.preventDefault();
    try {
    const data = await createPosts(token, newpost);
    setPosts((prevPosts) => [data.post, ...prevPosts]);
    //setnewpost('')
    setnewpost({message:'',pictureURL:''});
    
    localStorage.setItem('token', data.token)
    window.location.reload()
  } catch(err){
    console.error('Error creating post:', err)
  }
  }
    
return (
    <>
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
            value={newpost.pictureURL} onChange={(e) => setnewpost({...newpost, pictureURL:e.target.value})} 
            placeholder="Paste Url picture here...">
            </input>
        <button type='submit'>Post</button>
      </form>
      </div>
            <h2>My Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
      <div className="friendlist"><FriendList/></div>
      
      <div className="goback"><GoBack/></div>
      <div className="logout"> <LogoutButton /></div>
      </>)}