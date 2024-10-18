// import { useEffect, useState } from "react";
// import { getUserDetailsByUsername } from "../../services/getUserDetailsByUsername";
// import { useParams } from "react-router-dom";
// // import { getUserPostsById } from "../../services/getUserPostsById";
// import Post from "../../components/Post";
// import { CreateRequest } from "../../services/friendrequest/createfriendrequest";

// // user details changed
// export const PublicProfile = () => {
//   const [userDetails, setUserDetails] = useState();
//   const [userPosts, setUserPosts] = useState([]);

//   let { username } = useParams();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     getUserDetailsByUsername(token, username)
//       .then((data) => {
//         const userData = data.user_details[0];
//         setUserDetails(userData);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   useEffect(() => {
//     if (userDetails) {
//       const token = localStorage.getItem("token");

//       getUserPostsById(token, userDetails._id)
//         .then((data) => {
//           console.log(data.posts);
//           setUserPosts(data.posts);
//         //   localStorage.setItem("token", data.token);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [userDetails]);
//   const token = localStorage.getItem("token");
//   const handlerequest = async (token,userid) =>{
//     console.log(token)
//     console.log(userid)
//     await CreateRequest(token,userid)
//   }

//   return (
//     <>
//       <div
//         style={{ width: "100vh", backgroundColor: "white", padding: "1rem" }}
//       >
//         <img
//           style={{ maxWidth: "10rem", borderRadius: "5rem" }}
//           src={userDetails && userDetails.profilePictureURL}
//         />
//         <h3 style={{color: "black", fontFamily: "sans-serif"}}>{userDetails && userDetails.username}</h3>
//         <h4 style={{color: "black", fontFamily: "sans-serif"}}>Friends:</h4>
//         {userDetails && userDetails.friendsData.friendsList.length > 0
//           ? userDetails.friendsData.friendsList.map((friendName, index) => {
//               return (
//                 <a key={index} href="">
//                   <b>{friendName}</b>
//                 </a>
//               );
//             })
//           : "No friends"}
//           <button onClick={()=> handlerequest(token, userDetails._id)}>Send a friend request</button>
//       </div>

//       <div>
//         {userPosts && userPosts.map((post, index) => (
//             <Post post={post} key={index} />
//         ))}
//       </div>
//     </>
//   );
// };
