import axios from "axios";
import { Notification } from "../types";

export const getNotifications = async(
    token: string
): Promise<Notification[]> => {
    const response = await axios.get('/api/notifications', {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

export const markNotificationAsRead = async (
    token: string, 
    notificationId: string
): Promise<void> => {
    await axios.post('/api/notifications/read', 
        { notificationId },
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
};