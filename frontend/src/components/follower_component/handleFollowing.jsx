import { useState, useEffect } from "react"
import { getUserFollowerList } from "../../services/getUserFollowers"
import { getUserById } from "../../services/getUserById"
import { useNavigate } from "react-router-dom"
import FollowerCard from "./FollowCard"


const UsersFollowerPage = () => {
    const [follower, setFollower] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
            getUserFollowerList(token).then((data) => {
                return getUserById(data.user)
            }).then((followers) => {
                setFollower(followers)
                localStorage.setItem("token", followers.token);
            }).catch((error) => {
                console.log(error)
                navigate('/login')
            })
        }
            },[navigate])

            const token = localStorage.getItem("token");
             if (!token) {
                 navigate("/login");
                  return;
                 }

    return (
        <div>
         {follower.map((follower) => (
            <FollowerCard follower={follower}/>
    ))}
        </div>
    )

}
export default UsersFollowerPage