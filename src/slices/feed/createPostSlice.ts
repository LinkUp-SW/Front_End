import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostDBObject } from "@/types";
import { BasicCompanyData } from "@/pages/company/ManageCompanyPage";

interface CreatePostState {
  createPostOpen: boolean;
  editMode: boolean;
  postToEdit: PostDBObject | null;
  activeModal: string;
  companyInfo: BasicCompanyData | null;
}

const initialState: CreatePostState = {
  createPostOpen: false,
  editMode: false,
  postToEdit: null,
  activeModal: "create-post",
  companyInfo: null,
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
    openEditCompanyPostDialog: (
      state,
      action: PayloadAction<{
        post: PostDBObject;
        company: BasicCompanyData | null | undefined;
      }>
    ) => {
      if (!action.payload.company) {
        return;
      }
      state.createPostOpen = true;
      state.editMode = true;
      state.postToEdit = action.payload.post;
      state.companyInfo = action.payload.company;
      state.activeModal = "create-post";
    },
    openCompanyPostDialog: (state, action: PayloadAction<BasicCompanyData>) => {
      state.createPostOpen = true;
      state.editMode = false;
      state.postToEdit = null;
      state.activeModal = "create-post"; // Keep using the same modal
      state.companyInfo = action.payload; // Just set company info
    },

    resetCompanyInfo: (state) => {
      state.companyInfo = null;
    },

    closeCreatePostDialog: (state) => {
      state.createPostOpen = false;
      state.companyInfo = null; // Reset company info when closing
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
  openEditCompanyPostDialog,
  openCompanyPostDialog,
  resetCompanyInfo,
} = createPostSlice.actions;

export default createPostSlice.reducer;
