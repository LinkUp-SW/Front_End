import { Notification } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "hiring",
    content: "<b>Amany Raafat</b> is hiring.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "2",
    type: "analytics",
    content:
      "Your posts got <b>15 impressions</b> last week. View your analytics.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "3",
    type: "course",
    content:
      "New from <b>Free Online Courses with Certificates</b> in Free Online Courses: Boost Your Skills with 100 Free Courses and Certificates on Udemy and Coursera",
    time: "11h",
    profileImg: "/api/placeholder/50/50",
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
    type: "recommendation",
    content:
      "<b>ETL Data Analyst</b> at Siemens Digital Industries Software and <b>9 other recommendations</b> for you.",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: true,
  },
  {
    id: "6",
    type: "job",
    content: "frontend developer: <b>15+ opportunities</b> in Dubai, UAE",
    time: "1d",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: false,
  },
  {
    id: "7",
    type: "job",
    content: "product manager: <b>12 opportunities</b> in Riyadh, Saudi Arabia",
    time: "2d",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: false,
  },
  {
    id: "8",
    type: "hiring",
    content: "<b>Amira</b> is looking for a <b>UX Designer</b>.",
    time: "3d",
    profileImg: "/api/placeholder/50/50",
    action: "See post",
    actionLink: "#",
    isNew: false,
  },
  {
    id: "9",
    type: "recommendation",
    content:
      "<b>Data Scientist</b> at Google and <b>7 other recommendations</b> based on your profile.",
    time: "3d",
    profileImg: "/api/placeholder/50/50",
    action: "View jobs",
    actionLink: "#",
    isNew: false,
  },
];

// Notifications
export const notificationHandlers = [
  createGetHandler<Notification[]>(
    "/api/notifications",
    () => MOCK_NOTIFICATIONS
  ),
];
