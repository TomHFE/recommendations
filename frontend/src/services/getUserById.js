// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUserById(token, friendsList) {
  const requestOptions = {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({friendsIds: friendsList}),
}

    

    const response = await fetch(`${BACKEND_URL}/friends/get_user_by_id`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}