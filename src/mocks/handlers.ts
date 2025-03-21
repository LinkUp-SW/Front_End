// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { CommentType, Notification, PostType, ProfileCardType } from "../types";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

// Mock user data
const users: User[] = [
  {
    id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
    firstName: "John",
    lastName: "Maverick",
  },
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    firstName: "Jane",
    lastName: "Doe",
  },
];

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

const MOCK_POSTS: PostType[] = [
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
];

const MOCK_PROFILE: ProfileCardType = {
  coverImage:
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  profileImage: "https://github.com/shadcn.png",
  name: "Amr Doma",
  headline:
    "Ex-SWE Intern at Valeo | Ex-Clinical Engineering Intern at As-Salam International Hospital",
  location: "Qesm el Maadi, Cairo",
  university: "Cairo University",
};

const MOCK_COMMENTS: CommentType[] = [
  {
    user: {
      profileImage:
        "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?&w=100&q=80",
      name: "John Doe",
      degree: "2nd",
      headline:
        "Loves coding and coffee Loves coding and coffee Loves coding and coffee Loves coding and coffee Loves coding and coffee",
    },
    comment: {
      text: "Great post! I completely agree with your perspective on modern web development.",
      edited: false,
    },
    stats: {
      likes: 10,
      celebrate: 2,
      love: 1,
      insightful: 0,
      support: 0,
      funny: 0,
      replies: 5,
      person: "John Doe",
    },
  },
  {
    user: {
      profileImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?&w=100&q=80",
      name: "Jane Smith",
      degree: "1st",
      headline: "Passionate about creating intuitive UIs",
    },
    comment: {
      text: "I found this article very insightful, thanks for sharing!",
      edited: true,
    },
    stats: {
      likes: 15,
      celebrate: 3,
      love: 0,
      insightful: 2,
      support: 1,
      funny: 0,
      replies: 8,
      person: "Jane Smith",
    },
  },
  {
    user: {
      profileImage:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?&w=100&q=80",
      name: "Alex Johnson",
      degree: "Following",
      headline: "Designing for user experience",
    },
    comment: {
      text: "Interesting point of view. I think it opens up more discussion about UI best practices.",
      edited: false,
    },
    stats: {
      likes: 7,
      celebrate: 1,
      love: 2,
      insightful: 0,
      support: 0,
      funny: 0,
      replies: 3,
      person: "Alex Johnson",
    },
  },
];

export const handlers = [
  // Get all users
  http.get("/get-users", async () => {
    console.log("[MSW] Intercepted GET /get-users");
    return HttpResponse.json<User[]>(users);
  }),

  // Get user by ID
  http.get("/get-user/:id", async ({ params }) => {
    console.log("[MSW] Intercepted GET /get-user/:id");

    const { id } = params;
    const user = users.find((user) => user.id === id);

    if (!user) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "User Not Found",
      });
    }
    return HttpResponse.json<User>(user);
  }),
  // New handler for notifications
  http.get("/api/notifications", async () => {
    console.log("[MSW] Intercepted GET /api/notifications");
    return HttpResponse.json<Notification[]>(MOCK_NOTIFICATIONS);
  }),

  // Handler for posts
  http.get("/api/posts", async () => {
    console.log("[MSW] Intercepted GET /api/posts");
    return HttpResponse.json<PostType[]>(MOCK_POSTS);
  }),

  // Handler for Profile
  http.get("/api/profile", async () => {
    console.log("[MSW] Intercepted GET /api/profile");
    return HttpResponse.json<ProfileCardType>(MOCK_PROFILE);
  }),

  http.get("/api/postComments", async () => {
    console.log("[MSW] Intercepted GET /api/postComments");
    return HttpResponse.json<CommentType[]>(MOCK_COMMENTS);
  }),
];
