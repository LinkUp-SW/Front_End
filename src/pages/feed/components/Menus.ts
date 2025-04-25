import {
  FaBan,
  FaBookmark,
  FaClock,
  FaEdit,
  FaFlag,
  FaLink,
  FaRocket,
  FaTrash,
  FaUserSlash,
  FaEyeSlash,
  FaRegBookmark,
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
import { toast } from "sonner";

export const getMenuActions: (
  savePost: () => void,
  blockPost: () => void,
  reportPost: () => void,
  unfollow: () => void,
  _id: string,
  isSaved?: boolean
) => MenuAction[] = (
  savePost,
  blockPost,
  reportPost,
  unfollow,
  _id,
  isSaved
) => [
  {
    name: isSaved ? "Unsave" : "Save",
    action: () => savePost(),
    icon: React.createElement(isSaved ? FaBookmark : FaRegBookmark, {
      className: "mr-2",
    }),
  },
  {
    name: "Copy Link",
    action: () => copyPostLinkToClipboard(_id),
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
  savePost: () => void,
  editPost: () => void,
  deletePost: () => void,
  _id: string,
  isSaved?: boolean
) => MenuAction[] = (savePost, editPost, deletePost, _id, isSaved) => [
  {
    name: isSaved ? "Unsave" : "Save",
    action: () => savePost(),
    icon: React.createElement(isSaved ? FaBookmark : FaRegBookmark, {
      className: "mr-2",
    }),
  },
  {
    name: "Copy Link",
    action: () => copyPostLinkToClipboard(_id),
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

const copyPostLinkToClipboard = (postId: string) => {
  const postLink = `${window.location.origin}/feed/posts/${postId}`; // Construct the full post link
  navigator.clipboard
    .writeText(postLink)
    .then(() => {
      // Show a toast notification on success
      toast.success("Post link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy post link:", err);
      // Show a toast notification on failure
      toast.error("Failed to copy post link. Please try again.");
    });
};

export const getSaveMenuActions: (
  savePost: () => void,
  sendPost: () => void,
  reportPost: () => void,
  _id: string
) => MenuAction[] = (savePost, sendPost, reportPost, _id) => [
  {
    name: "Unsave",
    action: () => savePost(),
    icon: React.createElement(FaBookmark, {
      className: "mr-2",
    }),
  },
  {
    name: "Copy Link",
    action: () => copyPostLinkToClipboard(_id),
    icon: React.createElement(FaLink, { className: "mr-2" }),
  },
  {
    name: "Send Post",
    action: () => sendPost(),
    icon: React.createElement(SendIcon, { className: "mr-2" }),
  },
  {
    name: "Report Post",
    action: () => reportPost(),
    icon: React.createElement(FaFlag, { className: "mr-2" }),
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
  selectedReaction: string,
  toggleLiked: () => void,
  toggleComments: () => void
) => [
  {
    name: "Like",
    icon:
      selectedReaction == "Like"
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
