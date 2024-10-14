// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function AcceptRequest(token, senderId, recipientId ) {
  
  console.log(token)
  const requestOptions = {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({senderId:senderId, recipientId:recipientId}),
}

    

    const response = await fetch(`${BACKEND_URL}/friends/accept_friend_request`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to proccess request");
  }

  const data = await response.json();
  return data;
}