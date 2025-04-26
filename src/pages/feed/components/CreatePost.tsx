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
import { useState } from "react";
import PostSettingsModal from "./modals/PostSettingsModal";
import UploadMediaModal from "./modals/UploadMediaModal";
import AddDocumentModal from "./modals/AddDocumentModal";
import CommentControlModal from "./modals/CommentControlModal";
import { CommentObjectType, MediaType, PostDBObject } from "@/types";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { createPost, fetchSinglePost } from "@/endpoints/feed";
import { DialogDescription } from "@radix-ui/react-dialog";
import { setPosts } from "@/slices/feed/postsSlice";
import { setComments } from "@/slices/feed/commentsSlice";
import React from "react";

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

const CreatePost: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts.list);
  const comments = useSelector((state: RootState) => state.comments.list);
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

  const navigate = useNavigate();
  const user_token = Cookies.get("linkup_auth_token");

  const clearFields = () => {
    setPrivacySetting("Anyone");
    setCommentSetting("Anyone");
    setPostText("");
    setSelectedMedia([]);
  };

  // Add a useMemo for handling text changes

  const submitPost = async (link?: string) => {
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
    if (!user_token) {
      toast.error("Please sign in again.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    const postObject: PostDBObject = {
      content: postText,
      mediaType: (media_type as MediaType) || "none",
      media: media,
      commentsDisabled: commentSetting,
      publicPost: privacySetting === "anyone",
      taggedUsers: taggedUsers.map((user) => user.id),
    };

    try {
      dismiss();
      clearFields();
      const toastId = toast.loading("Submitting your post...");
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
            View post
          </a>
        </span>,
        {
          id: toastId,
          duration: 15000,
        }
      );
      const post = await fetchSinglePost(response.postId, user_token, 0, 1);
      const comment: CommentObjectType = {
        comments: [],
        count: 0,
        nextCursor: 0,
      };
      if (post) {
        const newPosts = [post.post, ...posts];
        dispatch(setPosts(newPosts));
        const newComments = [comment, ...comments];
        dispatch(setComments(newComments));
      }
    } catch {
      toast.error("Error creating post. Please try again.");
    }
  };

  return (
    <>
      <Card className="mb-1 w-full bg-white border-0 pr-4 dark:bg-gray-900 ">
        <CardContent>
          <div className="flex space-x-3 justify-start items-start">
            <Link to={"#"}>
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
                  setTimeout(() => {
                    setSelectedMedia([]); // Reset activeModal to "create-post" when the modal is closed
                    setActiveModal("create-post");
                  }, 200);
                }
              }}
            >
              <DialogTrigger asChild className="w-full">
                <Button
                  variant="ghost"
                  id="create-post-button"
                  className="w-[90%] h-11 border p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors hover:cursor-pointer hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
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
