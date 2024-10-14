import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import '../components/components.css'
import { AcceptRequest } from "../../services/friendrequest/acceptrequest"


const ConfirmFriend = ({token, senderId, recipietId, onSucess}) => {
    const navigate = useNavigate();
    const sender = senderId._id
    const recipiet = recipietId._id
    console.log(sender)
    console.log(recipiet)

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     const loggedIn = token !== null;
    //     if (loggedIn) {
    //       AcceptRequest(token, sender, recipiet).then((data) => {
    //         console.log(data)
    //       })
    //         .catch((err) => {
    //           console.error(err);
    //           navigate("/login");
    //         });
    //     }
    //   }, [navigate]);
    

    //   const token = localStorage.getItem("token");
    //   if (!token) {
    //     navigate("/login");
    //     return;
    //   }

    const  handleAccept = async () => {
      await AcceptRequest(token, sender, recipiet)
      .then((data)=> {
        console.log('this is what happens when friend request is accepted,   ', data.user_added)
        onSucess()
      })
  
   }

      return (
        <div onClick={handleAccept}>Accept</div>
      )

}

export default ConfirmFriend