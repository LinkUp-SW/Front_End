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
import { MediaType, PostDBObject } from "@/types";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { createPost, fetchSinglePost } from "@/endpoints/feed";
import { DialogDescription } from "@radix-ui/react-dialog";

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

  return (
    <>
      <Card
        className={`mb-1 w-full bg-white border-0 pr-4 dark:bg-gray-900 ${className}`}
      >
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
            <Button
              variant="ghost"
              id="create-post-button"
              onClick={() => dispatch(openCreatePostDialog())}
              className="w-[90%] h-11 border p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors hover:cursor-pointer hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
            >
              <p className="w-full">Start a post</p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CreatePost;
