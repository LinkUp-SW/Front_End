// API endpoints for password change functionality
import axios from 'axios'; // Keep this import for isAxiosError
import axiosInstance from '@/services/axiosInstance';

// Use relative endpoint instead of full URL
const API_ENDPOINT = '/api/v1/user/update-password';

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Change user password
 * @param currentPassword - User's current password
 * @param newPassword - User's new password
 * @returns Promise with change password response
 */
export const changePassword = async (token: string,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  try {
    const requestData: ChangePasswordRequest = { old_password:currentPassword, new_password:newPassword };
    const response = await axiosInstance.patch<ChangePasswordResponse>(
      API_ENDPOINT,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
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