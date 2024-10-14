import './friendlist.css'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFriends } from '../../services/getUserFriends';
import { getUserById } from '../../services/getUserById';
import { DeleteFriend } from '../../services/friendrequest/deletefriends';


 const FriendList = () => {
    const [friends, setfriends]= useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
          getUserFriends(token)
            .then((data) => {
            // console.log(data.incomingRequestList)
            localStorage.setItem("token", data.token);
            //console.log(data.incomingRequestList)
            return getUserById(token, data.incomingRequestList.friendsData.friendsList)
            //   setfriends(data.incomingRequestList);
        }).then((friendsList) => {
            //console.log('friendlist',friendsList.message)
            setfriends(friendsList.message)
            })
            .catch((err) => {
              console.error('error: ' ,err);
              navigate("/login");
            });
        }
      }, [navigate]);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const hasFriends = Array.isArray(friends) && friends.length > 0;

      const deletebutton = async (token, friendid) => {
        try {
          await DeleteFriend(token, friendid);
          console.log(`Friend deleted`);
          window.location.reload();
        } catch (error) {
          console.error('Failed to delete friend', error);
        }
      };
    return (<>
    <div className="friend-list">
      <h3>My Friends</h3>
      <div className="friend-list">
      {hasFriends ? (
        friends.map((friend) => (
          <div className="friend-box" key={friend._id}>
            <img src={friend.profilepictureURL} alt="Friend visual" className="friend-pic" />
            <div className="friend-text">{friend.username}</div>
            <button onClick={()=>{deletebutton(token,friend._id)}}>Delete</button>
          </div>
        ))
      ) : (
        <h4>You have no friends added yet</h4>
      )}
    </div>
    </div>
    </>)
}

export default FriendList