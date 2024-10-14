// import { useState, useEffect } from "react";
// import { FindByUsername } from "../../services/getFriends"
// import { useNavigate } from "react-router-dom"

// const SearchFriends = () => {

// const[username,setUsername] = useState('')
// const[query,setQuery] = useState('')
// const[token,setToken]  = useState('')

// const navigate = useNavigate();

//     useEffect(() => {
        
//         const token = localStorage.getItem("token");
//         const loggedIn = token !== null;
//         if (loggedIn) {
//             FindByUsername(token, username)
//             .then((data) => {
//               localStorage.setItem("token", data.token);
//               setToken(data.token)
//               console.log('this is dataaa for dearch friends       ', data)
//               navigate(`/profile/${data.users.username.toString()}`)
//               // return setFriendRequests(data.incomingRequestList.friendsData.incomingRequests);
//             })
//             .catch((err) => {
//               console.error(err.message);
//             //   navigate("/login");
//             });
//         }
//       }, [navigate, username]);
    
//       const handleSubmit = (e, query) => {
//         e.preventDefault()
//         setUsername(query)
//       }

//     return (
//         <div>
//             <form  method="POST" onSubmit={handleSubmit(query)}>
//             <input type="text" name="query" placeholder="Search..." style={{margin: '0'}} onChange={(e) => {setQuery(e.target.value)}}/>
//             <button type="submit" style={{margin: '0'}} >Search</button>
//             </form>
//         </div>
//     )
// }

// export default SearchFriends
import { useState, useEffect } from "react";
import { FindByUsername } from "../../services/getFriends";
import { useNavigate } from "react-router-dom";

const SearchFriends = () => {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

//   useEffect(() =>  {
//     const token = localStorage.getItem("token");
//     const loggedIn = token !== null;

//     if (loggedIn && username) {  // Ensure username is set before calling FindByUsername
//         console.log('1')
//        FindByUsername(token, username)
//         .then((data) => {
//             console.log('2')

//         //   localStorage.setItem("token", data.token);
//         //   setToken(data.token);
//           console.log('this is dataaa for search friends:', data);
//           navigate(`/profile/${data.users.username.toString()}`);
//         })
//         .catch((err) => {
//           console.error(err.message);
//         });
//     }
//   }, [navigate, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(query)
    
    // setUsername(query); // Set the username to the current query
   const response =  await FindByUsername(token, query)
   console.log(response)
   navigate(`/profile/${response.users[0].username.toString()}`);



  };

  return (
    <div>
        <input
          type="text"
          name="query"
          placeholder="Search..."
          style={{ margin: '0' }}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" style={{ margin: '0' }} onClick={handleSubmit}>Search</button>
    </div>
  );
};

export default SearchFriends;
