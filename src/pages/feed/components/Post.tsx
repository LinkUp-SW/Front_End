import React, { JSX, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import LoveIcon from "@/assets/Love.svg";
import FunnyIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  CommentDBType,
  CommentObjectType,
  CommentType,
  PostType,
  PostUserType,
  ReactionType,
} from "@/types";
import { POST_ACTIONS } from "@/constants";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import {
  getEngagementButtons,
  getMenuActions,
  getPersonalMenuActions,
  REPOST_MENU,
} from "../components/Menus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TruncatedText,
} from "@/components";
import ReactionsModal from "./modals/ReactionsModal";
import PostImages from "./PostImages";
import IconButton from "./buttons/IconButton";
import Cookies from "js-cookie";
import {
  createComment,
  createReaction,
  deletePost,
  deleteReaction,
  savePost,
  unsavePost,
} from "@/endpoints/feed";
import { toast } from "sonner";
import TransparentButton from "./buttons/TransparentButton";
import BlueButton from "./buttons/BlueButton";
import { setPosts } from "@/slices/feed/postsSlice"; // adjust if needed
import { setComments } from "@/slices/feed/commentsSlice";
import { useDispatch } from "react-redux";

interface PostProps {
  postData: PostType;
  comments: CommentObjectType;
  viewMore: boolean; // used to hide certain elements for responsive design
  action: any; // used if the post is an action
  posts: PostType[];
  allComments: CommentObjectType[];
  order: number;
}

const userId = Cookies.get("linkup_user_id");
const token = Cookies.get("linkup_auth_token");
// console.log()

