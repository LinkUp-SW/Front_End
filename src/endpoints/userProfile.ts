import axiosInstance from "@/services/axiosInstance";
import {
  About,
  Education,
  Experience,
  License,
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
  if (response.status === 200) {
    console.log("User bio fetched successfully.");
  } else {
    console.error("Unexpected HTTP status:", response.status);
  }
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
    `/api/v1/user/profile/education/${userId}`,
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
  const response = await axiosInstance.get(`/api/v1/search/company/${query}`);
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

export const removeWorkExperience = async (
  token: string,
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `api/v1/user/delete-work-experience/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const blockUser = async (token: string, userId: string) => {
  const response = await axiosInstance.post(
    `/api/v1/user/block/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getSchoolsList = async (
  query: string
): Promise<{ message: string; data: Organization[] }> => {
  const response = await axiosInstance.get(`/api/v1/search/education/${query}`);
  return response.data;
};

export const addEducation = async (
  token: string,
  educationForm: Education
): Promise<{ message: string; education: Education }> => {
  const response = await axiosInstance.post(
    `/api/v1/user/add-education`,
    educationForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateEducation = async (
  token: string,
  id: string,
  form: Education
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(
    `/api/v1/user/update-education/${id}`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeEducation = async (token: string, id: string) => {
  const response = await axiosInstance.delete(
    `/api/v1/user/delete-education/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserAbout = async (
  token: string,
  userId: string
): Promise<{ is_me: boolean; about: About }> => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/about/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const editUserAbout = async (
  token: string,
  aboutForm: About
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(
    `/api/v1/user/profile/about`,
    aboutForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addUserAbout = async (
  token: string,
  aboutForm: About
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    `/api/v1/user/profile/about`,
    aboutForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getOrganizationsAndSchoolsList = async (query: string) => {
  const response = await axiosInstance.get(`/api/v1/search/${query}`);
  return response.data;
};

export const addLicense = async (token: string, lisenceForm: License) => {
  const response = await axiosInstance.post(
    `/api/v1/user/add-license`,
    lisenceForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const editLicense = async (
  token: string,
  id: string,
  lisenceForm: License
) => {
  const response = await axiosInstance.put(
    `/api/v1/user/update-license/${id}`,
    lisenceForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
