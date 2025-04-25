import axios from 'axios';
import axiosInstance from '@/services/axiosInstance';

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
      '/api/v1/user/update-password',
      { old_password: currentPassword, new_password: newPassword },
      {
        headers: { Authorization: `Bearer ${token}` }
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
export const getCurrentEmail = async (token: string): Promise<GetCurrentEmailResponse> => {
  const response = await axiosInstance.get('/api/v1/user/get-current-email', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateEmail = async (
  token: string,
  email: string,
  password: string
): Promise<UpdateEmailResponse> => {
  const response = await axiosInstance.patch(
    '/api/v1/user/update-email',
    { email, password },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const sendEmailVerificationOTP = async (email: string) => {
  const response = await axiosInstance.post('/api/v1/user/send-otp', { email });
  return response.data;
};

export const verifyEmailOTP = async (otp: string, email: string, update:boolean) => {
  const response = await axiosInstance.post('/api/v1/user/verify-otp', { otp, email,update:true });

  return response.data;
};