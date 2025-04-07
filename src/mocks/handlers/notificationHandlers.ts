import { Notification } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";
import { createPostHandler } from "../handler_wrapper/createPostHandler";
import { HttpResponse } from "msw";

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "post",
    content: "**Ghada** liked your post about machine learning.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "2",
    type: "post",
    content: "**Nada** commented on your recent project update.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "3",
    type: "recommendation",
    content: "**Connection Request** from **Malak**",
    time: "11h",
    profileImg: "/api/placeholder/50/50",
    action: "View requests",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "4",
    type: "job",
    content: "software engineer: **30+ opportunities** in Cairo, Egypt",
    time: "20h",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "5",
    type: "job",
    content: "frontend developer: **15+ opportunities** in Dubai, UAE",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "6",
    type: "post",
    content: "Sama replied to your comment.",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "7",
    type: "recommendation",
    content: "You have 2 new connection requests",
    time: "2d",
    profileImg: "/api/placeholder/50/50",
    action: "View requests",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "8",
    type: "post",
    content: "** Sama ** shared your post.",
    time: "3d",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "m1",
    type: "message",
    content: "**Sarah** sent you a message about your recent post",
    time: "1h",
    profileImg: "/api/placeholder/50/50",
    isNew: true
  },
  {
    id: "m2",
    type: "message",
    content: "**Ahmed** replied to your message in the group chat",
    time: "5h",
    profileImg: "/api/placeholder/50/50",
    isNew: true
  },
  {
    id: "m3",
    type: "message",
    content: "**Leila** shared a document with you via direct message",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    isNew: true
  }
];

// Keep a reference to the array so we can modify it
const notifications = [...MOCK_NOTIFICATIONS];

// Define the type for the payload of the markAsRead request
interface MarkAsReadBody {
  notificationId: string;
}

// Notifications handlers
export const notificationHandlers = [
  // GET handler for fetching notifications
  createGetHandler(
    "/api/notifications",
    () => notifications
  ),
  
  // POST handler for marking a notification as read
  createPostHandler<{ success: boolean }, MarkAsReadBody>(
    "/api/notifications/read",
    (req) => {
      const { notificationId } = req.body;
      
      if (!notificationId) {
        return new HttpResponse(null, {
          status: 400,
          statusText: "Bad Request: Missing notification ID"
        });
      }
      
      // Find the notification index
      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex === -1) {
        return new HttpResponse(null, {
          status: 404,
          statusText: "Not Found: Notification does not exist"
        });
      }
      
      // Update the notification's isNew status
      notifications[notificationIndex] = {
        ...notifications[notificationIndex],
        isNew: false
      };
      
      return { success: true };
    }
  )
];