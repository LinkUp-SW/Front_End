import { Card, CardContent } from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
// import { useDispatch } from "react-redux";
// import { handleOpenModalType } from "@/utils";
import { Dialog, DialogContent, DialogTrigger, Modal } from "@/components";
import { Link, useNavigate } from "react-router-dom";
import CreatePostModal from "./modals/CreatePostModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import PostSettingsModal from "./modals/PostSettingsModal";
import UploadMediaModal from "./modals/UploadMediaModal";
import AddDocumentModal from "./modals/AddDocumentModal";
import CommentControlModal from "./modals/CommentControlModal";
import { MediaType, PostDBObject } from "@/types";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { createPost } from "@/endpoints/feed";

const CreatePost: React.FC = () => {
  const { data, loading } = useSelector((state: RootState) => state.userBio);
  const [privacySetting, setPrivacySetting] = useState<string>("Anyone");
  const [postText, setPostText] = useState<string>("");
  const [commentSetting, setCommentSetting] = useState<string>("Anyone");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [activeModal, setActiveModal] = useState<string>("create-post");
  const navigate = useNavigate();
  const userID = Cookies.get("linkup_auth_token");

  const submitPost = async () => {
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

      // Wait for all FileReader operations to complete
      await Promise.all(fileReaders);
    } else {
      media_type = "none";
    }

    if (postText.length === 0) {
      toast.error("The post must have text.");
      return;
    }
    if (!userID) {
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
      taggedUsers: [],
    };

    console.log("Post Object:", postObject);
    try {
      const response = await createPost(postObject, userID);
      console.log("Post created successfully:", response);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <Card className="mb-4 w-full bg-white border-0 pr-4 dark:bg-gray-900 ">
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
                    setActiveModal("create-post"); // Reset activeModal to "create-post" when the modal is closed
                  }, 200);
                }
              }}
            >
              <DialogTrigger asChild className="w-full">
                <Button
                  variant="ghost"
                  className="w-[90%] h-11 border p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors hover:cursor-pointer hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
                >
                  <p className="w-full">Start a post</p>
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`dark:bg-gray-900 min-w-[20rem] sm:min-w-[35rem] w-auto dark:border-gray-700  ${
                  activeModal === "add-media" &&
                  "!w-[70rem] !max-w-[70rem] !max-h-[50rem]"
                }   py-3 px-0 ${
                  activeModal === "create-post" &&
                  "max-h-[30rem] overflow-y-auto"
                }`}
              >
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
                  />
                ) : activeModal == "add-document" ? (
                  <AddDocumentModal setActiveModal={setActiveModal} />
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
