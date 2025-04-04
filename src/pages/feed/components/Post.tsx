import React, { useState } from "react";
import moment from "moment";
import { Button } from "../../../components/ui/button";

import { AiOutlineLike as LikeIcon } from "react-icons/ai";

import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { PiHandsClapping as CelebrateIcon } from "react-icons/pi";
import { FcLike as LoveIcon } from "react-icons/fc";
import { FaRegFaceLaughSquint as LaughIcon } from "react-icons/fa6";
import { HiOutlineLightBulb as InsightfulIcon } from "react-icons/hi";
import { PiHandPalmBold as SupportIcon } from "react-icons/pi";
import { Link } from "react-router-dom";
import { CommentType, PostType } from "@/types";

import { POST_ACTIONS } from "@/constants";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { getEngagementButtons, getMenuActions } from "./menus";
import { Dialog, DialogContent, DialogTrigger, TruncatedText } from "@/components";
import ReactionsModal from "./modals/ReactionsModal";

interface PostProps {
  postData: PostType;
  comments: CommentType[];
}

const Post: React.FC<PostProps> = ({ postData, comments }) => {
  const { user, post, stats, action } = postData;

  const [liked, setLiked] = useState(false);

  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [sortingMenu, setSortingMenu] = useState(false);
  const [sortingState, setSortingState] = useState("Most relevant");

  const handleSortingState = (selectedState: string) => {
    setSortingState(selectedState);
  };

  // If not expanded, show only 40 words + ...

  const menuActions = getMenuActions();

  const engagementButtons = getEngagementButtons(liked, () => setLiked(!liked));

  const timeAgo = moment(post.date).fromNow();

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
              {POST_ACTIONS[action?.action || "error"]}
            </span>
          </header>
        )}
        <PostHeader
          user={user}
          action={action}
          postMenuOpen={postMenuOpen}
          setPostMenuOpen={setPostMenuOpen}
          menuActions={menuActions}
          timeAgo={timeAgo}
          post={post}
        />
        <TruncatedText id="post-content" content={post.content} lineCount={3} />

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
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex relative text-gray-500 dark:text-neutral-400 text-sm hover:underline hover:cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
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
            </DialogTrigger>
            <DialogContent>
              <ReactionsModal />
            </DialogContent>
          </Dialog>
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
      <CardFooter>
        <PostFooter
          user={user}
          sortingMenu={sortingMenu}
          setSortingMenu={setSortingMenu}
          sortingState={sortingState}
          handleSortingState={handleSortingState}
          comments={comments}
        />
      </CardFooter>
    </Card>
  );
};

export default Post;
