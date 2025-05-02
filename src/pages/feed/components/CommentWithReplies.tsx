import React, { useState, useRef, useEffect, memo } from "react";
import Comment from "./Comment";
import Reply from "./Reply";
import BlueButton from "./buttons/BlueButton";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CommentType } from "@/types";
import { hasRichFormatting } from "@/utils/index";
import { FormattedContentText } from "./modals/CreatePostModal";
import UserTagging from "./UserTagging";
import Cookies from "js-cookie";
import { getReplies } from "@/endpoints/feed";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { addRepliesToComment } from "@/slices/feed/postsSlice";
import CommentSkeleton from "./CommentSkeleton";

interface CommentWithRepliesProps {
  handleCreateComment: (
    selectedImage: File | null,
    commentInput: string,
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>,
    setCommentInput: React.Dispatch<React.SetStateAction<string>>,
    commentId: string
  ) => void;
  comment: CommentType | undefined;
  postId: string;
  disableReplies: boolean;
  disableControls?: boolean;
  disableActions?: boolean;
  limitHeight?: boolean;
}

const user_token = Cookies.get("linkup_auth_token");

const CommentWithReplies: React.FC<CommentWithRepliesProps> = ({
  handleCreateComment,
  comment,
  postId,
  disableReplies,
  disableControls = false,
  disableActions = false,
  limitHeight = false,
}) => {
  if (!comment) {
    return <CommentSkeleton />;
  }
  const replies = comment.children || [];
  const hasMoreReplies = replies.length < (comment.children_count || 0);
  // State hooks
  const [showReplies, setShowReplies] = useState(true);
  const [mainCommentHeight, setMainCommentHeight] = useState(0);
  const [replyHeights, setReplyHeights] = useState(0);
  const [isReplyActive, setIsReplyActive] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [nextCursor, setNextCursor] = useState(0);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const replyRefs = useRef<Array<HTMLDivElement | null>>([]);

  const navigate = useNavigate();

  // Selectors
  const darkMode = useSelector((state: RootState) => state.theme.theme);
  const { data } = useSelector((state: RootState) => state.userBio);
  const dispatch = useDispatch();

  // Get comments from the comment.children property if replies not provided
  const commentReplies = replies || comment.children || [];

  // Effects
  useEffect(() => {
    setIsReplyActive(false);
  }, [comment]);

  useEffect(() => {
    if (isReplyActive) {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isReplyActive]);

  // Measure comment heights for UI
  useEffect(() => {
    if (commentRef.current) {
      setMainCommentHeight(commentRef.current.offsetHeight / 16);
    }
  }, [comment]);

  useEffect(() => {
    if (commentReplies && replyRefs.current.length > 0) {
      const total = replyRefs.current.reduce((acc, ref) => {
        return ref ? acc + ref.offsetHeight / 16 : acc;
      }, 0);
      setReplyHeights(total);
    } else {
      setReplyHeights(0);
    }
  }, [commentReplies, showReplies]);

  const handleLoadMoreReplies = async () => {
    if (isLoadingReplies) return;
    if (!user_token) {
      toast.error("You must be logged in to view this feed.");
      navigate("/login", { replace: true });
      return;
    }

    setIsLoadingReplies(true);
    try {
      const response = await getReplies(
        {
          cursor: nextCursor || 2,
          limit: 5,
          replyLimit: 2,
        },
        postId,
        comment._id,
        user_token
      );
      console.log("Responseeeee:", response);

      // Update the replies in the comment
      dispatch(
        addRepliesToComment({
          postId,
          parentCommentId: comment._id,
          replies: response.replies,
          nextCursor: response.next_cursor,
        })
      );
      setNextCursor(response.next_cursor);
    } catch (error) {
      console.error("Error loading more replies:", error);
      toast.error("Failed to load more replies");
    } finally {
      setIsLoadingReplies(false);
    }
  };

  // Event handlers
  const handleEmojiRequest = (emoji: EmojiClickData) => {
    setCommentInput((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxFileSizeInMB = 10;
    const maxFileSize = maxFileSizeInMB * 1048576; // 10 MB

    if (file) {
      if (file.size > maxFileSize) {
        toast.error(
          `File "${file.name}" exceeds the maximum size of ${maxFileSizeInMB} MB.`
        );
        return false;
      }
    }
    if (file) {
      setSelectedImage(file);
    }
  };

  const MemoizedEmojiPicker = memo(EmojiPicker);

  return (
    <div className="flex flex-col relative">
      {/* Border element whose height is adjusted based on the main comment and replies */}
      <div
        className="border-b-2 border-l-2 dark:border-gray-700 rounded-lg absolute w-10 left-4"
        style={{
          height: (mainCommentHeight + replyHeights) * 16 - 90,
        }}
      ></div>

      {/* Main comment container with ref */}
      <div ref={commentRef}>
        <Comment
          comment={comment}
          setIsReplyActive={setIsReplyActive}
          postId={postId}
          disableReplies={disableReplies}
          disableControls={disableControls}
          disableActions={disableActions}
          limitHeight={limitHeight}
        />
      </div>

      {/* Replies toggle and list */}
      {commentReplies && commentReplies.length > 0 && (
        <>
          {commentReplies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-blue-600 dark:text-blue-300 hover:underline mt-2 ml-14"
            >
              {showReplies
                ? "Hide Replies"
                : `Show Replies (${commentReplies.length})`}
            </button>
          )}

          {showReplies && (
            <div className="mt-2 space-y-2">
              {commentReplies.map((reply, idx) => (
                <div
                  key={`reply-${reply._id || idx}`}
                  ref={(el) => {
                    replyRefs.current[idx] = el;
                  }}
                  className="relative"
                >
                  <div className="w-12 h-full rounded-full absolute bg-white dark:bg-gray-900 left-8" />
                  <Reply
                    comment={reply}
                    setIsReplyActive={setIsReplyActive}
                    postId={postId}
                    disableReplies={disableReplies}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {showReplies && commentReplies && commentReplies.length > 0 && (
        <div className="mt-2 space-y-2">
          {/* Load More Replies button */}
          {hasMoreReplies && (
            <button
              onClick={handleLoadMoreReplies}
              disabled={isLoadingReplies}
              className="text-sm text-blue-600 dark:text-blue-300 hover:underline ml-14 mb-2 flex items-center gap-2"
            >
              {isLoadingReplies ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  Loading replies...
                </>
              ) : (
                `Show more replies `
              )}
            </button>
          )}
        </div>
      )}
      {/* Reply input */}
      {isReplyActive ? (
        <div className="flex gap-2 pl-10 pt-2">
          <div>
            <img
              src={data?.profile_photo}
              className="w-8 h-8 rounded-full"
              alt="User avatar"
            />
          </div>
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
                placeholder="Add a reply..."
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
                  if (
                    ["ArrowDown", "ArrowUp", "Enter", "Tab"].includes(e.key) &&
                    commentInput.includes("@")
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-full h-auto resize-none py-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 focus:ring-0 focus:border-0 active:border-0"
              />

              {/* User tagging component */}
              <UserTagging
                text={commentInput}
                onTextChange={setCommentInput}
                inputRef={inputRef}
                className="absolute inset-0 z-20"
              />
            </div>

            {/* Rich text preview */}
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

            {/* Selected image preview */}
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
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute top-1 left-0 bg-gray-600 text-white rounded-full m-1 p-1 px-2 aspect-square hover:bg-gray-600"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Comment input actions */}
            <div
              className={`flex ${
                selectedImage || commentInput.trim().length !== 0
                  ? "justify-between"
                  : "absolute right-0"
              }`}
            >
              <div className="relative">
                {/* Emoji picker */}
                <Popover>
                  <PopoverTrigger asChild>
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

                {/* Media upload */}
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

              {/* Submit button */}
              <BlueButton
                className={`${
                  selectedImage || commentInput.trim().length !== 0
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
                disabled={commentInput.trim().length === 0 && !selectedImage}
              >
                Reply
              </BlueButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CommentWithReplies;
