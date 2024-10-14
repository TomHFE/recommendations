import { GetRequests } from "../../services/friendrequest/getrequests"
import AddFriends from "../assets/add_friend"
import { getUserById } from "../../services/getUserById"
import '../components/components.css'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Friend from "./Friend"
import ConfirmFriend from "./ConfirmFriend"
import { AcceptRequest } from "../../services/friendrequest/acceptrequest"
import DeclineFriend from "./DeclineFriend"


const IncomingRequests = () => {
    const [open, setOpen] = useState(false)
    const [friendRequests, setFriendRequests] = useState([])
    const [currentUser, setCurrentUser] = useState([])
    const [reload, setReload] = useState(0)
    const [token, setToken] = useState(localStorage.getItem("token"))
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const loggedIn = token !== null;
      if (loggedIn) {
        GetRequests(token)
          .then((data) => {
            localStorage.setItem("token", data.token);
            setToken(data.token)
            console.log('this is dataaa        ', data)
            return getUserById(token, data.incomingRequestList.friendsData.incomingRequests)
            // return setFriendRequests(data.incomingRequestList.friendsData.incomingRequests);
          }).then((friendsList) => {
          

            setCurrentUser(friendsList.currentUserData)
            setFriendRequests(friendsList.message)
           

            })
          .catch((err) => {
            console.error(err.message);
            navigate("/login");
          });
      }
    }, [navigate, reload]);
  
    

    // const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }
    const handleClick = () => {
      setOpen(!open)
    }
    const handleReload = () => {
      setReload(reload + 1)
      console.log(reload)
    }
   console.log(friendRequests)
   
    return (
        <div className="incoming-requests-main" onClick={handleClick}>
            <AddFriends />
            <div className="request-number">{friendRequests.length}</div>
            {open && (
            <div className='request-list'>
            {friendRequests.map((friend) => (
                <div key={friend._id} className="friend-request">
                    <Friend currentUser={currentUser} friend={friend}/>
                    <div className="action-buttons">
                        <ConfirmFriend 
                            token={token} 
                            senderId={currentUser} 
                            recipietId={friend} 
                            onSucess={handleReload}
                        />
                        <DeclineFriend 
                            token={token} 
                            senderId={friend} 
                            recipietId={currentUser} 
                            onSucess={handleReload}
                        />
                    </div>
                </div>
            ))}
        </div>
            )}
        </div>
    )
}

export default IncomingRequests