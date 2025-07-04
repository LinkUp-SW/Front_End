import axios from "axios";
import axiosInstance from "@/services/axiosInstance";
import { BlockedUser } from "@/types";

// Interfaces
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UpdateEmailRequest {
  email: string;
  password: string;
}

export interface UpdateEmailResponse {
  message: string;
  user_updated_email: string;
}

export interface GetCurrentEmailResponse {
  email: string;
}

// Password endpoints
export const changePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axiosInstance.patch(
      "/api/v1/user/update-password",
      { old_password: currentPassword, new_password: newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ChangePasswordResponse;
    }
    throw error;
  }
};

// Email update endpoints
export const getCurrentEmail = async (
  token: string
): Promise<GetCurrentEmailResponse> => {
  const response = await axiosInstance.get("/api/v1/user/get-current-email", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateEmail = async (
  token: string,
  email: string,
  password: string
): Promise<UpdateEmailResponse> => {
  const response = await axiosInstance.patch(
    "/api/v1/user/update-email",
    { email, password },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const sendEmailVerificationOTP = async (email: string, token:string) => {
  const response = await axiosInstance.post("/api/v1/user/send-otp", { email },{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });
  return response.data;
};

export const verifyEmailOTP = async (
  otp: string,
  email: string,
  update: boolean,
  token:string
) => {
  const response = await axiosInstance.post("/api/v1/user/verify-otp", {
    otp,
    email,
    update,
  },{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });

  return response.data;
};

export const closeAccount = async (token: string) => {
  const response = await axiosInstance.delete(`api/v1/user/delete-account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getBlockedUsersList = async (
  token: string
): Promise<{ blocked_list: BlockedUser[] }> => {
  const response = await axiosInstance(
    `/api/v1/user/manage-by-blocked-list/blocked`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const unBlockUser = async (
  token: string,
  userId: string,
  password: string
) => {
  const response = await axiosInstance.delete(
    `/api/v1/user/manage-by-blocked-list/unblock/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { password: password },
    }
  );
  return response.data;
};

export const getFollowPrimaryStatus = async (token: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/privacy-settings/follow-primary`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const toggleFollowPrimary = async (
  token: string,
  isFollowPrimary: boolean
) => {
  const response = await axiosInstance.put(
    `/api/v1/user/privacy-settings/follow-primary`,
    {
      isFollowPrimary: isFollowPrimary,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getInvitationRequestStatus = async (token: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/privacy-settings/invitations-requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateInvitationRequestStatus = async (
  token: string,
  status: string
) => {
  const response = await axiosInstance.put(
    `/api/v1/user/privacy-settings/invitations-requests`,
    {
      invitationSetting: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getProfileVisibilty = async (token: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/privacy-settings/profile-visibility`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateProfileVisibilty = async (token: string, status: string) => {
  const response = await axiosInstance.put(
    `/api/v1/user/privacy-settings/profile-visibility`,
    {
      profileVisibility: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getMessagingRequestStatus = async (token: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/privacy-settings/messaging-requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateMessagingRequestStatus = async (
  token: string,
  allowMessaging: boolean
) => {
  const response = await axiosInstance.put(
    `/api/v1/user/privacy-settings/messaging-requests`,
    {
      messagingRequests: allowMessaging,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
