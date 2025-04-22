import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { HiGlobeEuropeAfrica as GlobeIcon } from "react-icons/hi2";
import { LiaEllipsisHSolid as EllipsisIcon } from "react-icons/lia";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { Button, Dialog, DialogTrigger, DialogContent } from "@/components";
import ReportPostModal from "./modals/ReportPostModal";
import { MenuAction, PostUserType } from "@/types";
import moment from "moment";

interface User {
  name: string;
  profileImage: string;
  headline?: string;
  followers?: string;
  degree: string;
}

interface Action {
  name?: string;
  profileImage?: string;
  action?: "like" | "comment" | "repost" | "love";
}

interface PostHeaderProps {
  user: PostUserType;
  action?: Action;
  postMenuOpen: boolean;
  setPostMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuActions: MenuAction[]; // You can replace `any` with a more specific type if available
  savedPostView?: boolean;
  edited?: boolean;
  publicPost?: boolean;
  date: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  action,
  postMenuOpen,
  setPostMenuOpen,
  menuActions,
  savedPostView = false,
  edited,
  publicPost,
  date,
}) => {
  const timeAgo = moment(date * 1000).fromNow();

  return (
    <header className="flex items-center space-x-3 w-full pl-4 pt-1 pb-4">
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-8 h-8 md:w-12 md:h-12 rounded-full"
      />
      <div className="flex flex-col gap-0 w-full relative">
        <div className="flex justify-between">
          <Link
            to={`/user-profile/${user.username}`}
            className="flex gap-1 items-center"
          >
            <h2 className="text-xs md:text-sm font-semibold sm:text-base hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400">
              {user.firstName + " " + user.lastName}
            </h2>
            <p className="text-lg text-gray-500 dark:text-neutral-400 font-bold">
              {" "}
              ·
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              {" "}
              {user.connectionDegree}
            </p>
          </Link>
          <nav
            className={`flex relative left-5 gap-2 ${
              action ? "bottom-10" : ""
            }`}
          >
            <Dialog>
              <Popover open={postMenuOpen} onOpenChange={setPostMenuOpen}>
                <PopoverTrigger
                  asChild
                  className="rounded-full  relative top-1 z-10 w-7 h-7 px-1 aspect-square hover:bg-neutral-200 dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200 "
                >
                  <EllipsisIcon
                    onClick={() => setPostMenuOpen(!postMenuOpen)}
                    className=""
                  />
                </PopoverTrigger>
                <PopoverContent className="relative right-30 dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                  <div className="flex flex-col w-full p-0">
                    {menuActions.map((item: MenuAction, index: number) =>
                      item.name == "Report Post" ? (
                        <DialogTrigger asChild key={index}>
                          <Button
                            onClick={() => {
                              item.action();
                              setPostMenuOpen(!postMenuOpen);
                            }}
                            className="flex justify-start items-center rounded-none h-12 bg-transparent w-full p-0 m-0 hover:bg-neutral-100 text-gray-900 dark:text-neutral-200 dark:hover:bg-gray-600 hover:cursor-pointer"
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
                            setPostMenuOpen(!postMenuOpen);
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
                <ReportPostModal />
              </DialogContent>
            </Dialog>
            {!savedPostView && (
              <Button
                className="rounded-full hover:bg-neutral-100 w-7 h-7 relative top-1 aspect-square dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200"
                variant="ghost"
                size="sm"
              >
                <CloseIcon />
              </Button>
            )}
          </nav>
        </div>
        {action && (
          <Button
            variant="ghost"
            className="absolute -right-3 top-1 pl-2 hover:cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-[1rem]">
              <p>+</p>
              <p>Follow</p>
            </div>
          </Button>
        )}
        <div className="text-xs text-gray-500 dark:text-neutral-400">
          <Link
            to="#"
            className={`text-ellipsis line-clamp-1 ${action ? "pr-20" : ""}`}
          >
            {user.headline}
          </Link>

          <div className="flex gap-x-1 items-center dark:text-neutral-400 text-gray-500">
            <time className="">{timeAgo}</time>
            {edited && (
              <>
                <p className="text-lg font-bold"> · </p>
                <span>Edited </span>
              </>
            )}
            {publicPost && (
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
  );
};

export default PostHeader;
