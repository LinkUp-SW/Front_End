import React, { JSX, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import LoveIcon from "@/assets/Love.svg";
import LaughIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import { Link } from "react-router-dom";
import { CommentType, PostType, ReactionType } from "@/types";
import { POST_ACTIONS } from "@/constants";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { getEngagementButtons, getMenuActions } from "../components/Menus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  TruncatedText,
} from "@/components";
import ReactionsModal from "./modals/ReactionsModal";
import PostImages from "./PostImages";

interface PostProps {
  postData: PostType;
  comments: CommentType[];
  viewMore: boolean;
  reactions: ReactionType[];
}

const Post: React.FC<PostProps> = ({
  postData,
  comments,
  viewMore,
  reactions,
}) => {
  const { user, post, stats, action } = postData;

  const [liked, setLiked] = useState(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [sortingMenu, setSortingMenu] = useState(false);
  const [sortingState, setSortingState] = useState("Most relevant");

  const handleSortingState = (selectedState: string) => {
    setSortingState(selectedState);
  };

  useEffect(() => {
    if (post.images && post.images.length > 0) {
      const img = new Image();
      img.src = post.images[0];
      img.onload = () => {
        setIsLandscape(img.width > img.height); // Check if the image is landscape
      };
    }
  }, [post.images]);

  const menuActions = getMenuActions();

  const engagementButtons = getEngagementButtons(liked, () => setLiked(!liked));

  const statsArray = [
    {
      name: "celebrate",
      count: stats.celebrate,
      icon: <img src={CelebrateIcon} alt="Celebrate" className="w-4 h-4" />,
    },
    {
      name: "love",
      count: stats.love,
      icon: <img src={LoveIcon} alt="Love" className="w-4 h-4" />,
    },
    {
      name: "insightful",
      count: stats.insightful,
      icon: <img src={InsightfulIcon} alt="Insightful" className="w-4 h-4" />,
    },
    {
      name: "support",
      count: stats.support,
      icon: <img src={SupportIcon} alt="Support" className="w-4 h-4" />,
    },
    {
      name: "funny",
      count: stats.funny,
      icon: <img src={LaughIcon} alt="Funny" className="w-4 h-4" />,
    },
    {
      name: "like",
      count: stats.likes,
      icon: <img src={LikeIcon} alt="Like" className="w-4 h-4" />,
    },
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
      <CardContent className="flex flex-col items-start pl-0 w-full">
        {action && (
          <header className="flex pl-4 justify-start items-center w-full border-b gap-2 pb-2 dark:border-neutral-700">
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
          post={post}
        />
        <TruncatedText id="post-content" content={post.content} lineCount={3} />

        {/* Post Image(s) */}
        {post && post.images && post.images.length != 0 && (
          <PostImages images={post.images || []} isLandscape={isLandscape} />
        )}

        {post.video && (
          <div className="flex w-[100%] relative left-4 self-center justify-end">
            <video className="w-full pt-4" controls src={post.video}></video>
          </div>
        )}
        {post.pdf && (
          <div className="h-[37rem] self-center w-full max-w-[34rem] relative left-4.5 pt-4">
            <div className="App">
              <div className="header">React sample</div>
            </div>
          </div>
        )}

        <footer className="flex justify-between w-full items-center pt-4 pl-4">
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
            <DialogContent className="dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700">
              <DialogTitle>
                <h1 className=" px-2 text-xl font-medium">Reactions</h1>
              </DialogTitle>
              <DialogDescription />
              {reactions && reactions.length && (
                <ReactionsModal reactions={reactions} />
              )}
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
          {engagementButtons.map(
            (
              button: { name: string; icon: JSX.Element; callback: () => void },
              index: number
            ) => (
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
                {viewMore && button.name}
              </Button>
            )
          )}
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
