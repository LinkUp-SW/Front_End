import React, { useState } from "react";
import moment from "moment";
import { Button } from "../../../components/ui/button";
import {
  AiOutlineLike as LikeIcon,
  AiFillLike as LikedIcon,
} from "react-icons/ai";
import { FaRegCommentDots as CommentIcon } from "react-icons/fa";
import { BiRepost as RepostIcon } from "react-icons/bi";
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
    reposts?: number;
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

  const timeAgo = moment(post.date).fromNow();

  const engagementButtons = [
    {
      name: "Like",
      icon: liked ? <LikedIcon /> : <LikeIcon />,
      callback: () => setLiked(!liked),
    },
    { name: "Comment", icon: <CommentIcon />, callback: () => {} },
    { name: "Repost", icon: <RepostIcon />, callback: () => {} },
    { name: "Send", icon: <SendIcon />, callback: undefined },
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

  const actionMessage = () => {
    switch (action?.action) {
      case "like":
        return (
          <span className="text-gray-500 text-xs dark:text-neutral-400 ">
            <span className="text-xs font-medium text-black dark:text-neutral-200">
              {action.name}
            </span>{" "}
            liked this
          </span>
        );
      case "comment":
        return (
          <span className="text-gray-500 text-xs ">
            <span className="text-xs font-medium text-black">
              {action.name}
            </span>{" "}
            commented on this
          </span>
        );
      case "repost":
        return (
          <span className="text-gray-500 text-xs">
            <span className="text-xs font-medium text-black">
              {action.name}
            </span>{" "}
            reposted this
          </span>
        );
      case "love":
        return (
          <span className="text-gray-500 text-xs">
            <span className="text-xs font-medium">{action.name}</span> loves
            this.
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-2 bg-white border-0 mb-4 pl-0 dark:bg-zinc-900 dark:text-neutral-200">
      <CardContent className="flex flex-col items-center">
        {action && (
          <div className="flex justify-start items-center w-full border-b gap-2 pb-2 dark:border-neutral-700">
            <img
              src={action.profileImage}
              alt={action.name}
              className="w-7 h-7 rounded-full"
            />
            {actionMessage()}
          </div>
        )}
        <div className="flex items-center space-x-3 w-full">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col gap-0 w-full">
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <h2 className="text-sm font-semibold sm:text-base">
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
              </div>
              <div className="flex relative left-5">
                <Button
                  className="rounded-full hover:cursor-pointer"
                  variant="ghost"
                  size="sm"
                >
                  <EllipsisIcon></EllipsisIcon>
                </Button>
                <Button
                  className="rounded-full hover:cursor-pointer"
                  variant="ghost"
                  size="sm"
                >
                  <CloseIcon></CloseIcon>
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-neutral-400">
              <p className="text-ellipsis line-clamp-1">
                {user.followers ? user.followers + " followers" : user.headline}
              </p>

              <div className="flex gap-x-1 items-center dark:text-neutral-400 text-gray-500">
                <h2 className="">{timeAgo}</h2>
                {post.edited && (
                  <>
                    <p className="text-lg font-bold 0"> · </p>
                    <p>Edited </p>
                  </>
                )}
                {post.public && (
                  <>
                    <p className="text-lg font-bold"> · </p>
                    <p className="text-lg">
                      <GlobeIcon />
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex relative text-gray-800 dark:text-neutral-200">
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
        </div>

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
        <div className="flex justify-between w-full items-center pt-4">
          <div className="flex relative text-gray-500 dark:text-neutral-400 text-sm hover:underline hover:cursor-pointer hover:text-blue-500">
            {topStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center text-black dark:text-neutral-200 text-lg"
              >
                {stat.icon}
              </div>
            ))}
            {stats.person
              ? stats.person + " and " + (totalStats - 1) + " others"
              : totalStats}
          </div>
          <div className="flex text-gray-500 dark:text-neutral-400 gap-2 text-sm items-center ">
            <p className="hover:underline hover:text-blue-600 hover:cursor-pointer">
              {stats.comments} comments
            </p>
            {stats.reposts && (
              <>
                <p className="text-md  font-bold"> ·</p>
                <p className="hover:underline hover:text-blue-600 hover:cursor-pointer">
                  {stats.reposts} reposts
                </p>{" "}
              </>
            )}
          </div>
        </div>
        {/* Engagement Buttons */}
        <div className="mt-3 flex justify-around text-gray-600 dark:text-neutral-400 text-sm w-full">
          {engagementButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="lg"
              onClick={button.callback}
              className={`flex ${
                button.name == "Like" &&
                liked &&
                "text-blue-400 hover:text-blue-400"
              } items-center gap-2 ${
                index > 1 ? "" : "hidden sm:flex"
              } hover:cursor-pointer transition-all`}
            >
              {button.icon}
              {button.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
