import React, { useState } from "react";
import moment from "moment";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AiOutlineLike as LikeIcon,
  AiFillLike as LikedIcon,
} from "react-icons/ai";
import {
  FaRegCommentDots as CommentIcon,
  FaBan,
  FaBookmark,
  FaFlag,
  FaLink,
  FaUserSlash,
} from "react-icons/fa";
import { BsFillSendFill as SendIcon } from "react-icons/bs";
import { HiGlobeEuropeAfrica as GlobeIcon } from "react-icons/hi2";
import { Card, CardContent } from "../../../components/ui/card";
import { PiHandsClapping as CelebrateIcon } from "react-icons/pi";
import { FcLike as LoveIcon } from "react-icons/fc";
import { FaRegFaceLaughSquint as LaughIcon } from "react-icons/fa6";
import { HiOutlineLightBulb as InsightfulIcon } from "react-icons/hi";
import { PiHandPalmBold as SupportIcon } from "react-icons/pi";
import { LiaEllipsisHSolid as EllipsisIcon } from "react-icons/lia";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { useDispatch } from "react-redux";
import { handleOpenModalType } from "@/utils";
import { Link } from "react-router-dom";

interface PostProps {
  user: {
    name: string;
    profileImage: string;
    headline?: string;
    followers?: string;
    degree: string;
  };
  post: {
    content: string;
    date: number;
    images?: string[];
    public: boolean;
    edited?: boolean;
  };
  stats: {
    likes?: number;
    comments?: number;
    celebrate?: number;
    love?: number;
    insightful?: number;
    support?: number;
    funny?: number;
    person?: string;
  };
  action?: {
    name?: string;
    profileImage?: string;
    action?: "like" | "comment" | "repost" | "love";
  };
}

