// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUserFollowerList(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/users/get_follower_list`,
    requestOptions
  );

  if (response.status !== 201) {
    throw new Error("Unable to fetch followers");
  }

  const data = await response.json();
  return data;
}