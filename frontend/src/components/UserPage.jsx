import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import getUserFavouritesData from '../services/recipes/'
const UserPage = () => {
    const [userData, setUserData] = useState(null)
    const location = useLocation();
    const {user} = location.state || {};
    useEffect(() => {
        setUserData(user)

    },[])
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         getUserFavouritesData(token)
    //         .then((data) => {
    //           setRecipes(data.recipes);
    //           localStorage.setItem("token", data.token);
    //           return getUserDetails(data.token);
    //         })
    //         .then((user) => {
    //           localStorage.setItem("token", user.token);
    //           console.log(user);
    //           setProfile(user.message);
    //         })
    //         .catch((err) => {
    //           console.error(err);
    //           navigate("/login");
    //         });
    //     } else {
    //       navigate("/login");
    //     }
    //   }, [navigate]);
 return (
    <div>
        {userData && (
               <div> 

            <h1>{userData.username}</h1>
            <img src={userData.profilePictureURL} alt="profile picture" />
            </div>

            )}
    </div>
 )
}

export default UserPage