const Post: React.FC<PostProps> = ({ user, post, stats, action }) => {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOpenModal = (modalName: string) => {
    dispatch(handleOpenModalType(modalName)); // Dispatch a string identifier or an object with modal details
  };

  const timeAgo = moment(post.date).fromNow();

  const engagementButtons = [
    {
      name: "Like",
      icon: liked ? <LikedIcon /> : <LikeIcon />,
      callback: () => setLiked(!liked),
    },
    { name: "Comment", icon: <CommentIcon />, callback: () => () => {} },
    {
      name: "Send",
      icon: <SendIcon />,
      callback: () => handleOpenModal("send_post"),
    },
  ];

  const statsArray = [
    { name: "celebrate", count: stats.celebrate, icon: <CelebrateIcon /> },
    { name: "love", count: stats.love, icon: <LoveIcon /> },
    { name: "insightful", count: stats.insightful, icon: <InsightfulIcon /> },
    { name: "support", count: stats.support, icon: <SupportIcon /> },
    { name: "funny", count: stats.funny, icon: <LaughIcon /> },
    { name: "like", count: stats.likes, icon: <LikeIcon /> },
  ];

  const topStats = statsArray
    .filter((stat) => stat.count)
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 3);
  if (!topStats.length) {
    topStats.push(statsArray[5]);
  }

  const totalStats =
    (stats.likes || 0) +
    (stats.celebrate || 0) +
    (stats.love || 0) +
    (stats.insightful || 0) +
    (stats.support || 0) +
    (stats.funny || 0);

  const actionMappings: Record<string, string> = {
    like: "liked this",
    comment: "commented on this",
    repost: "reposted this",
    love: "loves this.",
    error: "no action",
  };

  const menuActions = [
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

  return (
    <Card className="p-2 bg-white border-0 mb-4 pl-0 dark:bg-gray-900 dark:text-neutral-200">
      <CardContent className="flex flex-col items-center">
        {action && (
          <header className="flex justify-start items-center w-full border-b gap-2 pb-2 dark:border-neutral-700">
            <img
              src={action.profileImage}
              alt={action.name}
              className="w-7 h-7 rounded-full"
            />

            <span className="text-gray-500 text-xs dark:text-neutral-400">
              <Link
                to="#"
                className="text-xs font-medium text-black dark:text-neutral-200 hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                {action.name}
              </Link>{" "}
              {actionMappings[action?.action || "error"]}
            </span>
          </header>
        )}
        <header className="flex items-center space-x-3 w-full">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col gap-0 w-full relative">
            <div className="flex justify-between">
              <Link to="#" className="flex gap-1 items-center">
                <h2 className="text-sm font-semibold sm:text-base hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                  {user.name}
                </h2>
                <p className="text-lg text-gray-500 dark:text-neutral-400 font-bold">
                  {" "}
                  ·
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  {" "}
                  {user.degree}
                </p>
              </Link>
              <nav className={`flex relative left-5 ${action && "bottom-10"}`}>
                <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                  <PopoverTrigger>
                    <Button
                      className="rounded-full dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <EllipsisIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="relative right-30 dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                    <div className="flex flex-col w-full p-0">
                      {menuActions.map((item, index) => (
                        <Button
                          key={index}
                          onClick={() => {
                            item.action();
                            setMenuOpen(false);
                          }}
                          className="flex justify-start items-center rounded-none h-12 bg-transparent w-full p-0 m-0 hover:bg-neutral-200 text-gray-900 dark:text-neutral-200 dark:hover:bg-gray-600 hover:cursor-pointer"
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  className="rounded-full dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200"
                  variant="ghost"
                  size="sm"
                >
                  <CloseIcon></CloseIcon>
                </Button>
              </nav>
            </div>
            {action && (
              <Button
                variant="ghost"
                className="absolute -right-3 top-1 hover:cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2 text-blue-700  dark:text-blue-400 text-[1rem]">
                  <p>+</p>
                  <p>Follow</p>
                </div>
              </Button>
            )}
            <div className="text-xs text-gray-500 dark:text-neutral-400">
              <Link
                to="#"
                className={`text-ellipsis line-clamp-1 ${action && "pr-20"}`}
              >
                {user.followers ? user.followers + " followers" : user.headline}
              </Link>

              <div className="flex gap-x-1 items-center dark:text-neutral-400 text-gray-500">
                <time className="">{timeAgo}</time>
                {post.edited && (
                  <>
                    <p className="text-lg font-bold 0"> · </p>
                    <span>Edited </span>
                  </>
                )}
                {post.public && (
                  <>
                    <p className="text-lg font-bold"> · </p>
                    <span className="text-lg">
                      <GlobeIcon />
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <section className="flex relative text-gray-800 dark:text-neutral-200">
          <p className={`mt-2 text-sm   ${expanded ? "" : "line-clamp-3"}`}>
            {post.content}
          </p>
          {post.content.split(" ").length > 30 && (
            <Button
              variant="ghost"
              className="text-gray-500 absolute -bottom-2 transition-all -right-6 hover:bg-transparent hover:cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "less" : "more"}
            </Button>
          )}
        </section>

        {/* Post Image(s) */}
        {post.images && post.images.length > 0 && (
          <div className="mt-3">
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        <footer className="flex justify-between w-full items-center pt-4">
          <button
            onClick={() => handleOpenModal("reactions")}
            className="flex relative text-gray-500 dark:text-neutral-400 text-sm hover:underline hover:cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
          >
            {topStats.map((stat, index) => (
              <span
                key={index}
                className="flex items-center text-black dark:text-neutral-200 text-lg"
              >
                {stat.icon}
              </span>
            ))}
            {stats.person
              ? stats.person + " and " + (totalStats - 1) + " others"
              : totalStats}
          </button>
          <div className="flex text-gray-500 dark:text-neutral-400 gap-2 text-sm items-center ">
            <p className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer">
              {stats.comments} comments
            </p>
          </div>
        </footer>
        {/* Engagement Buttons */}
        <footer className="mt-3 flex justify-around text-gray-600 dark:text-neutral-400 text-sm w-full">
          {engagementButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="lg"
              onClick={button.callback}
              className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 ${
                button.name == "Like" &&
                liked &&
                "text-blue-400 hover:text-blue-400 dark:hover:text-blue-400"
              } items-center gap-2 hover:cursor-pointer  transition-all`}
            >
              {button.icon}
              {button.name}
            </Button>
          ))}
        </footer>
      </CardContent>
    </Card>
  );
};

export default Post;
