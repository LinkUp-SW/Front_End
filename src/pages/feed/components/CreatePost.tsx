import { Card, CardContent } from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
// import { useDispatch } from "react-redux";
// import { handleOpenModalType } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { Link, useNavigate } from "react-router-dom";
import CreatePostModal from "./modals/CreatePostModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import PostSettingsModal from "./modals/PostSettingsModal";
import UploadMediaModal from "./modals/UploadMediaModal";
import AddDocumentModal from "./modals/AddDocumentModal";
import CommentControlModal from "./modals/CommentControlModal";
import { MediaType, PostDBObject } from "@/types";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  createCompanyPost,
  createPost,
  fetchSinglePost,
  repostWithThoughts,
} from "@/endpoints/feed";
import { DialogDescription } from "@radix-ui/react-dialog";
import { editPost } from "@/endpoints/feed";
import { updatePost } from "@/slices/feed/postsSlice";
import React from "react";
import { closeCreatePostDialog } from "@/slices/feed/createPostSlice";
import { openCreatePostDialog } from "@/slices/feed/createPostSlice";
import { unshiftPosts } from "@/slices/feed/postsSlice";

const useDismissModal = () => {
  const dismiss = () => {
    // Select the close button using its classes
    const closeButton = document.querySelector(
      "#modal-close-button"
    ) as HTMLButtonElement;

    if (closeButton) {
      closeButton.click(); // Simulate a click on the close button
    }
  };

  return {
    dismiss,
  };
};
interface CreatePostProps {
  className?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ className }) => {
  //const posts = useSelector((state: RootState) => state.posts.list);
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.userBio);
  const [privacySetting, setPrivacySetting] = useState<string>("Anyone");
  const [postText, setPostText] = useState<string>("");
  const [commentSetting, setCommentSetting] = useState<string>("Anyone");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [activeModal, setActiveModal] = useState<string>("create-post");
  const [taggedUsers, setTaggedUsers] = useState<
    { name: string; id: string }[]
  >([]);
  const { dismiss } = useDismissModal();
  const isDialogOpen = useSelector(
    (state: RootState) => state.createPost.createPostOpen
  );
  const editMode = useSelector((state: RootState) => state.createPost.editMode);
  const postToEdit = useSelector(
    (state: RootState) => state.createPost.postToEdit
  );
  const companyInfo = useSelector(
    (state: RootState) => state.createPost.companyInfo
  );

  const navigate = useNavigate();
  const user_token = Cookies.get("linkup_auth_token");
  const user_id = Cookies.get("linkup_user_id");

  useEffect(() => {
    if (editMode && postToEdit) {
      setPostText(postToEdit.content || "");
      setPrivacySetting(postToEdit.publicPost ? "Anyone" : "Connections only");
      setCommentSetting(postToEdit.commentsDisabled || "Anyone");
      console.log(postToEdit);

      // Handle media if exists
      if (postToEdit.media && postToEdit.media.length > 0) {
        // For URLs, we'll need to fetch the images and convert them to Files
        const fetchImages = async () => {
          try {
            const files = await Promise.all(
              postToEdit.media.map(async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return new File([blob], `image.${blob.type.split("/")[1]}`, {
                  type: blob.type,
                });
              })
            );
            setSelectedMedia(files);
          } catch (error) {
            console.error("Error fetching media:", error);
          }
        };

        fetchImages();
      }

      if (postToEdit.taggedUsers) {
        setTaggedUsers(
          postToEdit.taggedUsers.map((id) => ({
            id,
            name: "", // You might need to fetch user names
          }))
        );
      }
      if (postToEdit.repostedPost) {
        clearFields();
      }
    }
  }, [editMode, postToEdit]);

  const clearFields = () => {
    setPrivacySetting("Anyone");
    setCommentSetting("Anyone");
    setPostText("");
    setSelectedMedia([]);
  };

  // Add a useMemo for handling text changes

  const submitPost = async (link?: string) => {
    dispatch(closeCreatePostDialog());
    if (!user_token) {
      toast.error("Please sign in again.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    if (postToEdit && postToEdit.repostedPost) {
      const postPayload: {
        content: string;
        mediaType: string;
        media: string[];
        commentsDisabled: string;
        publicPost: boolean;
        postType: string;
      } = {
        media: [postToEdit.repostedPost._id],
        mediaType: "post",
        commentsDisabled: postToEdit.commentsDisabled,
        content: postText,
        postType: "Repost thought",
        publicPost: postToEdit.publicPost,
      };

      handleRepostWithThoughts(postPayload);
      return;
    }

    let media_type: string | undefined;
    const media: string[] = [];

    if (selectedMedia && selectedMedia.length > 0) {
      const images = selectedMedia.filter((file) =>
        file.type.startsWith("image/")
      );
      const videos = selectedMedia.filter((file) =>
        file.type.startsWith("video/")
      );

      if (videos.length > 1) {
        alert("You can only upload one video at a time.");
        return;
      }

      if (videos.length > 0 && images.length > 0) {
        alert("You cannot upload images and a video together.");
        return;
      }

      const fileReaders: Promise<void>[] = [];

      if (videos.length === 1) {
        media_type = "video";
        const video = videos[0];
        const reader = new FileReader();

        const videoPromise = new Promise<void>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string; // Convert to Base64 string
            media.push(result);
            resolve();
          };
          reader.onerror = (error) => {
            console.error(`Error reading file ${video.name}:`, error);
            reject(error);
          };
        });

        reader.readAsDataURL(video);
        fileReaders.push(videoPromise);
      } else if (images.length > 0) {
        media_type = images.length > 1 ? "images" : "image";

        images.forEach((image) => {
          const reader = new FileReader();

          const imagePromise = new Promise<void>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string; // Convert to Base64 string
              media.push(result);
              resolve();
            };
            reader.onerror = (error) => {
              console.error(`Error reading file ${image.name}:`, error);
              reject(error);
            };
          });

          reader.readAsDataURL(image);
          fileReaders.push(imagePromise);
        });
      }
      const pdfs = selectedMedia.filter(
        (file) => file.type === "application/pdf"
      );

      if (pdfs.length > 0) {
        media_type = "pdf";
        pdfs.forEach((pdf) => {
          const reader = new FileReader();

          const pdfPromise = new Promise<void>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string; // Convert to Base64 string
              media.push(result);
              resolve();
            };
            reader.onerror = (error) => {
              console.error(`Error reading file ${pdf.name}:`, error);
              reject(error);
            };
          });

          reader.readAsDataURL(pdf);
          fileReaders.push(pdfPromise);
        });
      }

      // Wait for all FileReader operations to complete
      await Promise.all(fileReaders);
    } else if (link) {
      console.log("here", link);
      media_type = "link";
      media.push(link);
    } else {
      media_type = "none";
    }

    if (postText.trim().length === 0 && selectedMedia.length === 0) {
      toast.error("The post must have either content or media.");
      return;
    }

    const postObject: PostDBObject = {
      content: postText,
      mediaType: (media_type as MediaType) || "none",
      media: media,
      commentsDisabled: commentSetting,
      publicPost: privacySetting === "Anyone",
      taggedUsers: taggedUsers.map((user) => user.id),
      _id: editMode ? postToEdit?._id : undefined,
    };

    try {
      dismiss();
      clearFields();
      const toastId = toast.loading(
        editMode ? "Updating your post..." : "Submitting your post..."
      );
      if (companyInfo) {
        // Call company post endpoint
        const result = await createCompanyPost(
          postObject,
          companyInfo._id,
          user_token
        );
        toast.success(
          <span>
            {result.message}{" "}
            <a
              href={`/feed/posts/${result.postId}`}
              className="text-blue-600 dark:text-blue-300 hover:underline"
              onClick={() => toast.dismiss(toastId)}
            >
              . View post
            </a>
          </span>,
          {
            id: toastId,
            duration: 15000,
          }
        );
        const post = await fetchSinglePost(result.postId, user_token);
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
      } else if (editMode && postToEdit?._id) {
        // Handle edit
        const response = await editPost(postObject, user_token);
        console.log("RESPONSE:", response);

        dispatch(
          updatePost({
            postId: postToEdit._id,
            updatedPost: {
              content: postObject.content,
              media: {
                media_type: postObject.mediaType,
                link: postObject.media,
              },
              comments_disabled: postObject.commentsDisabled,
              public_post: postObject.publicPost,
              tagged_users: postObject.taggedUsers,
              is_edited: true,
            },
          })
        );

        toast.success("Post updated successfully", { id: toastId });
        dispatch(closeCreatePostDialog());
      } else {
        const response = await createPost(postObject, user_token);
        console.log(response);
        toast.success(
          <span>
            {response.message}{" "}
            <a
              href={`/feed/posts/${response.postId}`}
              className="text-blue-600 dark:text-blue-300 hover:underline"
              onClick={() => toast.dismiss(toastId)}
            >
              . View post
            </a>
          </span>,
          {
            id: toastId,
            duration: 15000,
          }
        );
        const post = await fetchSinglePost(response.postId, user_token);
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
        dispatch(closeCreatePostDialog());
      }
    } catch {
      toast.error("Error creating post. Please try again.");
    }
  };

  const handleRepostWithThoughts = async (postPayload: {
    content: string;
    mediaType: string;
    media: string[];
    commentsDisabled: string;
    publicPost: boolean;
    postType: string;
  }) => {
    if (!user_token) {
      toast.error("Please sign in again.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    try {
      const loadingToastId = toast.loading("Reposting...");

      const result = await repostWithThoughts(postPayload, user_token);
      const post = await fetchSinglePost(result.postId, user_token);
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
      toast.success("Repost successful!");
      toast.dismiss(loadingToastId);

      return;
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Failed to repost. Please try again.");
    }
  };

  return (
    <>
      <Card
        className={`mb-1 w-full bg-white border-0 pr-4 dark:bg-gray-900 ${className}`}
      >
        <CardContent>
          <div className="flex space-x-3 justify-start items-start">
            <Link to={`/user-profile/${user_id}`}>
              <Avatar className="h-12 w-12 pl-0">
                {loading ? (
                  <>
                    <div className="h-14 w-14 animate-pulse rounded-full bg-gray-300" />
                  </>
                ) : (
                  <>
                    <AvatarImage
                      src={data?.profile_photo || ""}
                      alt="Profile"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </>
                )}
              </Avatar>
            </Link>
            <Dialog
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  dispatch(closeCreatePostDialog());
                  setTimeout(() => {
                    setSelectedMedia([]);
                    setActiveModal("create-post");
                  }, 200);
                }
              }}
              open={isDialogOpen}
            >
              <DialogTrigger asChild className="w-full">
                <Button
                  variant="ghost"
                  id="create-post-button"
                  onClick={() => dispatch(openCreatePostDialog())}
                  className="w-[90%] h-11 border p-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
                >
                  <p className="w-full">Start a post</p>
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700  ${
                  activeModal === "add-media" &&
                  "w-auto !lg:w-[70rem] !max-w-[70rem] !lg:max-h-[50rem]"
                }   py-3 px-0 ${
                  activeModal === "create-post" &&
                  "max-h-[30rem] overflow-y-auto"
                }`}
              >
                <DialogTitle className="hidden"></DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
                {activeModal == "settings" ? (
                  <PostSettingsModal
                    setActiveModal={setActiveModal}
                    privacySetting={privacySetting}
                    setPrivacySetting={setPrivacySetting}
                    commentSetting={commentSetting}
                  />
                ) : activeModal == "create-post" ? (
                  <CreatePostModal
                    profileImageUrl={data?.profile_photo || ""}
                    setActiveModal={setActiveModal}
                    postText={postText}
                    setPostText={setPostText}
                    submitPost={submitPost}
                    privacySetting={privacySetting}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    taggedUsers={taggedUsers}
                    setTaggedUsers={setTaggedUsers}
                    repostedPost={postToEdit?.repostedPost}
                    company={companyInfo}
                  />
                ) : activeModal == "add-document" ? (
                  <AddDocumentModal
                    setActiveModal={setActiveModal}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                  />
                ) : activeModal == "comment-control" ? (
                  <CommentControlModal
                    commentSetting={commentSetting}
                    setCommentSetting={setCommentSetting}
                    setActiveModal={setActiveModal}
                  />
                ) : (
                  <div className="py-10 ">
                    <UploadMediaModal
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                      setActiveModal={setActiveModal}
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CreatePost;
