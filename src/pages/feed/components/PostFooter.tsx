import React, { useRef, useState, memo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaChevronDown, FaRocket, FaClock } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components";
import { Link } from "react-router-dom";
import { CommentObjectType, CommentType, PostUserType } from "@/types";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import CommentWithReplies from "./CommentWithReplies";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import BlueButton from "./buttons/BlueButton";
import Cookies from "js-cookie";

interface SortingMenuItem {
  name: string;
  subtext: string;
  action: () => void;
  icon: React.ReactNode;
}

const userId = Cookies.get("linkup_user_id");

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
  user: PostUserType;
  sortingMenu: boolean;
  setSortingMenu: React.Dispatch<React.SetStateAction<boolean>>;
  sortingState: string;
  handleSortingState: (selectedState: string) => void;
  comments: CommentObjectType;
  addNewComment: React.Dispatch<React.SetStateAction<any>>;
  postId: string;
}

const PostFooter: React.FC<PostFooterProps> = ({
  user,
  sortingMenu,
  setSortingMenu,
  sortingState,
  handleSortingState,
  comments,
  addNewComment,
  postId,
}) => {
  // Create a ref for the horizontally scrollable container
  console.log("This is real", postId);
  const [commentInput, setCommentInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  console.log("Comment for post:", comments);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const darkMode = useSelector((state: RootState) => state.theme.theme);

  const { data } = useSelector((state: RootState) => state.userBio);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(selectedImage);
      setSelectedImage(file);
    }
  };

  const handleCreateComment = (
    selectedImage: File | null,
    commentInput: string,
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>,
    setCommentInput: React.Dispatch<React.SetStateAction<string>>,
    parentId?: string | null
  ) => {
    if (!commentInput.trim() && !selectedImage) {
      toast.error("Cannot create an empty comment");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;

      const newComment = {
        post_id: postId,
        content: commentInput,
        media: selectedImage ? [base64Image] : [],
        tagged_users: [],
        comment_id: parentId,
      };

      console.log("New comment created:", newComment);

      // Reset input and selected image
      setCommentInput("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }

      // Add the new comment
      addNewComment(newComment);
    };

    if (selectedImage) {
      reader.readAsDataURL(selectedImage); // Convert the image to Base64
    } else {
      const newComment = {
        post_id: postId,
        content: commentInput,
        media: [],
        tagged_users: [],
        comment_id: parentId,
      };

      console.log("New comment created:", newComment);

      // Reset input and selected image
      setCommentInput("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }

      // Add the new comment
      addNewComment(newComment);
    }
  };

  const stats = {
    likes: 15,
    love: 2,
    support: 1,
    celebrate: 1,
    comments: comments.count,
    reposts: 5,
    person: "Hamada",
  };

  const MemoizedEmojiPicker = memo(EmojiPicker);
  console.log("Footer comments", comments);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleEmojiRequest = (emoji: EmojiClickData) => {
    setCommentInput((prevMessage) => prevMessage + emoji.emoji);
  };

  return (
    <section className="flex flex-col w-full gap-4">
      {/* Container for text buttons with relative so our scroll button can be absolute */}
      <Carousel className="w-full">
        <CarouselContent className="px-2 ">
          {[
            "I appreciate this!",
            "Congratulations!",
            "Useful takeaway",
            "Great insight!",
            "I appreciate this!",
            "Congratulations!",
            "Useful takeaway",
            "Great insight!",
          ].map((text, index) => (
            <CarouselItem
              key={index}
              className=" basis-1/2 sm:basis-1/3 lg:basis-1/4 px-6"
            >
              <div className="">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCommentInput(text);
                    inputRef.current?.focus();
                  }}
                  className="bg-transparent text-xs sm:text-sm w-fit px-1.5 light:border-gray-600 light:hover:border-2 dark:hover:text-neutral-200 dark:hover:bg-transparent hover:cursor-pointer dark:text-blue-300 dark:border-blue-300 rounded-full"
                >
                  {text}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="dark:bg-gray-900 dark:text-neutral-400 absolute -left-5" />
        <CarouselNext className="dark:bg-gray-900 dark:text-neutral-400 absolute -right-8" />
      </Carousel>

      <div className="flex w-full items-center justify-between h-full">
        <div className="flex space-x-3 justify-start items-center w-full h-full">
          <Link to={"#"}>
            <Avatar className="h-8 w-8 pl-0">
              <AvatarImage src={data?.profile_photo} alt="Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>

          <div
            onClick={() => {
              inputRef.current?.focus();
            }}
            className="w-full relative flex-col flex dark:focus:ring-0 dark:focus:border-0 border p-2 focus:ring-black focus:ring-2 transition-colors dark:hover:bg-gray-800 hover:text-gray-950 dark:hover:text-neutral-300 rounded-xl border-gray-400 font-normal text-sm text-black  text-left dark:text-neutral-300"
          >
            <textarea
              ref={inputRef}
              id="comment-input"
              placeholder="Add a comment..."
              value={commentInput}
              autoFocus
              onFocus={() => {
                inputRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full h- resize-none py-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 focus:ring-0 focus:border-0 active:border-0"
            />
            {selectedImage && (
              <div className="relative mt-2">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // Reset the file input value
                    }
                  }}
                  className="absolute top-1 left-0 bg-gray-600 text-white rounded-full p-1 hover:bg-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
            {
              <div
                className={`flex  ${
                  selectedImage || commentInput.trim().length != 0
                    ? "justify-between "
                    : "absolute right-0 "
                }`}
              >
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild onClick={() => console.log("hi")}>
                      <Button
                        variant="ghost"
                        className="hover:cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-neutral-200"
                      >
                        <MdOutlineEmojiEmotions />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      forceMount
                      className="dark:bg-gray-900 w-fit p-0 dark:border-gray-600"
                    >
                      <MemoizedEmojiPicker
                        className="dark:bg-gray-900 w-full p-0"
                        theme={darkMode === "dark" ? Theme.DARK : Theme.LIGHT}
                        width={"full"}
                        onEmojiClick={handleEmojiRequest}
                      />
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
                    className="hover:cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-neutral-200"
                  >
                    <MediaIcon />
                  </Button>
                </div>
                <BlueButton
                  className={`${
                    selectedImage || commentInput.trim().length != 0
                      ? ""
                      : "hidden"
                  }`}
                  onClick={() =>
                    handleCreateComment(
                      selectedImage,
                      commentInput,
                      setSelectedImage,
                      setCommentInput,
                      null
                    )
                  }
                  disabled={commentInput.trim().length == 0 && !selectedImage}
                >
                  Comment
                </BlueButton>
              </div>
            }
          </div>
        </div>
      </div>
      {comments.count != 0 && (
        <>
          <div className="flex relative -left-5">
            <Popover open={sortingMenu} onOpenChange={setSortingMenu}>
              <PopoverTrigger
                asChild
                className="rounded-full z-10 dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200 h-8 gap-1.5 px-3"
              >
                <div className="flex items-center gap-1 text-gray-500 text-sm font-medium ">
                  <p>{sortingState}</p>
                  <FaChevronDown />
                </div>
              </PopoverTrigger>
              <PopoverContent className="relative  dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                <div className="flex flex-col w-full p-0">
                  {COMMENT_SORTING_MENU.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        handleSortingState(item.name);
                        setSortingMenu(false);
                        item.action();
                      }}
                      className="flex justify-start items-center rounded-none bg-transparent w-full h-16 pt-4 py-4 hover:bg-neutral-200 text-gray-900  dark:hover:bg-gray-600 dark:hover:text-white hover:cursor-pointer"
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
          </div>
          <div className="flex flex-col relative -left-1 -top-3">
            {comments.comments.map((data, index: number) => (
              <CommentWithReplies
                key={index}
                postId={postId}
                comment={data}
                stats={stats}
                replies={data.children}
                handleCreateComment={handleCreateComment}
                commentId={data._id}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PostFooter;
