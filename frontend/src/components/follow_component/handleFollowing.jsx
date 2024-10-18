import { useState, useEffect } from "react"
import { getUserFollowingList } from "../../services/getUserFollowing"
import { getUserById } from "../../services/getUserById"
import { useNavigate } from "react-router-dom"
import FollowCard from "./FollowCard"



const UsersFollowingPage = () => {
    const [following, setFollowing] = useState([])
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
            const data = await getUserFollowingList(token);
            localStorage.setItem("token", data.token);
  
            // Get user details
            const followers = await getUserById(data.token, data.user);
            localStorage.setItem("token", followers.token);
            // Assuming followers.message is the list of followers
            setFollowing(followers.message);
        } else {
            navigate("/login");
        }
    } catch (error) {
        console.error(error);
        navigate("/login");
    }
}

console.log(following)
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                    return;
                }

    return (
        <div>
        { following.length > 0 ? (
          <div>
            {following.map((follow) => (
              <FollowCard key={follow._id} props={follow} />
            ))}
          </div>
        ) : (
          <p>No following users found.</p>
        )}
      </div>
    )

}
export default UsersFollowingPage