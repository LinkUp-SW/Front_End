//add here any needed function that will fetch from an endpoint
import axios from "axios";


interface User{
  id:string;
  firstName:string;
  lastName:string;
}

export const getHomePageData = async ():Promise<User> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "/get-users"
        : "actual api endpoint"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
