import React, { useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaChevronDown, FaRocket, FaClock } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components";
import { Link } from "react-router-dom";
import { CommentType } from "@/types";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import CommentWithReplies from "./CommentWithReplies";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

interface SortingMenuItem {
  name: string;
  subtext: string;
  action: () => void;
  icon: React.ReactNode;
}

export const COMMENT_SORTING_MENU: SortingMenuItem[] = [
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

interface PostFooterProps {
  user: {
    name: string;
    profileImage: string;
    headline?: string;
    followers?: string;
    degree: string;
  };
  sortingMenu: boolean;
  setSortingMenu: React.Dispatch<React.SetStateAction<boolean>>;
  sortingState: string;
  handleSortingState: (selectedState: string) => void;
  comments: CommentType[];
}

const PostFooter: React.FC<PostFooterProps> = ({
  user,
  sortingMenu,
  setSortingMenu,
  sortingState,
  handleSortingState,
  comments,
}) => {
  // Create a ref for the horizontally scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [commentInput, setCommentInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEmojiRequest = (emoji: any) => {
    setCommentInput((prevMessage) => prevMessage + emoji.emoji);
  };

  // Scroll right by 100 pixels (adjust as needed)
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="flex flex-col w-full gap-4">
      {/* Container for text buttons with relative so our scroll button can be absolute */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-1 z-10 overflow-x-clip"
        >
          {[
            "I appreciate this!",
            "Congratulations!",
            "Useful takeaway",
            "I appreciate this!",
            "Congratulations!",
            "Useful takeaway",
            "I appreciate this!",
            "Congratulations!",
            "Useful takeaway",
          ].map((text, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setCommentInput(text);
                inputRef.current?.focus();
              }}
              className="bg-transparent light:border-gray-600 light:hover:border-2 dark:hover:text-neutral-200 dark:hover:bg-transparent hover:cursor-pointer dark:text-blue-300 dark:border-blue-300 rounded-full"
            >
              {text}
            </Button>
          ))}
        </div>
        {/* Overlay button to scroll to the right */}
        <Button
          onClick={scrollRight}
          variant="ghost"
          className="absolute right-0 top-0 h-full bg-black bg-opacity-100 hover:bg-opacity-100 transition-colors"
        >
          &gt;
        </Button>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex space-x-3 justify-start items-center w-full">
          <Link to={"#"}>
            <Avatar className="h-8 w-8 pl-0">
              <AvatarImage src={user.profileImage} alt="Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex relative w-full items-center">
            <input
              ref={inputRef}
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className=" w-full h-11 border p-4 focus:ring-1 transition-colors hover:text-gray-950 dark:hover:text-neutral-300 rounded-full border-gray-400 font-normal text-sm text-black  text-left dark:text-neutral-300"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute right-10 bottom-1 hover:cursor-pointer rounded-full"
                >
                  <MdOutlineEmojiEmotions />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <EmojiPicker onEmojiClick={handleEmojiRequest} />
              </PopoverContent>
            </Popover>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-1 hover:cursor-pointer rounded-full"
            >
              <MediaIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex relative -left-5">
        <Popover open={sortingMenu} onOpenChange={setSortingMenu}>
          <PopoverTrigger
            asChild
            className="rounded-full dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200 h-8 gap-1.5 px-3"
          >
            <div className="flex items-center gap-1 text-gray-500 text-sm font-medium ">
              <p>{sortingState}</p>
              <FaChevronDown />
            </div>
          </PopoverTrigger>
          <PopoverContent className="relative dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
            <div className="flex flex-col w-full p-0">
              {COMMENT_SORTING_MENU.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    handleSortingState(item.name);
                    setSortingMenu(false);
                    item.action();
                  }}
                  className="flex justify-start items-center rounded-none bg-transparent w-full h-16 pt-4 py-4 hover:bg-neutral-200 text-gray-900 dark:text-neutral-200 dark:hover:bg-gray-600 hover:cursor-pointer"
                >
                  <div className="flex justify-start w-full text-gray-600">
                    <div className="p-4 pl-0">{item.icon}</div>
                    <div className="flex flex-col items-start justify-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs">{item.subtext}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col relative -left-1 -top-3">
        {comments.map((data, index: number) => (
          <CommentWithReplies
            key={index}
            user={data.user}
            comment={data.comment}
            stats={data.stats}
            replies={[data]}
          />
        ))}
      </div>
    </section>
  );
};

export default PostFooter;
