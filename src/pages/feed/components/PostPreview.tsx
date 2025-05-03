import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MediaType, MenuAction, PostDBObject, PostType } from "@/types";
import PostHeader from "@/pages/feed/components/PostHeader";
import TruncatedText from "@/components/truncate_text/TruncatedText";
import DocumentPreview from "@/pages/feed/components/modals/DocumentPreview";
import CompactLinkPreview from "./CompactLinkPreview";
import PostPreviewSkeleton from "./PostPreviewSkeleton";
import { getMenuActions, getPersonalMenuActions } from "./Menus";
import { openEditPostDialog } from "@/slices/feed/createPostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components";
import TransparentButton from "./buttons/TransparentButton";
import BlueButton from "./buttons/BlueButton";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { deletePost, savePost, unsavePost } from "@/endpoints/feed";
import { setPosts, updatePost } from "@/slices/feed/postsSlice";
import { RootState } from "@/store";

interface PostPreviewProps {
  post: PostType | undefined;
  menuActions: MenuAction[];
  onMenuOpenChange?: (isOpen: boolean) => void;
  compact?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  hideActions?: boolean;
  className?: string;
}

const userId = Cookies.get("linkup_user_id");
const token = Cookies.get("linkup_auth_token");

const PostPreview: React.FC<PostPreviewProps> = ({
  post,
  onMenuOpenChange,
  compact = false,
  showHeader = true,
  showFooter = false,
  hideActions = false,
  className = "",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [willDelete, setWillDelete] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(post?.is_saved || false);
  const navigate = useNavigate();
  const posts = useSelector((state: RootState) => state.posts.list);

  if (!post) {
    return <PostPreviewSkeleton />;
  }

  // Handle menu open state with callback to parent if provided
  const handleMenuOpenChange = (isOpen: boolean) => {
    setMenuOpen(isOpen);
    if (onMenuOpenChange) {
      onMenuOpenChange(isOpen);
    }
  };

  const handleEditPostButton = () => {
    const postForEdit: PostDBObject = {
      content: post.content,
      mediaType: (post.media?.media_type as MediaType) || "none",
      media: post.media?.link || [],
      commentsDisabled: post.comments_disabled || "Anyone",
      publicPost: post.public_post !== false,
      taggedUsers: post.tagged_users || [],
      _id: post._id, // Make sure to include the post ID
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
      await deletePost(post._id, token);

      dispatch(setPosts(posts.filter((p: PostType) => p._id !== post._id)));
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

      await (isSaved ? unsavePost(post._id, token) : savePost(post._id, token));

      dispatch(
        updatePost({
          postId: post._id,
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
    userId === post.author.username
      ? getPersonalMenuActions(
          handleSaveButton,
          handleEditPostButton,
          deleteModal,
          post._id,
          isSaved
        )
      : getMenuActions(handleSaveButton, post._id, isSaved);

  // Handle unsave directly if the function is provided

  return (
    <div
      className={`border-t dark:border-t-gray-600 w-full p-4 ${
        compact ? "" : "mb-4"
      } h-[320px] w-full ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog open={willDelete} onOpenChange={() => setWillDelete(!willDelete)}>
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
      <div className="flex flex-col gap-3  h-full">
        {showHeader && (
          <div className="relative -left-7">
            <PostHeader
              edited={post.is_edited || false}
              publicPost={post.public_post}
              user={post.author}
              postMenuOpen={menuOpen}
              postId={post._id}
              setPostMenuOpen={handleMenuOpenChange}
              menuActions={menuActions}
              savedPostView
              date={post.date}
              hideActions={hideActions}
            />
          </div>
        )}

        <Link
          to={`/feed/posts/${post._id}`}
          className="flex-grow overflow-hidden"
        >
          <div
            className={`flex ${
              post.media.media_type === "pdf" ||
              post.media.media_type === "link"
                ? "flex-col"
                : "gap-4"
            } h-full`}
          >
            {post.media && post.media.media_type !== "none" && (
              <>
                {(post.media.media_type === "image" ||
                  post.media.media_type === "images") && (
                  <img
                    src={post.media.link[0]}
                    className="object-cover w-20 h-20 overflow-hidden shrink-0 rounded-lg"
                    alt="Post thumbnail"
                  />
                )}

                {post.media.media_type === "video" && (
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                    <video
                      src={post.media.link[0]}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col ">
              <TruncatedText
                content={post.content}
                hideLinks={true}
                lineCount={3}
                id={`post-${post._id}`}
              />

              {post.media.media_type === "pdf" && (
                <DocumentPreview
                  currentSelectedMedia={[
                    new File(
                      [
                        new Blob([post.media.link[0]], {
                          type: "application/pdf",
                        }),
                      ],
                      "document.pdf",
                      { type: "application/pdf" }
                    ),
                  ]}
                />
              )}

              {post.media.media_type === "link" && (
                <CompactLinkPreview url={post.media.link[0]} />
              )}
            </div>
          </div>
        </Link>

        {showFooter && (
          <div className="flex justify-between mt-3 pt-2 border-t cursor-default dark:border-gray-700">
            <div className="flex items-center gap-1 text-gray-500  hover:cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
              <span>{post.reactions_count}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-500 hover:cursor- ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.comments.length || 0}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPreview;
