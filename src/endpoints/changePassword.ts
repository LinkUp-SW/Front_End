// API endpoints for password change functionality
import axios from 'axios';

const API_BASE_URL = '//// el api';


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
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axios.post<ChangePasswordResponse>(
      `${API_BASE_URL}/auth/change-password`,
      { currentPassword, newPassword } as ChangePasswordRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ChangePasswordResponse;
    }
    throw error;
  }
};