import { useState, useEffect } from "react";

const Friend = ({ currentUser, friend }) => {
    const [mutual, setMutual] = useState(0)

useEffect(() => {
    const mutualFriends = currentUser.friendsData.friendsList.filter(person => friend.friendsData.friendsList.includes(person));
      
    setMutual(mutualFriends.length)
},[])


return (
    <div>
        <h1>{friend.username}</h1>
        {friend.profilePictureURL && (
            <img src={friend.profilePictureURL} alt='profile picture'/>
        )}
        <div>you have {mutual} mutual friends</div>
    </div>
)

}

export default Friend