import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import '../components/components.css'
import { DeclineRequest } from "../../services/friendrequest/declinerequest"


const DeclineFriend = ({token, senderId, recipietId, onSucess}) => {
    const navigate = useNavigate();
    const sender = senderId._id
    const recipient = recipietId._id

    console.log(sender)

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
      await DeclineRequest(token, sender, recipient)
      .then((data)=> {
        console.log('this is what happens when friend request is declined,   ', data.user_added)
        onSucess()
      })
  
   }

      return (
        <div onClick={handleAccept}>Decline</div>
      )

}

export default DeclineFriend