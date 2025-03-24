import { createGetHandler } from "../handler_wrapper/getHandler";

const MOCK_FOLLOWERS = [
  {
    name: "Jessica Brown",
    title: "UX Designer at Apple",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
  {
    name: "Daniel Wilson",
    title: "Backend Developer at Microsoft",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
  {
    name: "Sophia Martinez",
    title: "Marketing Specialist at Tesla",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
];

const MOCK_FOLLOWING = [
  {
    name: "John Doe",
    title: "Software Engineer at Google",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
  {
    name: "Emily Smith",
    title: "Product Manager at Facebook",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
  {
    name: "Michael Johnson",
    title: "Data Scientist at Amazon",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
];

// mock connections
const MOCK_CONNECTIONS = [
  {
    id: 1,
    name: "John Doe",
    title: "Software Engineer at Google",
    date: "March 5, 2025",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Data Scientist at Facebook",
    date: "March 3, 2025",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
  {
    id: 3,
    name: "Robert Johnson",
    title: "Product Manager at Amazon",
    date: "March 1, 2025",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
  {
    id: 4,
    name: "Emily Davis",
    title: "UX Designer at Apple",
    date: "February 27, 2025",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
  {
    id: 5,
    name: "Michael Wilson",
    title: "Cybersecurity Analyst at Microsoft",
    date: "February 25, 2025",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
];

// Social (Followers & Following)
const socialHandlers = [
  createGetHandler("/api/followers", () => MOCK_FOLLOWERS),
  createGetHandler("/api/following", () => MOCK_FOLLOWING),
];

// Connections
const connectionsHandlers = [
  createGetHandler("/api/connections", () => MOCK_CONNECTIONS),
];

export const myNetworkHandlers = [...socialHandlers, ...connectionsHandlers];
