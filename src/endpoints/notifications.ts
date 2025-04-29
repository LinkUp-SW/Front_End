import axiosInstance from "@/services/axiosInstance";

export interface NotificationSender {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
}

export interface Notification {
  id: string;
  sender: NotificationSender;
  createdAt: string;
  content: string;
  referenceId: string | null;
  type: string;
  isRead: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  unReadCount: number;
}

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
    // Return the count directly from response.data.count
    return response.data.count;
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

