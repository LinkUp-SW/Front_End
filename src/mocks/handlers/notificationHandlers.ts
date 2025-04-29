import { Notification } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";
import { createPostHandler } from "../handler_wrapper/createPostHandler";
import { HttpResponse } from "msw";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    sender: {
      id: "u1",
      firstName: "Ghada",
      lastName: "Ahmed",
      profilePhoto: "/api/placeholder/50/50"
    },
    type: "post",
    content: "liked your post about machine learning",
    createdAt: "2024-01-20T10:30:00Z",
    referenceId: "post1",
    isRead: false
  },
  {
    id: "2",
    sender: {
      id: "u2",
      firstName: "Ahmed",
      lastName: "Mohamed",
      profilePhoto: "/api/placeholder/50/50"
    },
    type: "post",
    content: "commented on your project showcase",
    createdAt: "2024-01-20T09:15:00Z",
    referenceId: "post2",
    isRead: false
  },
  {
    id: "3",
    sender: {
      id: "u3",
      firstName: "Sama",
      lastName: "Ali",
      profilePhoto: "/api/placeholder/50/50"
    },
    type: "message",
    content: "sent you a new message",
    createdAt: "2024-01-20T08:45:00Z",
    referenceId: "msg1",
    isRead: false
  }
];

export const notificationHandlers = [
  // GET notifications with pagination
  createGetHandler(
    "/api/v1/notifications/get-notifications",
    (req) => {
      const page = parseInt(req.url.searchParams.get("page") || "1");
      const limit = parseInt(req.url.searchParams.get("limit") || "20");
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const notifications = MOCK_NOTIFICATIONS.slice(start, end);
      const total = MOCK_NOTIFICATIONS.length;
      
      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: end < total,
          hasPreviousPage: page > 1
        },
        unReadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length
      };
    }
  ),

  // GET unread count
  createGetHandler(
    "/api/v1/notifications/unread-count",
    () => ({
      count: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length
    })
  ),

  // PUT mark as read
  createPostHandler(
    "/api/v1/notifications/:notificationId/read",
    (req) => {
      const { notificationId } = req.params;
      const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
      
      if (!notification) {
        return new HttpResponse(null, {
          status: 404,
          statusText: "Notification not found"
        });
      }
      
      notification.isRead = true;
      return { message: "Notification marked as read" };
    }
  ),

  // PUT mark all as read
  createPostHandler(
    "/api/v1/notifications/mark-all-read",
    () => {
      const modifiedCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
      MOCK_NOTIFICATIONS.forEach(n => n.isRead = true);
      return { message: "All notifications marked as read", modifiedCount };
    }
  )
];