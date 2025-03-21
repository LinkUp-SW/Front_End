import { ProfileCardType } from "@/types";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export const getUserInfoByID = async (id: string): Promise<User> => {
  try {
    const BASE_URL =
      import.meta.env.VITE_NODE_ENV !== "PROD"
        ? "/get-user"
        : "actual api endpoint";

    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.statusText || "Failed to fetch user info"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export const getProfileCardData = async (): Promise<ProfileCardType> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "/api/profile"
        : "actual api endpoint"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
