import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFollowingList } from '../../services/getUserFollowing';
import { getUserById } from '../../services/getUserById';
import { toggleFollowingServ } from '../../services/toggleFollowingServ';


const followingList = () => {
    const [following, setfollowing]= useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
          getUserFollowingList(token)
            .then((data) => {
            localStorage.setItem("token", data.token);
            return getUserById(token, data.user)
        }).then((followingList) => {
            setfollowing(followingList)
            })
            .catch((err) => {
              console.error('error: ',err);
              navigate("/login");
            });
        }
      }, [navigate]);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const hasfollowing = Array.isArray(following) && following.length > 0;

      const toggleButton = async (token, following_id) => {
        try {
          await toggleFollowingServ(token, following_id);
          console.log(`following deleted`);
          window.location.reload();
        } catch (error) {
          console.error('Failed to delete following', error);
        }
      };
    return (<>
    <div className="following-list">
      <h3>My follows</h3>
      <div className="following-list">
      {hasfollowing ? (
        following.map((follow) => (
          <div className="following-box" key={follow._id}>
            <img src={follow.profilepictureURL} alt="following visual" className="following-pic" />
            <div className="following-text">{follow.username}</div>
            <button onClick={()=>{toggleButton(token,follow._id)}}>Delete</button>
          </div>
        ))
      ) : (
        <h4>You have not followed anyone yet</h4>
      )}
    </div>
    </div>
    </>)
}

export default followingList