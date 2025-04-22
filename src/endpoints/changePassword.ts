// API endpoints for password change functionality
import axios from 'axios'; // Keep this import for isAxiosError
import axiosInstance from '../services/axiosInstance';

// Use relative endpoint instead of full URL
const API_ENDPOINT = '/api/v1/user/update-password';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

    const response = await axiosInstance.post<ChangePasswordResponse>(
      API_ENDPOINT,
      { currentPassword, newPassword } as ChangePasswordRequest,
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