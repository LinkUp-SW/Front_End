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

export const getMenuActions = (
  handleOpenModal: (modalName: string) => void
) => [
  {
    name: "Save",
    action: () => console.log("Save clicked"),
    icon: <FaBookmark className="mr-2" />,
  },
  {
    name: "Copy Link",
    action: () => console.log("Copy Link clicked"),
    icon: <FaLink className="mr-2" />,
  },
  {
    name: "Block Post",
    action: () => console.log("Block Post clicked"),
    icon: <FaBan className="mr-2" />,
  },
  {
    name: "Report Post",
    action: () => handleOpenModal("report_post"),
    icon: <FaFlag className="mr-2" />,
  },
  {
    name: "Unfollow",
    action: () => console.log("Unfollow clicked"),
    icon: <FaUserSlash className="mr-2" />,
  },
];

export const COMMENT_SORTING_MENU = [
  {
    name: "Most relevant",
    subtext: "See the most relevant comments",
    action: () => console.log("Most relevant pressed"),
    icon: <FaRocket className="mr-2" />,
  },
  {
    name: "Most recent",
    subtext: "See all the comments, the most recent comments are first",
    action: () => console.log("Most Recent pressed"),
    icon: <FaClock className="mr-2" />,
  },
];

export const getEngagementButtons = (
  liked: boolean,
  toggleLiked: () => void,
  handleOpenModal: (modalName: string) => void
) => [
  {
    name: "Like",
    icon: liked ? <LikedIcon /> : <LikeIcon />,
    callback: toggleLiked,
  },
  {
    name: "Comment",
    icon: <CommentIcon />,
    callback: () => {
      // Add your comment callback here if needed
    },
  },
  {
    name: "Repost",
    icon: <RepostIcon />,
    callback: () => {},
  },
  {
    name: "Send",
    icon: <SendIcon />,
    callback: () => handleOpenModal("send_post"),
  },
];
