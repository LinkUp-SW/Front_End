import {
  FaBan,
  FaBookmark,
  FaClock,
  FaFlag,
  FaLink,
  FaRocket,
  FaUserSlash,
} from "react-icons/fa";
import { BiRepost as RepostIcon } from "react-icons/bi";
import { FaRegCommentDots as CommentIcon } from "react-icons/fa";
import {
  AiOutlineLike as LikeIcon,
  AiFillLike as LikedIcon,
} from "react-icons/ai";
import { BsFillSendFill as SendIcon } from "react-icons/bs";
import { MenuAction } from "@/types";
import React from "react";

export const getMenuActions: () => MenuAction[] = () => [
  {
    name: "Save",
    action: () => console.log("Save clicked"),
    icon: React.createElement(FaBookmark, { className: "mr-2" }),
  },
  {
    name: "Copy Link",
    action: () => console.log("Copy Link clicked"),
    icon: React.createElement(FaLink, { className: "mr-2" }),
  },
  {
    name: "Block Post",
    action: () => console.log("Block Post clicked"),
    icon: React.createElement(FaBan, { className: "mr-2" }),
  },
  {
    name: "Report Post",
    action: () => console.log("Report Post Clicked"),
    icon: React.createElement(FaFlag, { className: "mr-2" }),
  },
  {
    name: "Unfollow",
    action: () => console.log("Unfollow clicked"),
    icon: React.createElement(FaUserSlash, { className: "mr-2" }),
  },
];

export const COMMENT_SORTING_MENU: MenuAction[] = [
  {
    name: "Most relevant",
    subtext: "See the most relevant comments",
    action: () => console.log("Most relevant pressed"),
    icon: React.createElement(FaRocket, { className: "mr-2" }),
  },
  {
    name: "Most recent",
    subtext: "See all the comments, the most recent comments are first",
    action: () => console.log("Most Recent pressed"),
    icon: React.createElement(FaClock, { className: "mr-2" }),
  },
];

export const getEngagementButtons = (
  liked: boolean,
  toggleLiked: () => void
) => [
  {
    name: "Like",
    icon: liked
      ? React.createElement(LikedIcon)
      : React.createElement(LikeIcon),
    callback: toggleLiked,
  },
  {
    name: "Comment",
    icon: React.createElement(CommentIcon),
    callback: () => {
      // Add your comment callback here if needed
    },
  },
  {
    name: "Repost",
    icon: React.createElement(RepostIcon),
    callback: () => {},
  },
  {
    name: "Send",
    icon: React.createElement(SendIcon),
    callback: () => {},
  },
];
