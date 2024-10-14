import { DeleteFriend } from '../services/friendrequest/deletefriends';
import './friend.css'
import profilepicture from '../pictures/Dwight.jpg'

function Friend(props) {
  const friends  = props.friends; // Destructure the friends prop


  
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

  return (
    <div className="friend-list">
      {hasFriends ? (
        friends.map((friend) => (
          <div className="friend-box" key={friend._id}>
            <img src={profilepicture} alt="Friend visual" className="friend-pic" />
            <div className="friend-text">{friend.username}</div>
            <button onClick={()=>{deletebutton(props.token,friend._id)}}>Delete</button>
          </div>
        ))
      ) : (
        <h4>You have no friends added yet</h4>
      )}
    </div>
  );
}
  export default Friend;