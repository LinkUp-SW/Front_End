import React, { JSX, useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
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
  MediaType,
  PostDBObject,
  PostType,
} from "@/types";
import { POST_ACTIONS } from "@/constants";
import PostHeader from "./PostHeader";
import { getMenuActions, getPersonalMenuActions } from "./Menus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TruncatedText,
} from "@/components";
import ReactionsModal from "./modals/ReactionsModal";
import PostImages from "./PostImages";
import Cookies from "js-cookie";
import { deletePost, savePost, unsavePost } from "@/endpoints/feed";
import { toast } from "sonner";
import TransparentButton from "./buttons/TransparentButton";
import BlueButton from "./buttons/BlueButton";
import { setPosts, updatePost } from "@/slices/feed/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import DocumentPreview from "./modals/DocumentPreview";
import LinkPreview from "./LinkPreview";
import PostSkeleton from "./PostSkeleton";
import { RootState } from "@/store";
import { openEditPostDialog } from "@/slices/feed/createPostSlice";

interface PostLargePreviewProps {
  postData: PostType | undefined;
  action?: ActivityContextType; // used if the post is an action
  className?: string;
  borders?: boolean;
}

const userId = Cookies.get("linkup_user_id");
const token = Cookies.get("linkup_auth_token");

const PostLargePreview: React.FC<PostLargePreviewProps> = ({
  postData,
  action,
  className,
  borders,
}) => {
  // All hooks at the top level
  // State hooks

  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(postData?.is_saved || false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [willDelete, setWillDelete] = useState(false);

  const topStats = getReactionIcons(postData?.top_reactions || []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.list);

  useEffect(() => {
    if (
      postData?.media &&
      (postData?.media.media_type === "image" ||
        postData?.media.media_type === "images")
    ) {
      const img = new Image();
      img.src = postData?.media.link[0];
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
    }
  }, [postData?.media]);

  useEffect(() => {
    if (postData?.is_saved) setIsSaved(postData?.is_saved);
  }, [postData?.is_saved]);

  useEffect(() => {
    const commentButton = document.getElementById("engagement-Comment");

    if (commentButton && postData?.comments_disabled === "No one") {
      commentButton.setAttribute("disabled", "true");
      commentButton.classList.add(
        "opacity-50",
        "cursor-not-allowed",
        "hover:cursor-not-allowed"
      );
      commentButton.classList.remove("hover:cursor-pointer");
    }
  }, [postData?.comments_disabled]);
  if (!postData) {
    return <PostSkeleton />;
  }

  if (!postData || !postData._id) {
    return (
      <div className={className}>
        <PostSkeleton />
      </div>
    );
  }

  // Comment handling functions

  // Post action functions
  const handleEditPostButton = () => {
    setPostMenuOpen(false);

    const postForEdit: PostDBObject = {
      content: postData.content,
      mediaType: (postData?.media?.media_type as MediaType) || "none",
      media: postData?.media?.link || [],
      commentsDisabled: postData.comments_disabled || "Anyone",
      publicPost: postData.public_post !== false,
      taggedUsers: postData.tagged_users || [],
      _id: postData._id, // Make sure to include the post ID
    };

    // Use the createPostSlice action instead of modal
    dispatch(openEditPostDialog(postForEdit));

    // Remove this line since we're using Redux now
    // postModal.openEdit(postForEdit);
  };

  const deleteModal = () => {
    setWillDelete(true);
  };

  const handleDeletePost = async () => {
    if (!token) {
      toast.error("You must be logged in to delete a post.");
      navigate("/login", { replace: true });
      return;
    }

    const loadingToastId = toast.loading("Deleting your post...");

    try {
      setWillDelete(false);
      await deletePost(postData._id, token);

      dispatch(
        setPosts(posts.filter((post: PostType) => post._id !== postData._id))
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
        ? unsavePost(postData._id, token)
        : savePost(postData._id, token));

      dispatch(
        updatePost({
          postId: postData._id,
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
    userId === postData?.author.username
      ? getPersonalMenuActions(
          handleSaveButton,
          handleEditPostButton,
          deleteModal,
          postData._id,
          isSaved
        )
      : getMenuActions(handleSaveButton, postData._id, isSaved);

  const stats = {
    comments: postData.comments_count || 0,
    reposts: 0,
    total: postData.reactions_count,
  };

  return (
    <Card
      className={`p-2 bg-white border-0 mb-4 pl-0 dark:bg-gray-900 dark:text-neutral-200 ${
        borders ? "border dark:border-gray-500" : ""
      }`}
    >
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
        <PostHeader
          user={postData?.author}
          action={action}
          postId={postData._id}
          postMenuOpen={postMenuOpen}
          setPostMenuOpen={setPostMenuOpen}
          menuActions={menuActions}
          edited={postData.is_edited || false}
          publicPost={postData.public_post}
          date={postData?.date}
          hideActions={true}
          savedPostView={true}
          disableLink
        />
        {postData.content && (
          <TruncatedText
            id="post-content"
            content={postData.content}
            limitHeight
            lineCount={3}
          />
        )}

        {/* Post Image(s) */}
        {((postData?.media && postData?.media.media_type === "image") ||
          postData?.media?.media_type === "images") && (
          <PostImages
            images={postData?.media.link || []}
            isLandscape={isLandscape}
          />
        )}

        {postData?.media && postData?.media.media_type === "video" && (
          <div className="flex w-1/3 relative left-4 self-center justify-end">
            <video
              className="w-full pt-4"
              controls
              src={postData?.media.link[0]}
            ></video>
          </div>
        )}
        {postData?.media && postData?.media.media_type === "pdf" && (
          <div className="flex w-full justify-center pt-4">
            {(() => {
              try {
                return (
                  <iframe
                    src={postData?.media.link[0]}
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
                          new Blob([postData?.media.link[0]], {
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
        {postData?.media && postData?.media.media_type === "link" && (
          <div className="w-full pl-4 pt-4">
            <LinkPreview url={postData?.media.link[0]} className="w-full" />
          </div>
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
                {stats.total > 0 && stats.total}
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
            {stats.comments !== 0 && (
              <p className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer">
                {stats.comments} comments
              </p>
            )}
            {stats.reposts !== 0 && stats.comments && stats.comments !== 0 && (
              <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold">
                {" "}
                ·
              </p>
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
      </CardContent>
    </Card>
  );
};

export default PostLargePreview;

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
