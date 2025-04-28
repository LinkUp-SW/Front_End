import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostDBObject } from "@/types";

interface CreatePostState {
  createPostOpen: boolean;
  editMode: boolean;
  postToEdit: PostDBObject | null;
  activeModal: string;
}

const initialState: CreatePostState = {
  createPostOpen: false,
  editMode: false,
  postToEdit: null,
  activeModal: "create-post",
};

export const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    openCreatePostDialog: (state) => {
      state.createPostOpen = true;
      state.editMode = false;
      state.postToEdit = null;
      state.activeModal = "create-post";
    },
    openEditPostDialog: (state, action: PayloadAction<PostDBObject>) => {
      state.createPostOpen = true;
      state.editMode = true;
      state.postToEdit = action.payload;
      state.activeModal = "create-post";
    },
    closeCreatePostDialog: (state) => {
      state.createPostOpen = false;
    },
    setActiveModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
  },
});

export const {
  openCreatePostDialog,
  openEditPostDialog,
  closeCreatePostDialog,
  setActiveModal,
} = createPostSlice.actions;

export default createPostSlice.reducer;
