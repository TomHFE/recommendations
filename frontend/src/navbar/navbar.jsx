import "../navbar/navbar.css";
// import IncomingRequests from "./components/incomingRequests";
// import SearchFriends from "./components/searchFriends";

const NavBar = () => {
  return (
    <nav className="navbar-main">
      <div className="navbar-incoming-requests">
        {/* <IncomingRequests /> */}
      </div>
      <div className="navbar-search-bar">{/* <SearchFriends/> */}</div>
    </nav>
  );
};

export default NavBar;
