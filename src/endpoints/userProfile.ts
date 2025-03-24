import { ProfileCardType } from "@/types";
import axios from "axios";


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
