import './friendrequests.css'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GetRequests } from '../../services/friendrequest/getrequests';
import { getUserById } from '../../services/getUserById';
import { AcceptRequest } from '../../services/friendrequest/acceptrequest';
import { DeclineRequest } from '../../services/friendrequest/declinerequest';

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      GetRequests(token)
        .then((data) => {
          localStorage.setItem("token", data.token);
          return getUserById(token, data.incomingRequestList.friendsData.incomingRequests);
        })
        .then((requestList) => {
          setRequests(requestList.message); // Set initial requests list
        })
        .catch((err) => {
          console.error('error:', err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const hasRequests = Array.isArray(requests) && requests.length > 0;

  // Handle Accept Request
  const handleAcceptRequest = async (token, requestId) => {
    try {
      await AcceptRequest(token, requestId);
      console.log(`Request ${requestId} accepted`);

      // Update state to remove the accepted request
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
      window.location.reload();
    } catch (error) {
      console.error('Failed to accept request', error);
    }
  };

  // Handle Decline Request
  const handleDeclineRequest = async (token, requestId) => {
    try {
      await DeclineRequest(token, requestId);
      console.log(`Request ${requestId} declined`);

      // Update state to remove the declined request
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
      window.location.reload();
    } catch (error) {
      console.error('Failed to decline request', error);
    }
  };

  return (
    <div className="request-list">
      <h3>My Requests</h3>
      <div className="requests-list">
        {hasRequests ? (
          requests.map((request) => (
            <div className="request-box" key={request._id}>
              <img src={request.profilepictureURL} alt="Friend visual" className="friend-pic" />
              <div className="friend-text">{request.username}</div>
              <button onClick={() => handleAcceptRequest(token, request._id)}>Accept</button>
              <button onClick={() => handleDeclineRequest(token, request._id)}>Decline</button>
            </div>
          ))
        ) : (
          <h4>You have no requests</h4>
        )}
      </div>
    </div>
  );
}

export default RequestsList;
