const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getUserDetailsByUsername = async (token, username) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
  };
  const response = await fetch(
    `${BACKEND_URL}/users/public_details_username`,
    requestOptions
  );
  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  return response.json();
};
