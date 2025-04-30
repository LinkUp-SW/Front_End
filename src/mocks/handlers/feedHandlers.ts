import { PostType, ReactionType } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";
const MOCK_POSTS: PostType[] = [
  {
    author: {
      first_name: "Abdelrahman",
      last_name: "Doma",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profile_picture:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      connection_degree: "Following",
      username: "Abdelrahman-Doma32",
    },

    content: `𝗛𝗶𝗿𝗶𝗻𝗴 𝗮 𝗷𝘂𝗻𝗶𝗼𝗿 𝗱𝗲𝘃 𝗶𝘀 𝗡𝗢𝗧 𝗲𝗮𝘀𝘆. 😵 😵😵

Recently, I started conducting interviews for Junior/Entry-Level-Mid Software Engineering positions.

Here’s my honest reflection on this challenge.

Hiring a strong junior is NOT easy. It’s not just about asking technical questions and noting answers.

It’s about making the right assessment—evaluating current knowledge, problem-solving ability, potential to figure things out later, adaptability, and reasoning skills.

Entry-level candidates won’t know all the answers, and that’s normal. The challenge is distinguishing between someone who simply can’t do the job and someone who may struggle initially but can become knowledgeable in a few hours. How good is their communication? How much is it affected by stress? How will it evolve with confidence?

Lastly, what’s their level of critical thinking? Are they open to admitting they don’t know? Can they reflect on past projects? How much exposure have they had to different technologies, and what does that say about them?

I find these aspects far more important than details of a particular garbage collection implementation in framework X or Z—or what a hashmap is.

In junior interviews, you assess potential, not just skills or experience. That’s why it’s so hard and requires both judgment and instinct.

Always happy to know your thoughts on this 👇`,
    date: 0,
    public_post: true,
    is_edited: true,
    comments_disabled: "Anyone",
    reacts: [],
    user_id: "123",
    _id: "111",
    tagged_users: [],
    comments: [],
    media: {
      media_type: "images",
      link: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
      ],
    },

    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
      reposts: 10,
    },

    reactions: [],
    reactions_count: 0,
  },
  {
    author: {
      first_name: "Abdelrahman",
      last_name: "Doma",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profile_picture:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      connection_degree: "Following",
      username: "Abdelrahman-Doma32",
    },

    content: `𝗛𝗶𝗿𝗶𝗻𝗴 𝗮 𝗷𝘂𝗻𝗶𝗼𝗿 𝗱𝗲𝘃 𝗶𝘀 𝗡𝗢𝗧 𝗲𝗮𝘀𝘆. 😵 😵😵

Recently, I started conducting interviews for Junior/Entry-Level-Mid Software Engineering positions.

Here’s my honest reflection on this challenge.

Hiring a strong junior is NOT easy. It’s not just about asking technical questions and noting answers.

It’s about making the right assessment—evaluating current knowledge, problem-solving ability, potential to figure things out later, adaptability, and reasoning skills.

Entry-level candidates won’t know all the answers, and that’s normal. The challenge is distinguishing between someone who simply can’t do the job and someone who may struggle initially but can become knowledgeable in a few hours. How good is their communication? How much is it affected by stress? How will it evolve with confidence?

Lastly, what’s their level of critical thinking? Are they open to admitting they don’t know? Can they reflect on past projects? How much exposure have they had to different technologies, and what does that say about them?

I find these aspects far more important than details of a particular garbage collection implementation in framework X or Z—or what a hashmap is.

In junior interviews, you assess potential, not just skills or experience. That’s why it’s so hard and requires both judgment and instinct.

Always happy to know your thoughts on this 👇`,
    date: 0,
    public_post: true,
    is_edited: true,
    comments_disabled: "Anyone",
    reacts: [],
    user_id: "123",
    _id: "111",
    tagged_users: [],
    comments: [],
    media: {
      media_type: "images",
      link: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
      ],
    },

    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
      reposts: 10,
    },

    reactions: [],
    reactions_count: 0,
  },
  {
    author: {
      first_name: "Abdelrahman",
      last_name: "Doma",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profile_picture:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      connection_degree: "Following",
      username: "Abdelrahman-Doma32",
    },

    content: `𝗛𝗶𝗿𝗶𝗻𝗴 𝗮 𝗷𝘂𝗻𝗶𝗼𝗿 𝗱𝗲𝘃 𝗶𝘀 𝗡𝗢𝗧 𝗲𝗮𝘀𝘆. 😵 😵😵

Recently, I started conducting interviews for Junior/Entry-Level-Mid Software Engineering positions.

Here’s my honest reflection on this challenge.

Hiring a strong junior is NOT easy. It’s not just about asking technical questions and noting answers.

It’s about making the right assessment—evaluating current knowledge, problem-solving ability, potential to figure things out later, adaptability, and reasoning skills.

Entry-level candidates won’t know all the answers, and that’s normal. The challenge is distinguishing between someone who simply can’t do the job and someone who may struggle initially but can become knowledgeable in a few hours. How good is their communication? How much is it affected by stress? How will it evolve with confidence?

Lastly, what’s their level of critical thinking? Are they open to admitting they don’t know? Can they reflect on past projects? How much exposure have they had to different technologies, and what does that say about them?

I find these aspects far more important than details of a particular garbage collection implementation in framework X or Z—or what a hashmap is.

In junior interviews, you assess potential, not just skills or experience. That’s why it’s so hard and requires both judgment and instinct.

Always happy to know your thoughts on this 👇`,
    date: 0,
    public_post: true,
    is_edited: true,
    comments_disabled: "Anyone",
    reacts: [],
    user_id: "123",
    _id: "111",
    tagged_users: [],
    comments: [],
    media: {
      media_type: "images",
      link: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuwz1iiHfv1dnWFljnoUvBJiNaB4Uz2CG1g&s",
      ],
    },

    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
      reposts: 10,
    },

    reactions: [],
    reactions_count: 0,
  },
];

const MOCK_REACTIONS: ReactionType[] = [
  {
    id: 1,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 2,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 3,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
  {
    id: 4,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 5,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 6,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
  {
    id: 7,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 8,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 9,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
  {
    id: 10,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 11,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 12,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
  {
    id: 13,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 14,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 15,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
  {
    id: 16,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 17,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 18,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
  {
    id: 19,
    name: "Abdelrahman Essa",
    title: "ARM Instructor at SemiColon",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "like",
  },
  {
    id: 20,
    name: "Louai Eleslambolyps",
    title: "Biomedical Engineering Student",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "insightful",
  },
  {
    id: 21,
    name: "Farouq Diaa Eldin",
    title: "Software Engineer",
    profileImage:
      "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png",
    reactionType: "funny",
  },
];

// Post Comments
// const commentsHandlers = [
//   //createGetHandler<CommentType[]>("/api/postComments", () => MOCK_COMMENTS),
// ];

// Posts
const postsHandlers = [
  createGetHandler<PostType[]>("/api/posts", () => MOCK_POSTS),
  //createGetHandler<CommentType[]>("/api/postComments/:id", () => MOCK_COMMENTS),
  createGetHandler<PostType>("/api/posts/:id", () => MOCK_POSTS[0]),
];

const reactionsHandlers = [
  createGetHandler<ReactionType[]>("/api/postReactions", () => MOCK_REACTIONS),
];

// feed
export const feedHandlers = [
  ...postsHandlers,
  // ...commentsHandlers,
  ...reactionsHandlers,
];
