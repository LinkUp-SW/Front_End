import { Notification } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "post",
    content: "<b>Ghada</b> liked your post about machine learning.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "2",
    type: "post",
    content: "<b>Nada</b> commented on your recent project update.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "3",
    type: "recommendation",
    content: "<b>Connection Request</b> from <b>Malak</b>",
    time: "11h",
    profileImg: "/api/placeholder/50/50",
    action: "View requests",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "4",
    type: "job",
    content: "software engineer: <b>30+ opportunities</b> in Cairo, Egypt",
    time: "20h",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "5",
    type: "job",
    content: "frontend developer: <b>15+ opportunities</b> in Dubai, UAE",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: false,
  },
  {
    id: "6",
    type: "post",
    content: "Sama replied to your comment.",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    isNew: false,
  },
  {
    id: "7",
    type: "recommendation",
    content: "You have 2 new connection requests",
    time: "2d",
    profileImg: "/api/placeholder/50/50",
    action: "View requests",
    actionLink: "#",
    isNew: false,
  },
  {
    id: "8",
    type: "post",
    content: "<b> Sama </b> shared your post.",
    time: "3d",
    profileImg: "/api/placeholder/50/50",
    isNew: false,
  }
];

// Notifications
export const notificationHandlers = [
  createGetHandler<Notification[]>(
    "/api/notifications",
    () => MOCK_NOTIFICATIONS
  ),
];