const Post: React.FC<PostProps> = ({
  postData,
  comments,
  viewMore,
  action,
  posts,
  allComments,

  order,
}) => {
  const navigate = useNavigate();
  const { author }: { author: PostUserType } = postData;
  const { date, media, reacts, taggedUsers } = postData;
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [sortingMenu, setSortingMenu] = useState(false);
  const [sortingState, setSortingState] = useState("Most relevant");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [willDelete, setWillDelete] = useState(false);
  const dispatch = useDispatch();
  const [selectedReaction, setSelectedReaction] = useState<string>("None");

  const addNewComment = async (newComment: CommentDBType) => {
    if (!token) {
      toast.error("You must be logged in to add a comment.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Adding your comment...");
    console.log("New comment:", newComment);

    try {
      // Call the API to create the comment
      const createdComment = await createComment(newComment, token);
      console.log("Created comment:", createdComment);

      if (!newComment.parent_id) {
        const updatedComments = [...allComments];
        const oldObject = { ...updatedComments[order] };
        oldObject.comments = [createdComment.comment, ...oldObject.comments];
        oldObject.count = oldObject.count + 1;
        updatedComments[order] = oldObject;
        dispatch(setComments(updatedComments));
        dispatch(
          setPosts(
            posts.map((post, index) =>
              index === order
                ? { ...post, comments: [...post.comments, createdComment._id] }
                : post
            )
          )
        );
      } else {
        const updatedComments = allComments.map((block) => ({
          ...block,
          comments: block.comments.map((comment) => {
            if (comment._id === newComment.parent_id) {
              return {
                ...comment,
                children: {
                  ...(comment.children || {}),
                  [createdComment.comment._id]: createdComment.comment,
                },
              };
            }
            return comment;
          }),
        }));

        dispatch(setComments(updatedComments));
        dispatch(
          setPosts(
            posts.map((post, index) =>
              index === order
                ? { ...post, comments: [...post.comments, createdComment._id] }
                : post
            )
          )
        );
      }

      // Update the toast to success
      if (newComment.parent_id) {
        toast.success("Reply added successfully!");
      } else {
        toast.success("Comment added successfully!");
      }
      toast.dismiss(loadingToastId); // Dismiss the loading toast
    } catch (error) {
      console.error("Error creating comment:", error);

      // Update the toast to error
      toast.error("Failed to add comment. Please try again.");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
    }
  };

  const reactionIcons = [
    { name: "Celebrate", icon: CelebrateIcon },
    { name: "Like", icon: LikeIcon },
    { name: "Love", icon: LoveIcon },
    { name: "Funny", icon: FunnyIcon },
    { name: "Insightful", icon: InsightfulIcon },
    { name: "Support", icon: SupportIcon },
  ];

  let timeoutId: NodeJS.Timeout;

  const handleToggleComments = () => {
    if (!commentsOpen) {
      setCommentsOpen(true);
    } else {
      const commentInput = document.getElementById(
        "comment-input"
      ) as HTMLInputElement;
      if (commentInput) {
        commentInput.focus();
      }
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setReactionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setReactionsOpen(false);
    }, 300);
  };

  const handleSortingState = (selectedState: string) => {
    setSortingState(selectedState);
  };

  useEffect(() => {
    if (
      media &&
      (media.media_type === "image" || media.media_type === "images")
    ) {
      const img = new Image();
      img.src = media.link[0];
      img.onload = () => {
        setIsLandscape(img.width > img.height); // Check if the image is landscape
      };
    }
  }, [media]);

  const handleReact = (value: string) => {
    console.log(value);
    console.log("Liked");
    setSelectedReaction(value);

    if (value != "None") {
      handleCreateReaction(value);
    } else {
      handleDeleteReaction();
    }
  };

  const handleCopyLinkButton = () => {};
  const handleEditPostButton = () => {};
  const deleteModal = () => {
    setWillDelete(true);
  };
  const blockPost = () => {};
  const reportPost = () => {};
  const unfollow = () => {};

  const handleDeletePost = async () => {
    if (!token) {
      toast.error("You must be logged in to delete a post.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Deleting your post...");

    try {
      // Call the API to delete the post
      setWillDelete(false);
      await deletePost(postData._id, token);

      // Show success toast
      toast.success("Post deleted successfully!");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      dispatch(setPosts(posts.filter((post) => post._id !== postData._id)));
      dispatch(
        setComments(
          allComments.filter((_, index) => index !== order) // remove the one at "order"
        )
      );
    } catch (error) {
      console.error("Error deleting post:", error);

      // Show error toast
      toast.error("Failed to delete the post. Please try again.");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      setWillDelete(false);
    }
  };

  const handleCreateReaction = async (selected_reaction: string) => {
    if (!token) {
      toast.error("You must be logged in to add a comment.");
      navigate("/login", { replace: true });
      return;
    }
    const reaction = {
      target_type: "Post",
      reaction: selected_reaction.toLowerCase(),
    };
    try {
      const result = await createReaction(reaction, postData._id, token);
      dispatch(
        setPosts(
          posts.map((post, index) =>
            index === order
              ? {
                  ...post,
                  reacts: [...post.reacts, result.reaction.reaction._id],
                }
              : post
          )
        )
      );
      console.log("New posts", posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveButton = async () => {
    if (!token) {
      toast.error("You must be logged in to save or unsave a post.");
      navigate("/login", { replace: true });
      return;
    }

    setIsSaved((prevState) => !prevState);

    try {
      const loading = toast.loading(
        isSaved ? "Unsaving post..." : "Saving post..."
      );
      await (isSaved
        ? unsavePost(postData._id, token)
        : savePost(postData._id, token));

      toast.success(
        isSaved ? (
          "Post unsaved."
        ) : (
          <span>
            Post saved.{" "}
            <span
              onClick={() =>
                navigate("/my-items/saved-posts/", { replace: true })
              }
              style={{
                color: "blue",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              View post
            </span>
          </span>
        )
      );
      toast.dismiss(loading);
    } catch (error) {
      console.error(`Error ${isSaved ? "unsaving" : "saving"} post:`, error);
      toast.error(
        `Failed to ${isSaved ? "unsave" : "save"} the post. Please try again.`
      );
    }
  };

  const handleDeleteReaction = async () => {
    console.log("Deleting reaction", selectedReaction);
    if (!token) {
      toast.error("You must be logged in to add a comment.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const result = await deleteReaction(
        { target_type: "Post" },
        postData._id,
        token
      );
      console.log(result);
      dispatch(
        setPosts(
          posts.map((post) =>
            post.reacts.includes(result.reaction._id)
              ? {
                  ...post,

                  reacts: post.reacts.filter((r) => r !== result.reaction._id),
                }
              : post
          )
        )
      );
      console.log("New posts", posts);
    } catch (error) {
      console.log(error);
    }
  };

  const menuActions =
    userId === author.username
      ? getPersonalMenuActions(
          handleSaveButton,
          handleCopyLinkButton,
          handleEditPostButton,
          deleteModal,
          isSaved
        )
      : getMenuActions(
          handleSaveButton,
          handleCopyLinkButton,
          blockPost,
          reportPost,
          unfollow,
          isSaved
        );

  const engagementButtons = getEngagementButtons(
    selectedReaction,
    () => {
      handleReact("Like");
    },
    () => handleToggleComments()
  );

  useEffect(() => {
    if (postData.isSaved) setIsSaved(postData.isSaved);
  }, [postData.isSaved]);

  const stats = {
    likes: 15,
    love: 2,
    support: 1,
    celebrate: 1,
    comments: postData.comments.length,
    reposts: 5,
    total: postData.reacts ? postData.reacts.length : 0,
  };

  const { topStats, totalStats } = calculateTopStats(stats);

  return (
    <Card className="p-2 bg-white border-0 mb-4 pl-0 dark:bg-gray-900 dark:text-neutral-200">
      <CardContent className="flex flex-col items-start pl-0 w-full">
        {action && (
          <header className="flex pl-4 justify-start items-center w-full border-b gap-2 pb-2 dark:border-neutral-700">
            <img
              src={action.profileImage}
              alt={action.name}
              className="w-7 h-7 rounded-full"
            />

            <span className="text-gray-500 text-xs dark:text-neutral-400">
              <Link
                to="#"
                className="text-xs font-medium text-black dark:text-neutral-200 hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                {action.name}
              </Link>{" "}
              {POST_ACTIONS[action?.action || "error"]}
            </span>
          </header>
        )}
        <PostHeader
          user={author}
          action={action}
          postMenuOpen={postMenuOpen}
          setPostMenuOpen={setPostMenuOpen}
          menuActions={menuActions}
          edited={postData.isEdited}
          publicPost={postData.publicPost}
          date={date}
        />
        <TruncatedText
          id="post-content"
          content={postData.content}
          lineCount={3}
        />

        {/* Post Image(s) */}
        {(media && media.media_type === "image") ||
          (media.media_type === "images" && (
            <PostImages images={media.link || []} isLandscape={isLandscape} />
          ))}

        {media && media.media_type === "video" && (
          <div className="flex w-[100%] relative left-4 self-center justify-end">
            <video className="w-full pt-4" controls src={media.link[0]}></video>
          </div>
        )}
        {media && media.media_type === "pdf" && (
          <div className="h-[37rem] self-center w-full max-w-[34rem] relative left-4.5 pt-4">
            <div className="App">
              <div className="header">React sample</div>
            </div>
          </div>
        )}
        <Dialog
          open={willDelete}
          onOpenChange={() => setWillDelete(!willDelete)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this
                post from LinkUp.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full justify-end gap-4">
              <TransparentButton
                onClick={() => {
                  setWillDelete(false);
                }}
              >
                Back
              </TransparentButton>
              <BlueButton onClick={() => handleDeletePost()}>Delete</BlueButton>
            </div>
          </DialogContent>
        </Dialog>

        <footer className="flex justify-between w-full items-center pt-4 pl-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex relative text-gray-500 dark:text-neutral-400 text-sm hover:underline hover:cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                {topStats.map((stat, index) => (
                  <span
                    key={`topstats-${index}`}
                    className="flex items-center text-black dark:text-neutral-200 text-lg"
                  >
                    {stat.icon}
                  </span>
                ))}
                {
                  /* {stats.person
                  ? stats.person + " and " + (totalStats - 1) + " others"
                  : totalStats} */ totalStats
                }
              </button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700">
              <DialogTitle className=" px-2 text-xl font-medium">
                Reactions
              </DialogTitle>
              <DialogDescription />

              <ReactionsModal postId={postData._id} />
            </DialogContent>
          </Dialog>
          <div className="flex text-gray-500 dark:text-neutral-400 gap-2 text-sm items-center ">
            {stats.comments != 0 && (
              <p
                onClick={() => {
                  setCommentsOpen(true);
                }}
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer"
              >
                {stats.comments} comments
              </p>
            )}
            {stats.reposts && (
              <>
                <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold">
                  {" "}
                  ·
                </p>

                <p className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer">
                  {stats.reposts} reposts
                </p>
              </>
            )}
          </div>
        </footer>
        {/* Engagement Buttons */}
        <footer className="mt-3 flex justify-around text-gray-600 dark:text-neutral-400 text-sm w-full">
          <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
            {engagementButtons.map(
              (
                button: {
                  name: string;
                  icon: JSX.Element;
                  callback: () => void;
                },
                index: number
              ) => {
                const key = `engagement-${button.name}-${index}`;
                return (
                  <React.Fragment key={key}>
                    {button.name === "Like" ? (
                      <PopoverTrigger
                        asChild
                        key={`like-${index}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => {
                            selectedReaction === "None"
                              ? handleReact("Like")
                              : handleReact("None");
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
                                  (reaction) =>
                                    reaction.name === selectedReaction
                                )?.icon
                              }
                              alt={selectedReaction}
                              className="w-4 h-4"
                            />
                          ) : (
                            button.icon
                          )}
                          {selectedReaction == "None"
                            ? viewMore
                              ? "Like"
                              : ""
                            : selectedReaction}
                        </Button>
                      </PopoverTrigger>
                    ) : button.name === "Repost" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            key={`repost-${index}`}
                            variant="ghost"
                            size="lg"
                            onClick={button.callback}
                            className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                          >
                            {button.icon}
                            {viewMore && button.name}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="relative  dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                          <div className="flex flex-col w-full p-2 gap-4">
                            {REPOST_MENU.map((item, index) => (
                              <Button
                                key={`repost-button-${index}`}
                                variant="ghost"
                                size="lg"
                                onClick={button.callback}
                                className={`flex w-fit h-fit dark:hover:bg-zinc-800 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                              >
                                <div className="flex justify-start w-full  text-gray-600 dark:text-neutral-200">
                                  <div className="p-4 pl-0 ">{item.icon}</div>
                                  <div className="flex flex-col items-start justify-center">
                                    <span className="font-medium">
                                      {item.name}
                                    </span>
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
                    ) : (
                      <Button
                        key={`engagement-${index}`}
                        variant="ghost"
                        size="lg"
                        onClick={button.callback}
                        className={`flex dark:hover:bg-zinc-800 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                      >
                        {button.icon}
                        {viewMore && button.name}
                      </Button>
                    )}
                  </React.Fragment>
                );
              }
            )}
            <TooltipProvider>
              <PopoverContent
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                align="start"
                className="absolute w-fit bottom-15 dark:bg-gray-900 rounded-full border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out transform"
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
        </footer>
      </CardContent>
      <CardFooter>
        {commentsOpen && (
          <PostFooter
            user={author}
            sortingMenu={sortingMenu}
            setSortingMenu={setSortingMenu}
            sortingState={sortingState}
            handleSortingState={handleSortingState}
            postId={postData._id}
            addNewComment={addNewComment}
            comments={comments}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default Post;

function calculateTopStats(stats: {
  likes?: number;
  comments?: number;
  celebrate?: number;
  love?: number;
  insightful?: number;
  support?: number;
  funny?: number;
  person?: string;
  total: number;
}) {
  const statsArray = [
    {
      name: "celebrate",
      count: stats.celebrate,
      icon: <img src={CelebrateIcon} alt="Celebrate" className="w-4 h-4" />,
    },
    {
      name: "love",
      count: stats.love,
      icon: <img src={LoveIcon} alt="Love" className="w-4 h-4" />,
    },
    {
      name: "insightful",
      count: stats.insightful,
      icon: <img src={InsightfulIcon} alt="Insightful" className="w-4 h-4" />,
    },
    {
      name: "support",
      count: stats.support,
      icon: <img src={SupportIcon} alt="Support" className="w-4 h-4" />,
    },
    {
      name: "funny",
      count: stats.funny,
      icon: <img src={FunnyIcon} alt="Funny" className="w-4 h-4" />,
    },
    {
      name: "like",
      count: stats.likes,
      icon: <img src={LikeIcon} alt="Like" className="w-4 h-4" />,
    },
  ];

  const topStats = statsArray
    .filter((stat) => stat.count)
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 3);
  if (!topStats.length) {
    topStats.push(statsArray[5]);
  }

  const totalStats = stats.total;
  return { topStats, totalStats };
}
