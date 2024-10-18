
import { useState, useEffect } from "react";
import { FindByUsername } from "../../services/getFriends";
import { useNavigate } from "react-router-dom";

const SearchFriends = () => {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(query)
    
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
