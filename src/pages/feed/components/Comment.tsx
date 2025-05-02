import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaEllipsisHSolid as EllipsisIcon } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import FunnyIcon from "@/assets/Funny.svg";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import { AiOutlineLike as LikeEmoji } from "react-icons/ai";
import LoveIcon from "@/assets/Love.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import TruncatedText from "@/components/truncate_text/TruncatedText";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import {
  removeComment,
  removeReply,
  updateCommentReaction,
} from "@/slices/feed/postsSlice";

import {
  getCommentActions,
  getPrivateCommentActions,
} from "../components/Menus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ReportModal from "./modals/ReportModal";
import ReactionsModal from "./modals/ReactionsModal";
import {
  createReaction,
  deleteComment,
  deleteReaction,
} from "@/endpoints/feed";
import { CommentType } from "@/types";
import moment from "moment";
import { useDispatch } from "react-redux";

import Cookies from "js-cookie";
import TransparentButton from "./buttons/TransparentButton";
import BlueButton from "./buttons/BlueButton";
import { toast } from "sonner";
import IconButton from "./buttons/IconButton";
import { getReactionIcons } from "./Post";
import { editComment } from "@/endpoints/feed";
import { updateComment } from "@/slices/feed/postsSlice";
import { FormattedContentText } from "./modals/CreatePostModal";
import { hasRichFormatting } from "@/utils";
import UserTagging from "./UserTagging";

export interface CommentProps {
  comment: CommentType;
  isReplyActive: boolean;
  setIsReplyActive: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  disableReplies: boolean;
  disableControls?: boolean;
  disableActions?: boolean;
  limitHeight?: boolean;
}

const token = Cookies.get("linkup_auth_token");

