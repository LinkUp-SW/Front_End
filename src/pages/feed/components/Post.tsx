import React, { JSX, useEffect, useState } from "react";
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
  ActivityContextType,
  CommentDBType,
  CommentType,
  MediaType,
  PostDBObject,
  PostType,
  PostUserType,
} from "@/types";
import { POST_ACTIONS } from "@/constants";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import {
  getEngagementButtons,
  getMenuActions,
  getPersonalMenuActions,
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
  fetchSinglePost,
  loadPostComments,
  repostInstant,
  savePost,
  unsavePost,
} from "@/endpoints/feed";
import { toast } from "sonner";
import TransparentButton from "./buttons/TransparentButton";
import BlueButton from "./buttons/BlueButton";
import {
  setPosts,
  updatePost,
  addNewCommentToPost,
  addCommentsToPost,
  unshiftPosts,
} from "@/slices/feed/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import DocumentPreview from "./modals/DocumentPreview";
import LinkPreview from "./LinkPreview";
import PostSkeleton from "./PostSkeleton";
import CommentSkeleton from "./CommentSkeleton";
import { RootState } from "@/store";
import { FaCommentSlash } from "react-icons/fa";
import CommentWithReplies from "./CommentWithReplies";
import {
  openEditCompanyPostDialog,
  openEditPostDialog,
} from "@/slices/feed/createPostSlice";
import { EditIcon } from "lucide-react";
import { BiRepost as RepostIcon } from "react-icons/bi";
import PostLargePreview from "./PostLargePreview";
import { getCompanyAdmins, getCompanyAdminView } from "@/endpoints/company";
import { AxiosError } from "axios";
import { BasicCompanyData } from "@/pages/company/ManageCompanyPage";
import { socketService } from "@/services/socket";

interface PostProps {
  postData: PostType;
  viewMore: boolean; // used to hide certain elements for responsive design
  action?: ActivityContextType; // used if the post is an action
  className?: string;
  originalPost?: PostType;
}

const userId = Cookies.get("linkup_user_id");
const token = Cookies.get("linkup_auth_token");

