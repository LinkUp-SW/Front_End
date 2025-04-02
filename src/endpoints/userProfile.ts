import axiosInstance from "@/services/axiosInstance";
import {
  Experience,
  Organization,
  ProfileCardType,
  UserProfileBio,
} from "@/types";
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

export const getUserBio = async (
  token: string,
  userId: string
): Promise<UserProfileBio> => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/bio/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserProfilePic = async (
  token: string,
  userId: string
): Promise<{ profilePicture: string }> => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/profile-picture/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserExperience = async (
  token: string,
  userId: string
): Promise<{ is_me: boolean; work_experience: Experience[] }> => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/experience/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserEducation = async (token: string, userId: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/education//${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserSkills = async (token: string, userId: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/skills/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addWorkExperience = async (
  token: string,
  workExperienceForm: Experience
): Promise<{ message: string; experience: Experience }> => {
  const response = await axiosInstance.post(
    `/api/v1/user/add-work-experience`,
    workExperienceForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getCompaniesList = async (
  query: string
): Promise<{ message: string; data: Organization[] }> => {
  const response = await axiosInstance.get(`api/v1/search/company/${query}`);
  return response.data;
};

export const updateWorkExperience = async (
  token: string,
  id: string,
  form: Experience
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(
    `api/v1/user/update-work-experience/${id}`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
