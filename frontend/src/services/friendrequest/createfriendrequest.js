// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function CreateRequest(token, sender) {
  const requestOptions = {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({recipientId: sender}),
}

    

    const response = await fetch(`${BACKEND_URL}/friends/friend_request`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create request");
  }

  const data = await response.json();
  return data;
}