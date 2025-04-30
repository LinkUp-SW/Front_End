import { useDispatch } from "react-redux";
import {
  openCreatePostDialog,
  openEditPostDialog,
} from "@/slices/feed/createPostSlice";
import { PostDBObject } from "@/types";

export const usePostModal = () => {
  const dispatch = useDispatch();

  return {
    openCreate: () => dispatch(openCreatePostDialog()),
    openEdit: (post: PostDBObject) => dispatch(openEditPostDialog(post)),
  };
};
