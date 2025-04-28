import axiosInstance from "@/services/axiosInstance";
import {
  About,
  BioFormData,
  Education,
  Experience,
  License,
  Organization,
  Skill,
  SkillForm,
  SkillUserSections,
  UserProfileBio,
} from "@/types";

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
    `/api/v1/user/profile/education/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserSkills = async (
  token: string,
  userId: string
): Promise<{ is_me: boolean; skills: Skill[] }> => {
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

export const addUserSkills = async (
  token: string,
  skillsForm: SkillForm
): Promise<{ message: string; skill: Skill }> => {
  const response = await axiosInstance.post(
    `/api/v1/user/add-skill`,
    skillsForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateUserSkill = async (
  token: string,
  id: string,
  formData: SkillForm
) => {
  const response = await axiosInstance.put(
    `/api/v1/user/update-skill/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteUserSkills = async (token: string, id: string) => {
  const response = await axiosInstance.delete(
    `/api/v1/user/delete-skill/${id}`,
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
): Promise<{ message: string; experience: Experience }> => {
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
): Promise<{ message: string; education: Education }> => {
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

export const addLicense = async (
  token: string,
  lisenceForm: License
): Promise<{ message: string; license: License }> => {
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
): Promise<{ message: string; license: License }> => {
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

export const getUserLicenses = async (
  token: string,
  userId: string
): Promise<{ is_me: boolean; licenses: License[] }> => {
  const response = await axiosInstance.get(
    `/api/v1/user/profile/licenses/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeLicense = async (
  token: string,
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `/api/v1/user/delete-license/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteUserProfileImage = async (
  token: string
): Promise<{ message: string; profilePicture: string }> => {
  const response = await axiosInstance.delete(
    `/api/v1/user/profile/profile-picture`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateUserProfileImage = async (
  token: string,
  profilePicture: File
): Promise<{ message: string; profilePicture: string }> => {
  const formData = new FormData();
  formData.append("profilePicture", profilePicture);

  const response = await axiosInstance.put(
    "/api/v1/user/profile/profile-picture",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const uploadUserProfileImage = async (
  token: string,
  profilePicture: File
) => {
  const formData = new FormData();
  formData.append("profilePicture", profilePicture);

  const response = await axiosInstance.post(
    "/api/v1/user/profile/profile-picture",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getUserSections = async (
  token: string
): Promise<SkillUserSections> => {
  const response = await axiosInstance.get(`/api/v1/user/get-user-sections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserCoverPhoto = async (token: string, coverPhoto: File) => {
  const formData = new FormData();
  formData.append("coverPhoto", coverPhoto);

  const response = await axiosInstance.put(
    "/api/v1/user/profile/cover-photo",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteUserCoverPhoto = async (token: string) => {
  const response = await axiosInstance.delete(
    `/api/v1/user/profile/cover-photo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUserCoverPhoto = async (token: string, userId: string) => {
  const response = await axiosInstance(
    `/api/v1/user/profile/cover-photo/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateUserBio = async (token: string, bio: BioFormData) => {
  const response = await axiosInstance.put(
    "/api/v1/user/update-user-profile",
    { bio: bio },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addUserResume = async (token: string, resume: File) => {
  const formData = new FormData();
  formData.append("resume", resume);
  const response = await axiosInstance.post(
    `/api/v1/user/profile/resume`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const endorseSkill = async (
  token: string,
  userId: string,
  skillId: string
) => {
  const response = await axiosInstance.post(
    `api/v1/user/endorse-skill/${userId}/${skillId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const removeEndorsement = async (
  token: string,
  userId: string,
  skillId: string
) => {
  const response = await axiosInstance.delete(
    `api/v1/user/remove-endorsement/${userId}/${skillId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
