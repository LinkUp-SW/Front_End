import {
  FaBan,
  FaBookmark,
  FaClock,
  FaEdit,
  FaEye,
  FaFlag,
  FaLink,
  FaRocket,
  FaTrash,
  FaUserSlash,
  FaEyeSlash,
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
import { EditIcon } from "lucide-react";
import { FaMessage } from "react-icons/fa6";

export const getMenuActions: (
  savePost: () => void,
  copyLink: () => void,
  blockPost: () => void,
  reportPost: () => void,
  unfollow: () => void
) => MenuAction[] = (savePost, copyLink, blockPost, reportPost, unfollow) => [
  {
    name: "Save",
    action: () => savePost(),
    icon: React.createElement(FaBookmark, { className: "mr-2" }),
  },
  {
    name: "Copy Link",
    action: () => copyLink(),
    icon: React.createElement(FaLink, { className: "mr-2" }),
  },
  {
    name: "Block Post",
    action: () => blockPost(),
    icon: React.createElement(FaBan, { className: "mr-2" }),
  },
  {
    name: "Report Post",
    action: () => reportPost(),
    icon: React.createElement(FaFlag, { className: "mr-2" }),
  },
  {
    name: "Unfollow",
    action: () => unfollow(),
    icon: React.createElement(FaUserSlash, { className: "mr-2" }),
  },
];

export const getPersonalMenuActions: (
  savePost: any,
  copyLink: any,
  editPost: any,
  deletePost: any
) => MenuAction[] = (savePost, copyLink, editPost, deletePost) => [
  {
    name: "Save",
    action: () => savePost(),
    icon: React.createElement(FaBookmark, { className: "mr-2" }),
  },
  {
    name: "Copy Link",
    action: () => copyLink(),
    icon: React.createElement(FaLink, { className: "mr-2" }),
  },
  {
    name: "Edit Post",
    action: () => editPost(),
    icon: React.createElement(FaEdit, { className: "mr-2" }),
  },
  {
    name: "Delete Post",
    action: () => deletePost(),
    icon: React.createElement(FaTrash, { className: "mr-2" }),
  },
];

export const REPOST_MENU = [
  {
    name: "Repost with your thoughts",
    subtext: "Create a new post with this post attached",
    action: () => console.log("Repost 1"),
    icon: React.createElement(EditIcon, { className: "mr-2" }),
  },
  {
    name: "Repost",
    subtext: "Instantly bring this post to others' feeds",
    action: () => console.log("Repost 2"),
    icon: React.createElement(RepostIcon, { className: "mr-2" }),
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
  toggleLiked: () => void,
  toggleComments: () => void
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
      toggleComments();
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

export const getCommentActions: (
  copyLink: () => void,
  reportComment: () => void,
  hideComment: () => void
) => MenuAction[] = (copyLink, reportComment, hideComment) => [
  {
    name: "Copy link to comment",
    action: () => copyLink(),
    icon: React.createElement(FaLink, { className: "mr-2" }),
  },
  {
    name: "Report Comment",
    action: () => reportComment(),
    icon: React.createElement(FaFlag, { className: "mr-2" }),
  },
  {
    name: "I don't want to see this",
    action: () => hideComment(),
    icon: React.createElement(FaEyeSlash, { className: "mr-2" }),
  },
];

export const getPrivateCommentActions: (
  copyLink: () => void,
  editComment: () => void,
  deleteComment: () => void
) => MenuAction[] = (copyLink, editComment, deleteComment) => [
  {
    name: "Copy link to comment",
    action: () => copyLink(),
    icon: React.createElement(FaLink, { className: "mr-2" }),
  },
  {
    name: "Edit",
    action: () => editComment(),
    icon: React.createElement(FaEdit, { className: "mr-2" }),
  },
  {
    name: "Delete",
    action: () => deleteComment(),
    icon: React.createElement(FaTrash, { className: "mr-2" }),
  },
];
