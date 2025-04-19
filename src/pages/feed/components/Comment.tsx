import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LiaEllipsisHSolid as EllipsisIcon } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import { FaEyeSlash, FaFlag, FaLink } from "react-icons/fa";
import { PiHandsClapping as CelebrateIcon } from "react-icons/pi";
import { FcLike as LoveIcon } from "react-icons/fc";
import { FaRegFaceLaughSquint as LaughIcon } from "react-icons/fa6";
import { HiOutlineLightBulb as InsightfulIcon } from "react-icons/hi";
import { PiHandPalmBold as SupportIcon } from "react-icons/pi";
import { AiOutlineLike as LikeIcon } from "react-icons/ai";
import { Dialog, DialogContent } from "@/components";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ReportCommentModal from "./modals/ReportCommentModal";
import ReactionsModal from "./modals/ReactionsModal";

export interface CommentProps {
  user: {
    profileImage: string;
    name: string;
    degree: string;
    followers?: string;
    headline?: string;
  };
  comment: {
    text: string;
    image?: string;
    edited?: boolean;
  };
  stats: {
    likes?: number;
    replies?: number;
    celebrate?: number;
    love?: number;
    insightful?: number;
    support?: number;
    funny?: number;
    person?: string;
  };
}

const Comment: React.FC<CommentProps> = ({ user, comment, stats }) => {
  const { profileImage, name, degree } = user;
  const { text, edited } = comment;
  const [commentMenuOpen, setCommentMenuOpen] = useState(false);

  const statsArray = [
    {
      name: "celebrate",
      count: stats.celebrate,
      icon: <CelebrateIcon size={15} />,
    },
    { name: "love", count: stats.love, icon: <LoveIcon size={15} /> },
    {
      name: "insightful",
      count: stats.insightful,
      icon: <InsightfulIcon size={15} />,
    },
    { name: "support", count: stats.support, icon: <SupportIcon size={15} /> },
    { name: "funny", count: stats.funny, icon: <LaughIcon size={15} /> },
    { name: "like", count: stats.likes, icon: <LikeIcon size={15} /> },
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

  return (
    <div className="flex flex-col px-0">
      <header className="flex items-center space-x-3 w-full">
        <img
          src={profileImage}
          alt={name}
          className="w-8 h-8 rounded-full relative z-10"
        />
        <div className="w-12 h-16 rounded-full z-0 bg-white dark:bg-gray-900 absolute" />

        <div className="flex flex-col gap-0 w-full relative">
          <section className="flex justify-between">
            <Link to="#" className="flex gap-1 items-center">
              <h2 className="text-xs font-semibold sm:text-sm hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                {name}
              </h2>
              <p className="text-lg text-gray-500 dark:text-neutral-400 font-bold">
                {" "}
                ·
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {" "}
                {degree}
              </p>
            </Link>
            <nav className={`flex relative left-5`}>
              <div className="flex gap-x-1 items-baseline text-xs dark:text-neutral-400 text-gray-500">
                {edited && (
                  <>
                    <span>(edited) </span>
                  </>
                )}
                <time className="">1d</time>
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
              {user.followers ? user.followers + " followers" : user.headline}
            </Link>
          </div>
        </div>
      </header>
      <p className="p-1 pl-11 text-xs md:text-sm">{text}</p>
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
          <DialogContent>
            <ReactionsModal />
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 text-xs hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-400 p-1"
        >
          Reply
        </Button>
        <p className="text-xs  text-gray-500 dark:text-neutral-400 font-bold">
          {" "}
          ·
        </p>
        <p className="hover:underlinetext-xs text-xs text-gray-500 line-clamp-1 text-ellipsis dark:text-neutral-400 hover:text-blue-600 hover:underline dark:hover:text-blue-400 hover:cursor-pointer">
          {stats.replies && stats.replies == 1
            ? "1 Reply"
            : `${stats.replies} Replies`}
        </p>
      </footer>
    </div>
  );
};

export default Comment;
