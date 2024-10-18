// import { useState, useEffect } from "react"
// import { getUserFollowerList } from "../../services/getUserFollowers"
// import { getUserById } from "../../services/getUserById"
// import { useNavigate } from "react-router-dom"
// import FollowerCard from "./FollowCard"


// const UsersFollowerPage = () => {
//     const [follower, setFollower] = useState([])
//     const navigate = useNavigate()

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const loggedIn = token !== null;
//         if (loggedIn) {
//             getUserFollowerList(token).then((data) => {
//                 return getUserById(data.user)
//             }).then((followers) => {
//                 setFollower(followers)
//                 localStorage.setItem("token", followers.token);
//             }).catch((error) => {
//                 console.log(error)
//                 navigate('/login')
//             })
//         }
//             },[navigate])

//             const token = localStorage.getItem("token");
//              if (!token) {
//                  navigate("/login");
//                   return;
//                  }

//     return (
//         <div>
//          {follower.map((follower) => (
//             <FollowerCard follower={follower}/>
//     ))}
//         </div>
//     )

// }
// export default UsersFollowerPage

import { useState, useEffect } from "react"
import { getUserFollowerList } from "../../services/getUserFollowers"
import { getUserById } from "../../services/getUserById"
import { useNavigate } from "react-router-dom"
import FollowCard from "./FollowCard"



const UsersFollowerPage = () => {
    const [follower, setFollower] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetchFollowing()
      }, []);

      const fetchFollowing = async () => {
        try {
          const token = localStorage.getItem("token");
          const loggedIn = token !== null;
  
          if (loggedIn) {
            // Get user following list
            const data = await getUserFollowerList(token);
            localStorage.setItem("token", data.token);
  
            // Get user details
            const followers = await getUserById(data.token, data.user);
            localStorage.setItem("token", followers.token);
            // Assuming followers.message is the list of followers
            setFollower(followers.message);
        } else {
            navigate("/login");
        }
    } catch (error) {
        console.error(error);
        navigate("/login");
    }
}

console.log(follower)
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                    return;
                }

    return (
        <div>
        { follower.length > 0 ? (
          <div>
            {follower.map((follow) => (
              <FollowCard key={follow._id} props={follow} />
            ))}
          </div>
        ) : (
          <p>No followers found.</p>
        )}
      </div>
    )

}
export default UsersFollowerPage