const Comment: React.FC<CommentProps> = ({
  comment,
  isReplyActive,
  setIsReplyActive,
  postId,
  disableReplies,
  disableControls = false,
  disableActions = false,
  limitHeight = false,
}) => {
  const {
    profile_picture,
    username,
    first_name,
    last_name,
    connection_degree,
    headline,
  } = comment.author;
  const dispatch = useDispatch();

  const stats = {
    comments: comment.children && comment.children.length,
    total: comment.reactions_count,
  };

  const { content, date, is_edited, media } = comment;
  const myUserId = Cookies.get("linkup_user_id");

  const [commentMenuOpen, setCommentMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState("None"); // Like, Love, etc.
  const [reactionsOpen, setReactionsOpen] = useState(false); // for Popover open state
  const [viewMore, setViewMore] = useState(false); // if you want to toggle text next to icons
  const [topStats, setTopStats] = useState(
    getReactionIcons(comment.top_reactions || [])
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(content);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    const closeButton = document.getElementById("modal-close-button");
    if (closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  };

  const handleMouseEnter = () => {
    setReactionsOpen(true);
  };

  const handleMouseLeave = () => {
    setReactionsOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        // Call both endpoints concurrently
      } catch (error) {
        console.error("Error fetching feed data", error);
      }
    };

    fetchData();
    setIsLoading(false);

    if (comment.user_reaction)
      setSelectedReaction(
        comment.user_reaction.charAt(0).toUpperCase() +
          comment.user_reaction.slice(1).toLowerCase()
      );
  }, [comment]);

  const reactionIcons = [
    { name: "Celebrate", icon: CelebrateIcon },
    { name: "Like", icon: LikeIcon },
    { name: "Love", icon: LoveIcon },
    { name: "Funny", icon: FunnyIcon },
    { name: "Insightful", icon: InsightfulIcon },
    { name: "Support", icon: SupportIcon },
  ];

  const navigate = useNavigate();

  const copyLink = () => {};
  const deleteCommentModal = () => {
    setDeleteModal(true);
  };
  const reportComment = () => {};
  const hideComment = () => {};

  const handleReact = (value: string) => {
    setSelectedReaction(value);

    if (value != "None") {
      handleCreateReaction(value);
    } else {
      handleDeleteReaction(value);
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
    setEditInput(content);
    setCommentMenuOpen(false);
  };

  const handleEditSubmit = async () => {
    if (!token) {
      toast.error("You must be logged in to edit a comment.");
      navigate("/login", { replace: true });
      return;
    }

    const toastId = toast.loading("Updating your comment...");

    try {
      let mediaData: string | undefined = media?.link;
      if (editingImage) {
        // Convert image to base64
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(editingImage);
        });
        mediaData = base64Data;
      } else {
        mediaData = "";
      }

      const result = await editComment(
        {
          post_id: postId,
          comment_id: comment._id,
          content: editInput,
          media: mediaData,
          tagged_users: [], // Add tagged users handling if needed
        },
        token
      );

      if (result.comment.media.length != 0) {
        dispatch(
          updateComment({
            postId,
            commentId: comment._id,
            content: editInput,
            media: {
              link: result.comment.media,
              media_type: "image",
            },
            is_edited: true,
          })
        );
      } else {
        dispatch(
          updateComment({
            postId,
            commentId: comment._id,
            content: editInput,
            media: {
              link: "",
              media_type: "none",
            },
            is_edited: true,
          })
        );
      }

      setIsEditing(false);
      toast.success("Comment updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment", { id: toastId });
    }
  };

  // Replace your handleCreateReaction function with this improved version
  const handleCreateReaction = async (selected_reaction: string) => {
    if (!token) {
      toast.error("You must be logged in to add a reaction.");
      navigate("/login", { replace: true });
      return;
    }

    const reaction = {
      target_type: "Comment",
      reaction: selected_reaction.toLowerCase(),
      comment_id: comment._id,
    };

    try {
      // Show loading indicator or toast if needed
      const result = await createReaction(reaction, postId, token);
      setTopStats(getReactionIcons(result.top_reactions || []));
      dispatch(
        updateCommentReaction({
          postId: postId,
          commentId: comment._id,
          reactions: result.top_reactions,
          reactions_count: result.reactions_count,
          user_reaction: selected_reaction.toLowerCase(),
        })
      );

      // Update Redux state with the new comments
    } catch (error) {
      console.error("Error creating reaction:", error);
      toast.error("Failed to add reaction. Please try again.");
    }
  };

  // Replace your handleDeleteReaction function with this improved version
  const handleDeleteReaction = async (selected_reaction: string) => {
    if (!token) {
      toast.error("You must be logged in to remove a reaction.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const result = await deleteReaction(
        { target_type: "Comment", comment_id: comment._id },
        postId,
        token
      );
      setTopStats(getReactionIcons(result.top_reactions || []));

      dispatch(
        updateCommentReaction({
          postId: postId,
          commentId: comment._id,
          reactions: result.top_reactions,
          reactions_count: result.totalCount,
          user_reaction: selected_reaction.toLowerCase(),
        })
      );

      // Update Redux state with the new comments
    } catch (error) {
      console.error("Error deleting reaction:", error);
      toast.error("Failed to remove reaction. Please try again.");
    }
  };

  const handleDeleteComment = async () => {
    if (!token) {
      toast.error("You must be logged in to delete a comment.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Deleting your comment...");

    try {
      // Call the API to delete the post

      const result = await deleteComment(
        { comment_id: comment._id, post_id: postId },
        token
      );

      if (comment.parent_id) {
        dispatch(
          removeReply({
            postId,
            commentId: comment.parent_id, // Parent comment ID
            replyId: comment._id, // This reply's ID
          })
        );
      } else {
        dispatch(removeComment({ postId: postId, commentId: comment._id }));
      }

      // Show success toast
      toast.success("Comment deleted successfully!");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      // Update the state to remove the deleted comment
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting Comment:", error);

      // Show error toast
      toast.error("Failed to delete the Comment. Please try again.");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      setDeleteModal(false);
    }
  };

  const menuActions =
    comment.author.username === myUserId
      ? getPrivateCommentActions(
          copyLink,
          handleEditComment,
          deleteCommentModal
        )
      : getCommentActions(copyLink, reportComment, hideComment);

  const timeAgo = moment(date * 1000).fromNow();

  return (
    <div className="flex flex-col px-0">
      <header className="flex items-center space-x-3 w-full">
        <img
          src={profile_picture}
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
                {first_name + " " + last_name}
              </h2>
              {connection_degree && (
                <>
                  <p className="text-lg text-gray-500 dark:text-neutral-400 font-bold">
                    {" "}
                    ·
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    {" "}
                    {connection_degree}
                  </p>
                </>
              )}
            </Link>
            <nav className={`flex relative left-5`}>
              <div className="flex gap-x-1 items-baseline text-xs dark:text-neutral-400 text-gray-500">
                {is_edited && (
                  <>
                    <span>(edited) </span>
                  </>
                )}
                <time className="pr-2">{timeAgo}</time>
              </div>
              <Dialog
                open={deleteModal}
                onOpenChange={() => setDeleteModal(!deleteModal)}
              >
                <DialogContent className="dark:bg-gray-900 border-0 ">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">
                      Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription className="dark:text-neutral-300">
                      This action cannot be undone. This will permanently delete
                      this comment from LinkUp. <br /> <br />
                      All likes and replies on this comment will also be
                      removed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex w-full justify-end gap-4">
                    <TransparentButton
                      onClick={() => {
                        setDeleteModal(false);
                      }}
                    >
                      Back
                    </TransparentButton>
                    <BlueButton onClick={() => handleDeleteComment()}>
                      Delete
                    </BlueButton>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                {!disableActions && (
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
                )}

                <DialogContent className="dark:bg-gray-900 border-0">
                  <DialogTitle className="text-2xl dark:text-neutral-200">
                    Report this comment
                  </DialogTitle>
                  <DialogDescription />
                  <ReportModal
                    onClose={closeModal}
                    type="Comment"
                    contentId={comment._id}
                  />
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
      <div className="flex flex-col justify-start">
        {isEditing ? (
          <div className="flex w-full items-center justify-between h-full pl-11">
            <div className="w-full relative flex-col flex dark:focus:ring-0 dark:focus:border-0 border p-2 focus:ring-black focus:ring-2 transition-colors dark:hover:bg-gray-800 hover:text-gray-950 dark:hover:text-neutral-300 rounded-xl border-gray-400 font-normal text-sm text-black text-left dark:text-neutral-300">
              <div className="relative w-full">
                <textarea
                  ref={editInputRef}
                  id="edit-comment-input"
                  placeholder="Edit your comment..."
                  value={editInput}
                  autoFocus
                  onChange={(e) => setEditInput(e.target.value)}
                  className="w-full h-auto resize-none py-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 focus:ring-0 focus:border-0 active:border-0"
                />

                <UserTagging
                  text={editInput}
                  onTextChange={setEditInput}
                  inputRef={editInputRef}
                  className="absolute inset-0 z-20"
                />
              </div>

              {hasRichFormatting(editInput) && editInput.trim().length > 0 && (
                <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Preview:
                  </p>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <FormattedContentText text={editInput} />
                  </div>
                </div>
              )}

              {(editingImage || media?.link) && (
                <div className="relative mt-2">
                  <img
                    src={
                      editingImage
                        ? URL.createObjectURL(editingImage)
                        : media?.link
                    }
                    alt="Comment media"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setEditingImage(null);
                      if (editFileInputRef.current) {
                        editFileInputRef.current.value = "";
                      }
                      // Clear the media object to indicate removal of existing image
                      dispatch(
                        updateComment({
                          postId,
                          commentId: comment._id,
                          content: editInput,
                          media: {
                            link: "",
                            media_type: "none",
                          },
                          is_edited: true,
                        })
                      );
                    }}
                    className="absolute top-1 left-0 bg-gray-600 text-white rounded-full m-1 p-1 px-2 aspect-square hover:bg-gray-700 transition-colors"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex justify-between mt-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={editFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setEditingImage(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => editFileInputRef.current?.click()}
                    className="hover:cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-neutral-200"
                  >
                    <MediaIcon />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <TransparentButton onClick={() => setIsEditing(false)}>
                    Cancel
                  </TransparentButton>
                  <BlueButton
                    onClick={handleEditSubmit}
                    disabled={editInput.trim().length === 0}
                  >
                    Save
                  </BlueButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Your existing comment content display
          <div className="p-1 pl-11 text-xs md:text-sm whitespace-pre-wrap">
            <TruncatedText
              content={content}
              lineCount={3}
              id={`comment-${comment._id}`}
              className="ml-0 relative -left-5"
              limitHeight
            />
          </div>
        )}
        {media && media.link && (
          <Dialog>
            <DialogTrigger asChild>
              <img
                src={media.link}
                alt="Comment media"
                className="max-h-60 self-start object-contain rounded-lg ml-11 mt-2 cursor-pointer"
              />
            </DialogTrigger>
            <DialogTitle />
            <DialogDescription />
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-transparent">
              <img
                src={media.link}
                alt="Comment media fullscreen"
                className="w-full h-full object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {!disableControls && (
        <footer className="flex pl-10 justify-start items-center gap-0.5 ">
          {/* <div className="flex justify-start w-full items-center pt-4 gap-0"> */}
          <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
            <PopoverTrigger
              asChild
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  if (selectedReaction === "None") handleReact("Like");
                  else handleReact("None");
                }}
                className={`flex dark:hover:bg-gray-700 dark:hover:text-neutral-200 ${
                  selectedReaction === "Like"
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
                {selectedReaction != "None" ? (
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
                  <div className="flex gap-2 items-center">
                    <LikeEmoji /> Like{" "}
                  </div>
                )}
                {selectedReaction == "None"
                  ? viewMore
                    ? "Like"
                    : ""
                  : selectedReaction}
              </Button>
            </PopoverTrigger>
            <TooltipProvider>
              <PopoverContent
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                align="start"
                className="absolute w-fit bottom-10 dark:bg-gray-900 rounded-full border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out transform"
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
                    <Tooltip key={`reaction-${reaction.alt}`}>
                      <IconButton
                        className={`hover:scale-200 hover:bg-gray-200 w-12 h-12 dark:hover:bg-gray-700 duration-300 ease-in-out transform transition-all mx-0 hover:mx-7 hover:-translate-y-5`}
                        style={{
                          animation: `bounceIn 0.5s ease-in-out ${
                            index * 0.045
                          }s forwards`,
                          opacity: 0,
                        }}
                        onClick={() => {
                          handleReact(reaction.alt);

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

          {stats.total != 0 && (
            <>
              {" "}
              {stats.total > 0 ? (
                <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold">
                  {" "}
                  ·
                </p>
              ) : (
                <></>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex pr-3 relative items-end text-gray-500 dark:text-neutral-400 text-xs hover:underline hover:cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                    {topStats.map((stat, index) => (
                      <span
                        key={index}
                        className="flex items-center text-black dark:text-neutral-200 text-lg"
                      >
                        {stat}
                      </span>
                    ))}
                    {stats.total}
                  </button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700">
                  <DialogTitle className=" px-2 text-xl font-medium">
                    Reactions
                  </DialogTitle>
                  <DialogDescription />
                  <ReactionsModal postId={postId} commentId={comment._id} />
                </DialogContent>
              </Dialog>
            </>
          )}
          <p className="text-gray-500">| </p>
          {!disableReplies && (
            <>
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
            </>
          )}
          {comment.children_count ? (
            comment.children_count != 0 && (
              <>
                <p className="text-xs  text-gray-500 dark:text-neutral-400 font-bold">
                  {" "}
                  ·
                </p>
                <p className=" text-xs text-gray-500 line-clamp-1 text-ellipsis dark:text-neutral-400 ">
                  {comment.children_count &&
                  comment.children_count != 0 &&
                  comment.children_count == 1
                    ? "1 Reply"
                    : `${comment.children_count} Replies`}
                </p>
              </>
            )
          ) : (
            <></>
          )}
        </footer>
      )}
    </div>
  );
};

export default Comment;
