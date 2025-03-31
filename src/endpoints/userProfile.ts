import axiosInstance from "@/services/axiosInstance";
import { ProfileCardType, UserProfile } from "@/types";
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

export const getUserBio = async (token: string, userId: string):Promise<UserProfile> => {
  const response = await axiosInstance(`/api/v1/user/profile/bio/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
