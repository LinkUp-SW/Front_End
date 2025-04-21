import React, { JSX, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import LoveIcon from "@/assets/Love.svg";
import FunnyIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import { Link } from "react-router-dom";
import { CommentType, PostType, ReactionType } from "@/types";
import { POST_ACTIONS } from "@/constants";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import {
  getEngagementButtons,
  getMenuActions,
  REPOST_MENU,
} from "../components/Menus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TruncatedText,
} from "@/components";
import ReactionsModal from "./modals/ReactionsModal";
import PostImages from "./PostImages";
import IconButton from "./buttons/IconButton";

interface PostProps {
  postUser: any;
  postData: any;
  comments: any[];
  viewMore: boolean;
  reactions: ReactionType[];
  action: any;
}

const Post: React.FC<PostProps> = ({
  postUser,
  postData,
  comments,
  viewMore,
  reactions,
  action,
}) => {
  console.log("Post Data", postData);
  const { date, media, reacts, tagged_users, postID } = postData;
  const [liked, setLiked] = useState(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [sortingMenu, setSortingMenu] = useState(false);
  const [sortingState, setSortingState] = useState("Most relevant");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(
    "Like"
  );

  const reactionIcons = [
    { name: "Celebrate", icon: CelebrateIcon },
    { name: "Like", icon: LikeIcon },
    { name: "Love", icon: LoveIcon },
    { name: "Funny", icon: FunnyIcon },
    { name: "Insightful", icon: InsightfulIcon },
    { name: "Support", icon: SupportIcon },
  ];

  let timeoutId: NodeJS.Timeout;

  const handleToggleComments = () => {
    if (!commentsOpen) {
      setCommentsOpen(true);
    } else {
      const commentInput = document.getElementById(
        "comment-input"
      ) as HTMLInputElement;
      console.log(commentInput);
      if (commentInput) {
        commentInput.focus();
      }
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setReactionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setReactionsOpen(false);
    }, 300);
  };

  const handleSortingState = (selectedState: string) => {
    setSortingState(selectedState);
  };

  useEffect(() => {
    if (media && media.media_type === "none") {
      const img = new Image();
      img.src = media.link[0];
      img.onload = () => {
        setIsLandscape(img.width > img.height); // Check if the image is landscape
      };
    }
  }, [media]);

  const menuActions = getMenuActions();

  const engagementButtons = getEngagementButtons(
    liked,
    () => {
      setLiked(!liked);
      setSelectedReaction("Like");
    },
    () => handleToggleComments()
  );

  const stats = {
    likes: 15,
    love: 2,
    support: 1,
    celebrate: 1,
    comments: 4,
    reposts: 5,
    person: "Hamada",
  };

  const { topStats, totalStats } = calculateTopStats(stats);

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
          user={postUser}
          action={action}
          postMenuOpen={postMenuOpen}
          setPostMenuOpen={setPostMenuOpen}
          menuActions={menuActions}
          edited={postData.edited}
          publicPost={postData.public}
          date={date}
        />
        <TruncatedText
          id="post-content"
          content={postData.content}
          lineCount={3}
        />

        {/* Post Image(s) */}
        {(media && media.media_type === "image") ||
          (media.media_type === "images" && (
            <PostImages images={media.link || []} isLandscape={isLandscape} />
          ))}

        {media && media.media_type === "video" && (
          <div className="flex w-[100%] relative left-4 self-center justify-end">
            <video className="w-full pt-4" controls src={media.link[0]}></video>
          </div>
        )}
        {media && media.media_type === "pdf" && (
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
            {stats.comments != 0 && (
              <p
                onClick={() => {
                  setCommentsOpen(true);
                }}
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer"
              >
                {stats.comments} comments
              </p>
            )}
            {stats.reposts && (
              <>
                <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold">
                  {" "}
                  ·
                </p>

                <p className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer">
                  {stats.reposts} reposts
                </p>
              </>
            )}
          </div>
        </footer>
        {/* Engagement Buttons */}
        <footer className="mt-3 flex justify-around text-gray-600 dark:text-neutral-400 text-sm w-full">
          <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
            {engagementButtons.map(
              (
                button: {
                  name: string;
                  icon: JSX.Element;
                  callback: () => void;
                },
                index: number
              ) =>
                button.name === "Like" ? (
                  <PopoverTrigger
                    asChild
                    key={index}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={button.callback}
                      className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 ${
                        liked && selectedReaction === "Like"
                          ? "text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                          : selectedReaction === "Insightful"
                          ? "text-yellow-700 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400"
                          : selectedReaction === "Love"
                          ? "text-red-700 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          : selectedReaction === "Funny"
                          ? "text-cyan-700 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400"
                          : selectedReaction === "Celebrate"
                          ? "text-green-700 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400"
                          : selectedReaction === "Support"
                          ? "text-purple-700 dark:text-purple-500 hover:text-purple-700 dark:hover:text-purple-400"
                          : ""
                      } items-center hover:cursor-pointer transition-all`}
                    >
                      {selectedReaction && liked ? (
                        <img
                          src={
                            reactionIcons.find(
                              (reaction) => reaction.name === selectedReaction
                            )?.icon
                          }
                          alt={selectedReaction}
                          className="w-4 h-4"
                        />
                      ) : (
                        button.icon
                      )}
                      {viewMore && selectedReaction}
                    </Button>
                  </PopoverTrigger>
                ) : button.name === "Repost" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        key={index}
                        variant="ghost"
                        size="lg"
                        onClick={button.callback}
                        className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                      >
                        {button.icon}
                        {viewMore && button.name}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="relative  dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                      <div className="flex flex-col w-full p-2 gap-4">
                        {REPOST_MENU.map((item, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="lg"
                            onClick={button.callback}
                            className={`flex w-fit h-fit dark:hover:bg-zinc-800 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                          >
                            <div className="flex justify-start w-full  text-gray-600 dark:text-neutral-200">
                              <div className="p-4 pl-0 ">{item.icon}</div>
                              <div className="flex flex-col items-start justify-center">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-xs text-wrap text-left font-normal">
                                  {item.subtext}
                                </span>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    key={index}
                    variant="ghost"
                    size="lg"
                    onClick={button.callback}
                    className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                  >
                    {button.icon}
                    {viewMore && button.name}
                  </Button>
                )
            )}
            <TooltipProvider>
              <PopoverContent
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                align="start"
                className="absolute w-fit bottom-15 dark:bg-gray-900 rounded-full border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out transform"
              >
                <div className="flex">
                  {[
                    { icon: LikeIcon, alt: "Like" },
                    { icon: CelebrateIcon, alt: "Celebrate" },
                    { icon: SupportIcon, alt: "Support" },
                    { icon: LoveIcon, alt: "Love" },
                    { icon: InsightfulIcon, alt: "Insightful" },
                    { icon: FunnyIcon, alt: "Funny" },
                  ].map((reaction, index) => (
                    <Tooltip key={reaction.alt}>
                      <IconButton
                        className={`hover:scale-200 hover:bg-gray-200 w-12 h-12 dark:hover:bg-zinc-800 duration-300 ease-in-out transform transition-all mx-0 hover:mx-7 hover:-translate-y-5`}
                        style={{
                          animation: `bounceIn 0.5s ease-in-out ${
                            index * 0.045
                          }s forwards`,
                          opacity: 0,
                        }}
                        onClick={() => {
                          setSelectedReaction(reaction.alt);
                          setLiked(true);
                          setReactionsOpen(false);
                        }}
                      >
                        <TooltipTrigger asChild>
                          <img
                            src={reaction.icon}
                            alt={reaction.alt}
                            className="w-full h-full"
                          />
                        </TooltipTrigger>
                      </IconButton>

                      <TooltipContent>
                        <p>{reaction.alt}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  <style>
                    {`
                    @keyframes bounceIn {
                    0% {
                    transform: scale(0.5) translateY(50px);
                    opacity: 0;
                    }
                    50% {
                    transform: scale(1.2) translateY(-10px);
                    opacity: 1;
                    }
                    100% {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                    }
                    }
                  `}
                  </style>
                  <style>
                    {`
                    @keyframes popUp {
                    0% {
                    transform: scale(0.5);
                    opacity: 0;
                    }
                    100% {
                    transform: scale(1);
                    opacity: 1;
                    }
                    }
                  `}
                  </style>
                </div>
              </PopoverContent>
            </TooltipProvider>
          </Popover>
        </footer>
      </CardContent>
      <CardFooter>
        {commentsOpen && (
          <PostFooter
            user={postUser}
            sortingMenu={sortingMenu}
            setSortingMenu={setSortingMenu}
            sortingState={sortingState}
            handleSortingState={handleSortingState}
            comments={comments}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default Post;

function calculateTopStats(stats: {
  likes?: number;
  comments?: number;
  celebrate?: number;
  love?: number;
  insightful?: number;
  support?: number;
  funny?: number;
  person?: string;
}) {
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
      icon: <img src={FunnyIcon} alt="Funny" className="w-4 h-4" />,
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
  return { topStats, totalStats };
}
