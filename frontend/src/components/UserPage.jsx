import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify'; // Import the DOMPurify library




const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserPage = () => {
    const [userData, setUserData] = useState(null)
    const [favourites, setFavourites] = useState(null)

    const navigate = useNavigate()

    const location = useLocation();
    const {user} = location.state || {};
    
    useEffect(() => {
        setUserData(user)

    },[])
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserFavouriteData(token, user.favourites)
            .then((data) => {
              setFavourites(data.favourites);
              console.log(data.favourites)
              localStorage.setItem("token", data.token);
            })
            .catch((err) => {
              console.error(err);
              navigate("/login");
            });
        } else {
          navigate("/login");
        }
      }, [navigate]);
 return (
    <div>
        {userData && (
               <div> 

            <h1>{userData.username}</h1>
            <img src={userData.profilePictureURL} alt="profile picture" />
            <h3>{userData.followingData.followers.length} followers</h3>
            <h3>{userData.followingData.following.length} following</h3>
            {favourites && favourites.length > 0 ? (
             favourites.map((fav) => {
                 if (fav !== null) {
                    let summary = DOMPurify.sanitize(fav[0].summary); 
                    return (
                     <div key={fav[0]._id}>
                        <h1>

                        {fav[0].title}
                        </h1>
                        <img src={fav[0].image} alt='recipe image'/>
                        <div className="card-text" dangerouslySetInnerHTML={{ __html: summary }}/>

                        </div> 
                     )}
                    }
                )
                    ) : (
                     <div>No favourites found</div>
                    )}

            </div>

            )}
    </div>
 )
}

export default UserPage

export async function getUserFavouriteData(token, favouriteData) {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify({ favourites: favouriteData }),
  
    };
  
    const response = await fetch(
      `${BACKEND_URL}/recipes/get_favourite_data`,
      requestOptions
    );
  
    if (response.status !== 201) {
      throw new Error("Unable to fetch followers");
    }
  
    const data = await response.json();
    return data;
  }