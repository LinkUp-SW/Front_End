import React, { useState, useRef, useEffect, memo } from "react";
import Comment, { CommentProps } from "./Comment";
import Reply from "./Reply";
import BlueButton from "./buttons/BlueButton";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { CommentType } from "@/types";

interface CommentWithRepliesProps {
  replies: CommentType[];
  handleCreateComment: (
    selectedImage: File | null,
    commentInput: string,
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>,
    setCommentInput: React.Dispatch<React.SetStateAction<string>>,
    commentId: string
  ) => void;
  commentId: string;
  comment: CommentType;
  postId: string;
  stats: any;
}

const CommentWithReplies: React.FC<CommentWithRepliesProps> = ({
  replies,
  handleCreateComment,
  commentId,
  comment,
  postId,
  stats,
}) => {
  const [showReplies] = useState(true);
  const [mainCommentHeight, setMainCommentHeight] = useState(0);
  const [replyHeights, setReplyHeights] = useState(0);
  const [isReplyActive, setIsReplyActive] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    setIsReplyActive(false);
  }, [comment]);

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
  if (replies) {
    replies = Object.values(replies);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data } = useSelector((state: RootState) => state.userBio);

  const commentRef = useRef<HTMLDivElement>(null);

  const MemoizedEmojiPicker = memo(EmojiPicker);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Create a ref array for replies
  const replyRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleEmojiRequest = (emoji: EmojiClickData) => {
    setCommentInput((prevMessage) => prevMessage + emoji.emoji);
  };

  const darkMode = useSelector((state: RootState) => state.theme.theme);

  // Measure main comment height

  useEffect(() => {
    if (commentRef.current) {
      // Divide by 16 if you want rem conversion
      setMainCommentHeight(commentRef.current.offsetHeight / 16);
    }
  }, [comment]);

  // Measure replies heights and sum them
  useEffect(() => {
    if (replies && replyRefs.current.length > 0) {
      const total = replyRefs.current.reduce((acc, ref) => {
        return ref ? acc + ref.offsetHeight / 16 : acc;
      }, 0);
      setReplyHeights(total);
    } else {
      setReplyHeights(0);
    }
  }, [replies, showReplies]);

  return (
    <div className="flex flex-col relative">
      {/* Border element whose height is adjusted based on the main comment and replies */}
      <div
        className="border-b-2 border-l-2 dark:border-gray-700 rounded-lg absolute w-10 left-4"
        style={{
          height: (mainCommentHeight + replyHeights) * 16 - 90, // converting back to px if needed
        }}
      ></div>

      {/* Main comment container with ref */}
      <div ref={commentRef}>
        <Comment
          comment={comment}
          setIsReplyActive={setIsReplyActive}
          stats={stats}
          postId={postId}
        />
      </div>

      {/* Replies toggle and list */}
      {replies && replies.length > 0 && (
        <>
          {/* {replies.length > 1 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              {showReplies
                ? "Hide Replies"
                : `Show Replies (${replies.length})`}
            </button>
          )} */}

          {showReplies && (
            <div className="mt-2 space-y-2">
              {replies.map((reply: CommentType, idx: number) => (
                <div
                  key={idx}
                  ref={(el) => {
                    replyRefs.current[idx] = el;
                  }}
                  className="relative"
                >
                  {/* You can adjust or add your border for each reply if needed */}
                  <div className="w-12 h-full rounded-full absolute bg-white dark:bg-gray-900 left-8" />
                  <Reply
                    comment={reply}
                    stats={stats}
                    setIsReplyActive={setIsReplyActive}
                    postId={postId}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isReplyActive ? (
        <div className="flex gap-2 pl-10 pt-2">
          <div>
            <img
              src={data?.profile_photo}
              className="w-8 h-8 rounded-full"
            ></img>
          </div>
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
                    : "absolute right-0"
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
                      comment._id
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default CommentWithReplies;
