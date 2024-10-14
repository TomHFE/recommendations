// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function GetRequests(token) {
  const requestOptions = {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    }}

    

    const response = await fetch(`${BACKEND_URL}/friends/get_incoming_requests`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to get requests");
  }

  const data = await response.json();
  return data;
}