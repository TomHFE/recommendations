const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function toggleFollowingServ(token, target_id) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target_id: target_id }),
  };

  //Might need to adjust below route
  const response = await fetch(
    `${BACKEND_URL}/users/toggle_following`,
    requestOptions
  );

  if (response.status !== 201) {
    throw new Error("Unable to toggle");
  }

  const data = await response.json();
  return data;
}
