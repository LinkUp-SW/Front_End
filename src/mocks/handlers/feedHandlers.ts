import { CommentType, PostType } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";
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
      action: "like" as const,
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
      action: "like" as const,
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
      action: "like" as const,
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
      action: "like" as const,
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
];

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

// Post Comments
const commentsHandlers = [
  createGetHandler<CommentType[]>("/api/postComments", () => MOCK_COMMENTS),
];

// Posts
const postsHandlers = [
  createGetHandler<PostType[]>("/api/posts", () => MOCK_POSTS),
];

// feed
export const feedHandlers = [...postsHandlers, ...commentsHandlers];
