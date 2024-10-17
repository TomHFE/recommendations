import { useState, useEffect } from "react"
import { getUserFollowingList } from "../../services/getUserFollowing"
import { getUserById } from "../../services/getUserById"
import { useNavigate } from "react-router-dom"
import FollowCard from "./FollowCard"



const UsersFollowingPage = () => {
    const [following, setFollowing] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
            getUserFollowingList(token).then((data) => {
                return getUserById(data.user)
            }).then((followers) => {
                setFollowing(followers)
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
         {following.map((follow) => (
            <FollowCard follow={follow}/>
    ))}
        </div>
    )

}
export default UsersFollowingPage