import axiosInstance from "@/services/axiosInstance";
import { Notification, NotificationResponse } from "@/types";


export const getNotifications = async (
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<NotificationResponse> => {
  try {
    const response = await axiosInstance.get('/api/v1/notifications/get-notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit }
    });
    
    // Ensure unReadCount is part of the response
    if (response.data && typeof response.data.unReadCount === 'undefined') {
      // If unReadCount is missing from response, add it with a default value
      response.data.unReadCount = response.data.notifications?.filter((n: Notification) => !n.isRead).length || 0;
    }
    
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const getUnreadNotificationsCount = async (token: string): Promise<number> => {
  try {
    const response = await axiosInstance.get('/api/v1/notifications/unread-count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Return the count directly - handle both possible API response formats
    const count = response.data.count || 0;
    console.log("Unread count from API:", count);
    return count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    // Return 0 in case of error to avoid UI issues
    return 0;
  }
};

export const markNotificationAsRead = async (
  token: string, 
  notificationId: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};