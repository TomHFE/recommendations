// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function DeleteFriend(token, friendId) {
  const requestOptions = {
    method: "PATCH",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({friendId : friendId}),
}

    

    const response = await fetch(`${BACKEND_URL}/friends/delete_friend`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to delete friend request");
  }

  const data = await response.json();
  return data;
}