const Post: React.FC<PostProps> = ({
  postData,
  viewMore,
  action,
  className,
  originalPost,
}) => {
  // State hooks
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(postData?.is_saved || false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [repostMenuOpen, setRepostMenuOpen] = useState(false);
  const [willDelete, setWillDelete] = useState(false);
  const [companyData, setCompanyData] = useState<BasicCompanyData | null>();
  const instant = originalPost?.post_type === "Repost instant";

  const [topStats, setTopStats] = useState(
    getReactionIcons(
      originalPost && instant
        ? originalPost.top_reactions || []
        : postData?.top_reactions || []
    )
  );
  const [selectedReaction, setSelectedReaction] = useState<string>(
    originalPost?.user_reaction && instant
      ? originalPost?.user_reaction.charAt(0).toUpperCase() +
          originalPost?.user_reaction.slice(1).toLowerCase()
      : postData?.user_reaction
      ? postData?.user_reaction.charAt(0).toUpperCase() +
        postData?.user_reaction.slice(1).toLowerCase()
      : "None"
  );
  const [loadingComments, setLoadingComments] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.list);
  const { author }: { author: PostUserType } = postData;
  const { date, media } = postData;
  const comments_data = {
    comments: postData.comments_data?.comments || [],
    count: postData.comments_data?.count || 0,
    nextCursor: postData.comments_data?.nextCursor || 0,
    isLoading: postData.comments_data?.isLoading || false,
    hasInitiallyLoaded: postData.comments_data?.hasInitiallyLoaded || false,
  };
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  const isInstantRepost = postData.post_type === "Repost instant";
  const isRepostWithThoughts = postData.media?.media_type === "post";

  const targetPost = isInstantRepost && originalPost ? originalPost : postData;

  const fetchCompanyData = async () => {
    if (!postData.author.username) return;

    try {
      const response = await getCompanyAdminView(postData.author.username);

      if (response && response.company) {
        const company = response.company;
        setCompanyData({
          _id: company._id,
          name: company.name,
          logo: company.logo || "",
          website: company.website || "",
          industry: company.industry || "",
          size: company.size || "",
          type: company.type || "",
          phone: company.phone || "",
          founded: company.founded || "",
          overview: company.overview || "",
          followerCount: company.followerCount || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch company data:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await getCompanyAdmins(author.username);
      if (userId && response.admins.some((admin) => admin.user_id === userId)) {
        setIsCompanyAdmin(postData.is_company || false);
      }
    } catch (err) {
      // Only show error toast if not 403 (forbidden)
      if ((err as AxiosError).status !== 403) {
        toast.error("Failed to load admins. Please try again.");
      }
    }
  };
  useEffect(() => {
    if (postData.is_company === true) {
      fetchAdmins();
      fetchCompanyData();
    }
  }, [postData.is_company]);

  useEffect(() => {
    if (
      media &&
      (media.media_type === "image" || media.media_type === "images")
    ) {
      const img = new Image();
      img.src = media.link[0];
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
    }
  }, [media]);

  useEffect(() => {
    if (postData.is_saved) setIsSaved(postData.is_saved);
  }, [postData.is_saved]);

  useEffect(() => {
    const commentButton = document.getElementById("engagement-Comment");

    if (commentButton && postData.comments_disabled === "No one") {
      commentButton.setAttribute("disabled", "true");
      commentButton.classList.add(
        "opacity-50",
        "cursor-not-allowed",
        "hover:cursor-not-allowed"
      );
      commentButton.classList.remove("hover:cursor-pointer");
    }
  }, [postData.comments_disabled]);

  useEffect(() => {
    if (postData.user_reaction)
      setSelectedReaction(
        postData.user_reaction.charAt(0).toUpperCase() +
          postData.user_reaction.slice(1).toLowerCase()
      );
  }, [postData.user_reaction]);

  if (!postData || !targetPost._id) {
    return (
      <div className={className}>
        <PostSkeleton />
      </div>
    );
  }

  // Comment handling functions
  const handleToggleComments = async () => {
    if (!token) {
      toast.error("You must be logged in to view comments.");
      navigate("/login", { replace: true });
      return;
    }

    if (commentsOpen) {
      return;
    }

    setCommentsOpen(true);

    // Load comments if they haven't been loaded yet
    if (!comments_data.hasInitiallyLoaded) {
      await handleLoadComments();
    }
  };

  const handleLoadComments = async () => {
    if (!token) {
      toast.error("You must be logged in to view comments.");
      navigate("/login", { replace: true });
      return;
    }

    setLoadingComments(true);

    try {
      // Update loading state
      dispatch(
        updatePost({
          postId: targetPost._id,
          updatedPost: {
            comments_data: {
              ...comments_data,
              isLoading: true,
            },
          },
        })
      );

      // Fetch comments
      const response = await loadPostComments(
        targetPost._id,
        token,
        comments_data.nextCursor || 0
      );

      // Process response properly based on structure
      const newComments = Array.isArray(response.comments)
        ? response.comments
        : Object.values(response.comments || {});

      // Update post with comments - adding to existing comments
      dispatch(
        addCommentsToPost({
          postId: targetPost._id,
          comments: newComments as CommentType[],
          nextCursor: response.next_cursor || 0,
        })
      );

      // Update loading state - APPEND the comments instead of replacing
      const updatedComments = comments_data.hasInitiallyLoaded
        ? [...comments_data.comments, ...newComments] // Append if already loaded
        : newComments; // Replace if first load

      dispatch(
        updatePost({
          postId: targetPost._id,
          updatedPost: {
            comments_data: {
              comments: updatedComments as CommentType[],
              count: response.count || 0,
              nextCursor: response.next_cursor || 0,
              hasInitiallyLoaded: true,
              isLoading: false,
            },
          },
        })
      );
    } catch (error) {
      console.error("Failed to load comments:", error);
      toast.error("Failed to load comments");

      // Reset loading state
      dispatch(
        updatePost({
          postId: targetPost._id,
          updatedPost: {
            comments_data: {
              ...comments_data,
              isLoading: false,
            },
          },
        })
      );
    } finally {
      setLoadingComments(false);
    }
  };

  const addNewComment = async (newComment: CommentDBType) => {
    if (!token) {
      toast.error("You must be logged in to add a comment.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Adding your comment...");

    try {
      // Call the API to create the comment
      const createdComment = await createComment(newComment, token);
      if (postData.author.username !== userId)
        socketService.sendNotification(
          postData.author.username,
          userId as string,
          "comment",
          newComment.post_id,
          `${userId} Commented on ${postData.author.username}'s Post`
        );

      if (!newComment.parent_id) {
        // Add top-level comment
        dispatch(
          addNewCommentToPost({
            postId: targetPost._id,
            comment: {
              ...createdComment.comment,
              media: createdComment.comment.media
                ? {
                    link: [createdComment.comment.media],
                    media_type: createdComment.comment.media ? "image" : "None",
                  }
                : null,
            },
          })
        );
      } else {
        // Add reply to existing comment
        dispatch(
          updatePost({
            postId: targetPost._id,
            updatedPost: {
              comments_data: {
                ...comments_data,
                comments: comments_data.comments.map((comment) => {
                  if (comment._id === newComment.parent_id) {
                    return {
                      ...comment,
                      children: Array.isArray(comment.children)
                        ? [
                            ...comment.children,
                            {
                              ...createdComment.comment,
                              media: createdComment.comment.media
                                ? {
                                    link: [createdComment.comment.media],
                                    media_type: "image",
                                  }
                                : null,
                            },
                          ]
                        : [createdComment.comment],
                    };
                  }
                  return comment;
                }),
                count: comments_data.count + 1,
              },
            },
          })
        );
      }

      // Update the toast to success
      if (newComment.parent_id) {
        toast.success("Reply added successfully!");
      } else {
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  // Reaction handling functions
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setReactionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setReactionsOpen(false);
    }, 300);
  };

  const handleReact = (value: string) => {
    setSelectedReaction(value);

    if (value !== "None") {
      handleCreateReaction(value);
    } else {
      handleDeleteReaction();
    }
  };

  const handleCreateReaction = async (selected_reaction: string) => {
    if (!token) {
      toast.error("You must be logged in to add a reaction.");
      navigate("/login", { replace: true });
      return;
    }

    const reaction = {
      target_type: "Post",
      reaction: selected_reaction.toLowerCase(),
    };

    try {
      const result = await createReaction(reaction, targetPost._id, token);

      if (postData.author.username !== userId)
        socketService.sendNotification(
          postData.author.username,
          userId as string,
          "reacted",
          targetPost._id,
          `${userId} Reacted on ${targetPost.author.username}'s Post`
        );

      setTopStats(getReactionIcons(result.top_reactions || []));

      dispatch(
        updatePost({
          postId: targetPost._id,
          updatedPost: {
            reactions: result.top_reactions,
            reactions_count: result.reactions_count,
            user_reaction: selected_reaction.toLowerCase(),
          },
        })
      );
    } catch (error) {
      console.error("Error creating reaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  const handleDeleteReaction = async () => {
    if (!token) {
      toast.error("You must be logged in to remove a reaction.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const result = await deleteReaction(
        { target_type: "Post" },
        targetPost._id,
        token
      );

      setTopStats(getReactionIcons(result.top_reactions || []));

      dispatch(
        updatePost({
          postId: targetPost._id,
          updatedPost: {
            reactions: result.top_reactions,
            reactions_count: result.reactions_count,
            user_reaction: null,
          },
        })
      );
    } catch (error) {
      console.error("Error deleting reaction:", error);
      toast.error("Failed to remove reaction");
    }
  };

  // Post action functions
  const handleEditPostButton = () => {
    setPostMenuOpen(false);

    const postForEdit: PostDBObject = {
      content: postData.content,
      mediaType: (postData.media?.media_type as MediaType) || "none",
      media: postData.media?.link || [],
      commentsDisabled: postData.comments_disabled || "Anyone",
      publicPost: postData.public_post !== false,
      taggedUsers: postData.tagged_users || [],
      _id: targetPost._id, // Make sure to include the post ID
    };

    // Use the createPostSlice action instead of modal
    if (isCompanyAdmin) {
      // Use the new company edit action
      dispatch(
        openEditCompanyPostDialog({
          post: postForEdit,
          company: companyData,
        })
      );
    } else {
      // Use regular edit action
      dispatch(openEditPostDialog(postForEdit));
    }

    // Remove this line since we're using Redux now
    // postModal.openEdit(postForEdit);
  };

  const deleteModal = () => {
    setWillDelete(true);
  };

  const handleInstantRepost = async () => {
    if (!token) {
      toast.error("You must be logged in to repost.");
      navigate("/login", { replace: true });
      return;
    }
    try {
      setRepostMenuOpen(false);
      const loadingToastId = toast.loading("Reposting...");
      const postPayload = {
        media: [targetPost._id],
        mediaType: "post",
        postType: "Repost instant",
      };
      const result = await repostInstant(postPayload, token);
      toast.success("Post reposted successfully!");
      const post = await fetchSinglePost(result.postId, token);
      if (post) {
        // Prepare the post with comments-related fields
        const postWithComments = {
          ...post,
          commentsCount: 0,
          commentsData: {
            comments: [],
            count: 0,
            nextCursor: null,
          },
        };

        // Add the new post to the Redux store at the beginning of the list
        dispatch(unshiftPosts([postWithComments]));
      }
      toast.dismiss(loadingToastId);
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Failed to repost. Please try again.");
    }
  };

  const repostDialogue = () => {
    setRepostMenuOpen(false);
    const postForEdit: PostDBObject = {
      content: "",
      mediaType: "post" as MediaType,
      media: [targetPost._id],
      commentsDisabled: "Anyone",
      publicPost: true,
      taggedUsers: [],
      repostedPost: postData,
    };

    // Use the createPostSlice action instead of modal
    dispatch(openEditPostDialog(postForEdit));

    // Remove this line since we're using Redux now
    // postModal.openEdit(postForEdit);
  };

  const REPOST_MENU = [
    {
      name: "Repost with your thoughts",
      subtext: "Create a new post with this post attached",
      callback: repostDialogue,
      icon: React.createElement(EditIcon, { className: "mr-2" }),
    },
    {
      name: "Repost",
      subtext: "Instantly bring this post to others' feeds",
      callback: handleInstantRepost,
      icon: React.createElement(RepostIcon, { className: "mr-2" }),
    },
  ];

  const handleDeletePost = async () => {
    if (!token) {
      toast.error("You must be logged in to delete a post.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Deleting your post...");

    try {
      setWillDelete(false);
      await deletePost(targetPost._id, token);

      dispatch(
        setPosts(posts.filter((post: PostType) => post._id !== targetPost._id))
      );
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete the post. Please try again.");
    } finally {
      toast.dismiss(loadingToastId);
      setWillDelete(false);
    }
  };

  const handleSaveButton = async () => {
    if (!token) {
      toast.error("You must be logged in to save or unsave a post.");
      navigate("/login", { replace: true });
      return;
    }

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      const loading = toast.loading(
        isSaved ? "Unsaving post..." : "Saving post..."
      );

      await (isSaved
        ? unsavePost(targetPost._id, token)
        : savePost(targetPost._id, token));

      dispatch(
        updatePost({
          postId: targetPost._id,
          updatedPost: {
            is_saved: newSavedState,
          },
        })
      );

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
              className="text-blue-600 dark:text-blue-300 hover:underline hover:cursor-pointer"
            >
              View saved posts
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
      setIsSaved(!newSavedState); // Revert on error
    }
  };

  // UI helpers
  const menuActions =
    userId === author.username || isCompanyAdmin
      ? getPersonalMenuActions(
          handleSaveButton,
          handleEditPostButton,
          deleteModal,
          targetPost._id,
          isSaved
        )
      : getMenuActions(handleSaveButton, targetPost._id, isSaved);

  const engagementButtons = getEngagementButtons(
    selectedReaction,
    () => {
      handleReact("Like");
    },
    () => handleToggleComments()
  );

  const stats = {
    comments: targetPost?.comments_count || 0,
    reposts: targetPost?.reposts_count || 0,
    total: targetPost?.reactions_count || 0,
  };

  // Component rendering
  const reactionIcons = [
    { name: "Celebrate", icon: CelebrateIcon },
    { name: "Like", icon: LikeIcon },
    { name: "Love", icon: LoveIcon },
    { name: "Funny", icon: FunnyIcon },
    { name: "Insightful", icon: InsightfulIcon },
    { name: "Support", icon: SupportIcon },
  ];

  return (
    <Card className="p-2 bg-white border-0 mb-4 pl-0 max-w-[50rem] dark:bg-gray-900 dark:text-neutral-200">
      <CardContent className="flex flex-col items-start pl-0 w-full">
        {action && (
          <header className="flex pl-4 justify-start items-center w-full border-b gap-2 pb-2 dark:border-neutral-700">
            <Link to={`/user-profile/${action.actor_username}`}>
              <img
                src={action.actor_picture}
                alt={action.actor_name}
                className="w-4 h-4 md:w-6 md:h-6 rounded-full"
              />
            </Link>
            <span className="text-gray-500 text-xs dark:text-neutral-400">
              <Link
                to={`/user-profile/${action.actor_username}`}
                className="text-xs font-medium text-black dark:text-neutral-200 hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                {action.actor_name}
              </Link>{" "}
              {POST_ACTIONS[action?.type || "error"]}
            </span>
          </header>
        )}
        {originalPost && instant && (
          <header className="flex pl-4 justify-start items-center w-full border-b gap-2 pb-2 dark:border-neutral-700">
            <Link to={`/user-profile/${originalPost.author?.username}`}>
              <img
                src={originalPost.author?.profile_picture}
                alt={originalPost.author?.first_name}
                className="w-4 h-4 md:w-6 md:h-6 rounded-full"
              />
            </Link>
            <span className="text-gray-500 text-xs dark:text-neutral-400">
              <Link
                to={`/user-profile/${originalPost.author?.username}`}
                className="text-xs font-medium text-black dark:text-neutral-200 hover:cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                {originalPost.author?.first_name +
                  " " +
                  originalPost.author?.last_name}
              </Link>{" "}
              {POST_ACTIONS[originalPost.post_type || "error"]}
            </span>
          </header>
        )}
        <PostHeader
          user={author}
          action={action}
          postId={targetPost._id}
          postMenuOpen={postMenuOpen}
          setPostMenuOpen={setPostMenuOpen}
          menuActions={menuActions}
          edited={postData.is_edited || false}
          publicPost={postData.public_post}
          date={date}
          is_company={postData.is_company}
        />
        {postData.content && (
          <TruncatedText
            id="post-content"
            content={postData.content}
            lineCount={3}
          />
        )}

        {/* Post Image(s) */}
        {((media && media.media_type === "image") ||
          media?.media_type === "images") && (
          <PostImages images={media.link || []} isLandscape={isLandscape} />
        )}

        {media && media.media_type === "video" && (
          <div className="flex w-1/3 relative left-4 self-center justify-end">
            <video className="w-full pt-4" controls src={media.link[0]}></video>
          </div>
        )}
        {media && media.media_type === "pdf" && (
          <div className="flex w-full justify-center pt-4">
            {(() => {
              try {
                return (
                  <iframe
                    src={media.link[0]}
                    className="w-[800px] h-[600px]"
                    title="PDF Document"
                  />
                );
              } catch (error) {
                console.error(error);
                // Assuming you have a DocumentPreview component
                return (
                  <DocumentPreview
                    currentSelectedMedia={[
                      new File(
                        [
                          new Blob([media.link[0]], {
                            type: "application/pdf",
                          }),
                        ],
                        "document.pdf",
                        { type: "application/pdf" }
                      ),
                    ]}
                  />
                );
              }
            })()}
          </div>
        )}
        {media && media.media_type === "link" && (
          <div className="w-full pl-4 pt-4">
            <LinkPreview url={media.link[0]} className="w-full" />
          </div>
        )}
        {isRepostWithThoughts && (
          <PostLargePreview postData={postData.original_post} borders />
        )}
        <Dialog
          open={willDelete}
          onOpenChange={() => setWillDelete(!willDelete)}
        >
          <DialogContent className="dark:bg-gray-900 border-0 ">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="dark:text-neutral-300">
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
                    {stat}
                  </span>
                ))}
                {stats.total != 0 && stats.total}
              </button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700">
              <DialogTitle className=" px-2 text-xl font-medium">
                Reactions
              </DialogTitle>
              <DialogDescription />

              <ReactionsModal postId={targetPost._id} />
            </DialogContent>
          </Dialog>
          <div className="flex text-gray-500 dark:text-neutral-400 gap-2 text-sm items-center ">
            {stats.comments !== undefined && stats.comments !== 0 && (
              <p
                onClick={() => {
                  handleToggleComments();
                }}
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer"
              >
                {stats.comments} comments
              </p>
            )}
            {stats.reposts !== 0 && stats.comments && stats.comments !== 0 ? (
              <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold">
                {" "}
                ·
              </p>
            ) : (
              <></>
            )}
            {stats.reposts !== 0 && (
              <>
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
                            if (selectedReaction === "None") {
                              handleReact("Like");
                            } else {
                              handleReact("None");
                            }
                          }}
                          id={`reaction-button-${index}`}
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
                          {selectedReaction !== "None" ? (
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
                          {selectedReaction === "None"
                            ? viewMore
                              ? "Like"
                              : ""
                            : selectedReaction}
                        </Button>
                      </PopoverTrigger>
                    ) : button.name === "Repost" ? (
                      <Popover
                        open={repostMenuOpen}
                        onOpenChange={setRepostMenuOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            key={`repost-${index}`}
                            variant="ghost"
                            size="lg"
                            id="repost-button"
                            onClick={button.callback}
                            className={`flex dark:hover:bg-gray-700 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                          >
                            {button.icon}
                            {viewMore && button.name}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="relative dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
                          <div className="flex flex-col w-full p-2 gap-4">
                            {REPOST_MENU.map((item, index) => (
                              <Button
                                key={`repost-button-${index}`}
                                variant="ghost"
                                size="lg"
                                id={`repost-button-${index}`}
                                onClick={item.callback}
                                className={`flex w-fit h-fit dark:hover:bg-gray-700 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
                              >
                                <div className="flex justify-start w-full text-gray-600 dark:text-neutral-200">
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
                        id={`engagement-${button.name}`}
                        size="lg"
                        onClick={button.callback}
                        className={`flex dark:hover:bg-gray-700 dark:hover:text-neutral-200 items-center gap-2 hover:cursor-pointer transition-all`}
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
                        className={`hover:scale-200 hover:bg-gray-200 w-12 h-12 dark:hover:bg-gray-700 duration-300 ease-in-out transform transition-all mx-0 hover:mx-7 hover:-translate-y-5`}
                        style={{
                          animation: `bounceIn 0.5s ease-in-out ${
                            index * 0.045
                          }s forwards`,
                          opacity: 0,
                        }}
                        id={`reaction-button-${reaction.alt}`}
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

      <CardFooter className="flex flex-col w-full">
        {commentsOpen && postData.comments_disabled !== "No one" && (
          <>
            {/* Always show PostFooter with comment input */}

            <PostFooter
              postId={targetPost._id}
              addNewComment={addNewComment}
              comments={{
                ...comments_data,
                // Only show existing comments if they've been loaded
                comments: comments_data.hasInitiallyLoaded
                  ? comments_data.comments
                  : [],
              }}
              authorName={postData.author.first_name}
              existingComment={
                action?.type === "comment" ? action?.comment : undefined
              }
              loadMoreComments={handleLoadComments}
              comment_privacy={postData.comments_disabled}
              connection_degree={postData.author.connection_degree}
            />

            {/* Show skeletons below the existing content when loading more */}
            {(comments_data.isLoading || loadingComments) && (
              <div className="w-full mt-3">
                <CommentSkeleton />
              </div>
            )}
          </>
        )}
        {postData.comments_disabled === "No one" && (
          <div className="flex gap-4 w-full items-center">
            <FaCommentSlash />
            <div className="text-left w-full dark:text-neutral-200 ">
              The author has disabled commenting on this post.
            </div>
          </div>
        )}
        {postData?.activity_context?.comment &&
          !commentsOpen &&
          postData?.activity_context?.type == "comment" && (
            <div className="w-full pb-5">
              <CommentWithReplies
                comment={postData.activity_context.comment}
                disableReplies={true}
                handleCreateComment={() => {}}
                postId={targetPost._id}
                disableControls
              />
            </div>
          )}
      </CardFooter>
    </Card>
  );
};

export default Post;

export function getReactionIcons(reactions: string[]) {
  const reactionIconsMap: Record<string, JSX.Element> = {
    celebrate: <img src={CelebrateIcon} alt="Celebrate" className="w-4 h-4" />,
    love: <img src={LoveIcon} alt="Love" className="w-4 h-4" />,
    insightful: (
      <img src={InsightfulIcon} alt="Insightful" className="w-4 h-4" />
    ),
    support: <img src={SupportIcon} alt="Support" className="w-4 h-4" />,
    funny: <img src={FunnyIcon} alt="Funny" className="w-4 h-4" />,
    like: <img src={LikeIcon} alt="Like" className="w-4 h-4" />,
  };

  return reactions
    .map((reaction) => reactionIconsMap[reaction.toLowerCase()])
    .filter((icon) => icon); // Filter out undefined icons
}
