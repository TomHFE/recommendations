const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createPosts(token, message){
    const requestOptions={
      method:"POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message.message , pictureURL: message.pictureURL }),
    };
  
    const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);
  
    if (response.status !== 201) {
      throw new Error("Unable to fetch posts");
    }
  
    const data = await response.json();
    return data;
  
      }