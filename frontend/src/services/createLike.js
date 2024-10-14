const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createLike(token, post_id) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_id: post_id }),
  };

  const response = await fetch(`${BACKEND_URL}/posts/likes`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;

}