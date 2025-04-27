import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaEllipsisHSolid as EllipsisIcon } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import FunnyIcon from "@/assets/Funny.svg";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import { AiOutlineLike as LikeEmoji } from "react-icons/ai";
import LoveIcon from "@/assets/Love.svg";
import LaughIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import TruncatedText, {
  processTextFormatting,
} from "@/components/truncate_text/TruncatedText";

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
import ReportCommentModal from "./modals/ReportCommentModal";
import ReactionsModal from "./modals/ReactionsModal";
import {
  createReaction,
  deleteComment,
  deleteReaction,
} from "@/endpoints/feed";
import { CommentType, StatsType } from "@/types";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import TransparentButton from "./buttons/TransparentButton";
import BlueButton from "./buttons/BlueButton";
import { toast } from "sonner";
import IconButton from "./buttons/IconButton";
import { setComments } from "@/slices/feed/commentsSlice";
import { getReactionIcons } from "./Post";

export interface CommentProps {
  comment: CommentType;
  setIsReplyActive: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
}

const token = Cookies.get("linkup_auth_token");

const Comment: React.FC<CommentProps> = ({
  comment,
  setIsReplyActive,
  postId,
}) => {
  const {
    profilePicture,
    username,
    firstName,
    lastName,
    connectionDegree,
    headline,
  } = comment.author;
  const comments = useSelector((state: RootState) => state.comments.list);
  const dispatch = useDispatch();

  const stats = {
    comments: comment.children && comment.children.length,
    reposts: 5,
    total: comment.reactionsCount,
  };

  const { content, date, is_edited, media } = comment;
  const myUserId = Cookies.get("linkup_user_id");

  const sanitizedContent = DOMPurify.sanitize(content);

  const [commentMenuOpen, setCommentMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState("None"); // Like, Love, etc.
  const [reactionsOpen, setReactionsOpen] = useState(false); // for Popover open state
  const [viewMore, setViewMore] = useState(false); // if you want to toggle text next to icons

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
    console.log(isLoading, setViewMore, media);

    if (comment.userReaction)
      setSelectedReaction(
        comment.userReaction.charAt(0).toUpperCase() +
          comment.userReaction.slice(1).toLowerCase()
      );
  }, [comments]);

  let countChildren = 0;
  if (comment.children) {
    countChildren = Object.keys(comment.children).length;
  }

  const reactionIcons = [
    { name: "Celebrate", icon: CelebrateIcon },
    { name: "Like", icon: LikeIcon },
    { name: "Love", icon: LoveIcon },
    { name: "Funny", icon: FunnyIcon },
    { name: "Insightful", icon: InsightfulIcon },
    { name: "Support", icon: SupportIcon },
  ];

  const navigate = useNavigate();

  const topStats = getReactionIcons(comment.reactions || []);

  const copyLink = () => {};
  const editComment = () => {};
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
      handleDeleteReaction();
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

      // Update the comments state with the reaction result
      const updated_Comments = comments.map((block) => {
        // Create a deep copy of the comments array to avoid reference issues
        const newComments = block.comments.map((c) => {
          // Only update the comment that was reacted to
          if (c._id === comment._id) {
            return {
              ...c,
              reacts: [
                ...(c.reacts?.filter((r) => r !== result.deletedReactionId) ||
                  []),
                result.newReactionId, // Add the new reaction ID
              ].filter(Boolean), // Remove any undefined/null values
              reactions: result.topReactions,
              reactionsCount: result.totalCount,
              userReaction: selected_reaction.toLowerCase(), // Important: Update the userReaction field
            };
          }
          return c; // Return unchanged comments
        });

        return {
          ...block,
          comments: newComments,
          count: block.count, // Keep the original count, don't recalculate
        };
      });

      // Update Redux state with the new comments
      dispatch(setComments(updated_Comments));
    } catch (error) {
      console.error("Error creating reaction:", error);
      toast.error("Failed to add reaction. Please try again.");
    }
  };

  // Replace your handleDeleteReaction function with this improved version
  const handleDeleteReaction = async () => {
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

      // Update the comments state with the reaction result
      const updated_Comments = comments.map((block) => {
        // Create a deep copy of the comments array
        const newComments = block.comments.map((c) => {
          // Only update the comment that had the reaction removed
          if (c._id === comment._id) {
            return {
              ...c,
              reacts: (c.reacts || []).filter(
                (r) => r !== result.deletedReactionId
              ),
              reactions: result.topReactions,
              reactionsCount: result.totalCount,
              userReaction: null, // Clear the user's reaction
            };
          }
          return c; // Return unchanged comments
        });

        return {
          ...block,
          comments: newComments,
          count: block.count, // Keep the original count, don't recalculate
        };
      });

      // Update Redux state with the new comments
      dispatch(setComments(updated_Comments));
    } catch (error) {
      console.error("Error deleting reaction:", error);
      toast.error("Failed to remove reaction. Please try again.");
    }
  };

  const handleDeleteComment = async () => {
    if (!token) {
      toast.error("You must be logged in to delete a post.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Deleting your post...");

    try {
      // Call the API to delete the post

      const result = await deleteComment(
        { comment_id: comment._id, post_id: postId },
        token
      );
      console.log("Deleted:", result);
      const updated_Comments = comments.map((block) => {
        const newComments = block.comments.filter((c) => c._id !== comment._id);
        return {
          ...block,
          comments: newComments,
          count: newComments.length, // 👈 update count
        };
      });
      console.log("Updated comments:", updated_Comments);
      dispatch(setComments(updated_Comments));
      console.log("Comment:", comment);
      if (comment.parentId) {
        const updatedComments = comments.map((block) => ({
          ...block,
          comments: block.comments.map((parentComment) => {
            if (
              parentComment.children &&
              Object.prototype.hasOwnProperty.call(
                parentComment.children,
                comment._id
              )
            ) {
              const { ...remainingChildren } = parentComment.children;
              delete remainingChildren[comment._id];

              return {
                ...parentComment,
                children: remainingChildren,
              };
            }

            return parentComment;
          }),
        }));
        dispatch(setComments(updatedComments));
      }

      // Show success toast
      toast.success("Comment deleted successfully!");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
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
      ? getPrivateCommentActions(copyLink, editComment, deleteCommentModal)
      : getCommentActions(copyLink, reportComment, hideComment);

  const timeAgo = moment(date).fromNow();

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
      <div className="p-1 pl-11 text-xs md:text-sm whitespace-pre-wrap">
        <TruncatedText
          content={content}
          lineCount={3}
          id={`comment-${comment._id}`}
          className="  ml-0 relative -left-5"
        />
      </div>
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
              className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 ${
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
                      className={`hover:scale-200 hover:bg-gray-200 w-12 h-12 dark:hover:bg-zinc-800 duration-300 ease-in-out transform transition-all mx-0 hover:mx-7 hover:-translate-y-5`}
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

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 text-xs hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-400 p-1"
          onClick={() => {
            setIsReplyActive(true);
          }}
        >
          | Reply
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
