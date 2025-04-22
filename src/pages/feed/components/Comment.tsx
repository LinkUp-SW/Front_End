import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import { data, Link } from "react-router-dom";
import { LiaEllipsisHSolid as EllipsisIcon } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import { FaEyeSlash, FaFlag, FaLink } from "react-icons/fa";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import LoveIcon from "@/assets/Love.svg";
import LaughIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ReportCommentModal from "./modals/ReportCommentModal";
import ReactionsModal from "./modals/ReactionsModal";
import { getPostReactions } from "@/endpoints/feed";
import { CommentType, ReactionType } from "@/types";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import DOMPurify from "dompurify";

export interface CommentProps {
  comment: CommentType;
  stats: any;
  setIsReplyActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  stats,
  setIsReplyActive,
}) => {
  const {
    profilePicture,
    username,
    firstName,
    lastName,
    connectionDegree,
    headline,
  } = comment.author;

  if (!stats) {
    stats = {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 2,
      reposts: 5,
      person: "Hamada",
    };
  }

  const { content, date, is_edited, media } = comment;

  const sanitizedContent = DOMPurify.sanitize(content);

  const [commentMenuOpen, setCommentMenuOpen] = useState(false);
  const [reactions, setReactions] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useSelector((state: RootState) => state.userBio);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        // Call both endpoints concurrently
        const [fetchedReactions] = await Promise.all([getPostReactions()]);

        if (fetchedReactions) setReactions(fetchedReactions);
        else setReactions([]);
      } catch (error) {
        console.error("Error fetching feed data", error);
      }
    };

    fetchData();
    setIsLoading(false);
  }, []);

  let countChildren = 0;
  if (comment.children) {
    countChildren = Object.keys(comment.children).length;
  }

  const statsArray = [
    {
      name: "celebrate",
      count: stats.celebrate,
      icon: <img src={CelebrateIcon} alt="Celebrate" width={15} height={15} />,
    },
    {
      name: "love",
      count: stats.love,
      icon: <img src={LoveIcon} alt="Love" width={15} height={15} />,
    },
    {
      name: "insightful",
      count: stats.insightful,
      icon: (
        <img src={InsightfulIcon} alt="Insightful" width={15} height={15} />
      ),
    },
    {
      name: "support",
      count: stats.support,
      icon: <img src={SupportIcon} alt="Support" width={15} height={15} />,
    },
    {
      name: "funny",
      count: stats.funny,
      icon: <img src={LaughIcon} alt="Funny" width={15} height={15} />,
    },
    {
      name: "like",
      count: stats.likes,
      icon: <img src={LikeIcon} alt="Like" width={15} height={15} />,
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

  const menuActions = [
    {
      name: "Copy link to comment",
      action: () => console.log("Copy Link clicked"),
      icon: <FaLink className="mr-2" />,
    },
    {
      name: "Report Comment",
      action: () => {},
      icon: <FaFlag className="mr-2" />,
    },
    {
      name: "I don't want to see this",
      action: () => console.log("Unfollow clicked"),
      icon: <FaEyeSlash className="mr-2" />,
    },
  ];

  const timeAgo = moment(date * 1000).fromNow();

  return (
    <div className="flex flex-col px-0">
      <header className="flex items-center space-x-3 w-full">
        <img
          src={profilePicture}
          alt={username}
          className="w-8 h-8 rounded-full relative z-10"
        />
        <div className="w-12 h-16 rounded-full z-0 bg-white dark:bg-gray-900 absolute" />

        <div className="flex flex-col gap-0 w-full relative">
          <section className="flex justify-between">
            <Link
              to={`/user-profile/${username}`}
              className="flex gap-1 items-center"
            >
              <h2 className="text-xs font-semibold sm:text-sm hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                {firstName + " " + lastName}
              </h2>
              <p className="text-lg text-gray-500 dark:text-neutral-400 font-bold">
                {" "}
                ·
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {" "}
                {connectionDegree}
              </p>
            </Link>
            <nav className={`flex relative left-5`}>
              <div className="flex gap-x-1 items-baseline text-xs dark:text-neutral-400 text-gray-500">
                {is_edited && (
                  <>
                    <span>(edited) </span>
                  </>
                )}
                <time className="">{timeAgo}</time>
              </div>
              <Dialog>
                <Popover
                  open={commentMenuOpen}
                  onOpenChange={setCommentMenuOpen}
                >
                  <PopoverTrigger className="rounded-full relative -top-2 light:hover:bg-gray-100 transition-colors dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200 h-8 gap-1.5 px-3 has-[>svg]:px-2.5">
                    <EllipsisIcon
                      onClick={() => setCommentMenuOpen(!commentMenuOpen)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="relative right-30 dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                    <div className="flex flex-col w-full p-0">
                      {menuActions.map((item, index) =>
                        item.name == "Report Comment" ? (
                          <DialogTrigger key={index} asChild>
                            <Button
                              key={index}
                              onClick={() => {
                                setCommentMenuOpen(false);
                              }}
                              className="flex justify-start items-center rounded-none h-12 bg-transparent w-full p-0 m-0 hover:bg-neutral-200 text-gray-900 dark:text-neutral-200 dark:hover:bg-gray-600 hover:cursor-pointer"
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </Button>
                          </DialogTrigger>
                        ) : (
                          <Button
                            key={index}
                            onClick={() => {
                              item.action();
                              setCommentMenuOpen(false);
                            }}
                            className="flex justify-start items-center rounded-none h-12 bg-transparent w-full p-0 m-0 hover:bg-neutral-200 text-gray-900 dark:text-neutral-200 dark:hover:bg-gray-600 hover:cursor-pointer"
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Button>
                        )
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <DialogContent>
                  <ReportCommentModal />
                </DialogContent>
              </Dialog>
            </nav>
          </section>
          <div className="text-xs text-gray-500 dark:text-neutral-400 relative -top-2">
            <Link to="#" className={`text-ellipsis line-clamp-1`}>
              {headline}
            </Link>
          </div>
        </div>
      </header>
      <p
        className="p-1 pl-11 text-xs md:text-sm whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      ></p>
      <footer className="flex pl-10 justify-start items-center gap-0.5 ">
        {/* <div className="flex justify-start w-full items-center pt-4 gap-0"> */}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs  text-gray-400 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-400 p-1"
        >
          Like
        </Button>
        <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold">
          {" "}
          ·
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex border-r pr-3 relative items-end text-gray-500 dark:text-neutral-400 text-xs hover:underline hover:cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              {topStats.map((stat, index) => (
                <span
                  key={index}
                  className="flex items-center text-black dark:text-neutral-200 text-lg"
                >
                  {stat.icon}
                </span>
              ))}
              {totalStats}
            </button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700">
            <DialogTitle>
              <h1 className=" px-2 text-xl font-medium">Reactions</h1>
            </DialogTitle>
            <DialogDescription />
            <ReactionsModal reactions={reactions} />
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 text-xs hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-400 p-1"
          onClick={() => {
            setIsReplyActive(true);
          }}
        >
          Reply
        </Button>
        {countChildren != 0 && (
          <>
            <p className="text-xs  text-gray-500 dark:text-neutral-400 font-bold">
              {" "}
              ·
            </p>
            <p className="hover:underlinetext-xs text-xs text-gray-500 line-clamp-1 text-ellipsis dark:text-neutral-400 hover:text-blue-600 hover:underline dark:hover:text-blue-400 hover:cursor-pointer">
              {countChildren == 1 ? "1 Reply" : `${countChildren} Replies`}
            </p>
          </>
        )}
      </footer>
    </div>
  );
};

export default Comment;
