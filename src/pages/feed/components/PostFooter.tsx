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
import { CommentDBType, CommentObjectType, CommentType } from "@/types";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import CommentWithReplies from "./CommentWithReplies";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import UserTagging from "../components/UserTagging";
import { FormattedContentText } from "./modals/CreatePostModal";
import { useEffect } from "react";
import { processTextFormatting } from "@/components/truncate_text/TruncatedText";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import BlueButton from "./buttons/BlueButton";
import { extractTaggedUsers } from "./modals/CreatePostModal";
import Cookies from "js-cookie";
import { getComments } from "@/endpoints/feed";
import { setComments } from "@/slices/feed/commentsSlice";
import { setPosts } from "@/slices/feed/postsSlice";

interface SortingMenuItem {
  name: string;
  subtext: string;
  action: () => void;
  icon: React.ReactNode;
}

const token = Cookies.get("linkup_auth_token");

interface PostFooterProps {
  sortingMenu: boolean;
  setSortingMenu: React.Dispatch<React.SetStateAction<boolean>>;

  comments: CommentObjectType;
  addNewComment: (newComment: CommentDBType) => Promise<void>;

  postId: string;
  order: number;
}

const PostFooter: React.FC<PostFooterProps> = ({
  sortingMenu,
  setSortingMenu,

  comments,
  addNewComment,
  postId,
  order,
}) => {
  // Create a ref for the horizontally scrollable container
  const [commentInput, setCommentInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<
    { name: string; id: string }[]
  >([]);
  console.log("Comment for post:", comments);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch();
  const allComments = useSelector((state: RootState) => state.comments.list);
  const posts = useSelector((state: RootState) => state.posts.list);

  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTaggedUsers(extractTaggedUsers(commentInput));
    console.log(taggedUsers);
  }, [commentInput]);

  useEffect(() => {
    console.log("Cursor:", comments.nextCursor);
  }, []);

  const loadMoreComments = async () => {
    if (!comments.nextCursor || isLoadingMore || !token) return;

    setIsLoadingMore(true);
    try {
      const payload = {
        cursor: comments.nextCursor,
        limit: 5,
        replyLimit: 5,
      };
      const additionalComments = await getComments(payload, postId, token);
      console.log("HERE", additionalComments);
      if (additionalComments) {
        // Update the Redux store with the new comments
        const newComments = Object.values(additionalComments.comments);
        const updatedComments: CommentType[] = [
          ...comments.comments,
          ...(newComments as CommentType[]),
        ];
        const allCommentsCopy: CommentObjectType[] = [
          {
            comments: [...updatedComments],
            nextCursor: additionalComments.nextCursor,
            count: additionalComments.count,
          },
        ];

        console.log("NEW", newComments);
        console.log("AllCopy", allCommentsCopy);
        dispatch(setComments(allCommentsCopy));
      }
    } catch (error) {
      console.error("Error loading more comments:", error);
      toast.error("Failed to load more comments. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const darkMode = useSelector((state: RootState) => state.theme.theme);

  const { data } = useSelector((state: RootState) => state.userBio);
  // Add this function to check if text contains any rich formatting
  const hasRichFormatting = (text: string): boolean => {
    const richFormatRegex =
      /(\*[^*]+\*)|(-[^-]+-)|(\~[^\~]+\~)|(@[^:]+:[A-Za-z0-9_\-]+\^)/;
    return richFormatRegex.test(text);
  };
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
    parentId: string | null = null
  ) => {
    if (!commentInput.trim() && !selectedImage) {
      toast.error("Cannot create an empty comment");
      return;
    }

    const reader = new FileReader();

    const extractedTaggedUsers = extractTaggedUsers(commentInput);

    reader.onload = () => {
      const base64Image = reader.result as string;

      const newComment = {
        post_id: postId,
        content: commentInput,
        media: selectedImage ? base64Image : "",
        tagged_users: extractedTaggedUsers.map((user) => user.id),
        parent_id: parentId,
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
        media: "",
        tagged_users: extractedTaggedUsers.map((user) => user.id),
        parent_id: parentId,
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
    <section className="flex flex-col w-full gap-4 ">
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
            className="w-full relative flex-col flex dark:focus:ring-0 dark:focus:border-0 border p-2 focus:ring-black focus:ring-2 transition-colors dark:hover:bg-gray-800 hover:text-gray-950 dark:hover:text-neutral-300 rounded-xl border-gray-400 font-normal text-sm text-black text-left dark:text-neutral-300"
          >
            <div className="relative w-full">
              {/* Actual input field */}
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
                onKeyDown={(e) => {
                  // This ensures keyboard events are captured by the input
                  if (
                    ["ArrowDown", "ArrowUp", "Enter", "Tab"].includes(e.key) &&
                    commentInput.includes("@")
                  ) {
                    console.log("wo");
                    e.preventDefault(); // Prevent default for navigation keys
                  }
                }}
                className="w-full h-auto resize-none py-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 focus:ring-0 focus:border-0 active:border-0"
              />

              {/* User tagging component */}
              <UserTagging
                text={commentInput}
                onTextChange={setCommentInput}
                inputRef={inputRef}
                className="absolute inset-0 z-20" // Remove pointer-events-none
              />
            </div>

            {/* Rich text preview - only show if there's rich formatting */}
            {hasRichFormatting(commentInput) &&
              commentInput.trim().length > 0 && (
                <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Preview:
                  </p>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <FormattedContentText text={commentInput} />
                  </div>
                </div>
              )}

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
                  className="absolute top-1 left-0 bg-gray-600 text-white rounded-full m-1 p-1 px-2 aspect-square hover:bg-gray-600"
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
                    <PopoverTrigger asChild onClick={() => {}}>
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
          <div className="flex flex-col relative -left-1 ">
            {comments.comments.map((data, index: number) => (
              <CommentWithReplies
                key={index}
                postId={postId}
                comment={data}
                stats={stats}
                replies={data.children ? Object.values(data.children) : []}
                handleCreateComment={handleCreateComment}
                order={index}
              />
            ))}
            {comments.nextCursor !== 0 && comments.nextCursor !== null && (
              <div className="flex justify-center mt-2 mb-4">
                <button
                  onClick={loadMoreComments}
                  disabled={isLoadingMore}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-2 py-2 px-4 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isLoadingMore ? (
                    <>
                      <span>Loading...</span>
                    </>
                  ) : (
                    "Load more comments..."
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default PostFooter;

export const hasRichFormatting = (text: string): boolean => {
  const richFormatRegex =
    /(\*[^*]+\*)|(-[^-]+-)|(\~[^\~]+\~)|(@[^:]+:[A-Za-z0-9_\-]+\^)/;
  return richFormatRegex.test(text);
};
