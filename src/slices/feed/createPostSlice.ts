import { createSlice } from "@reduxjs/toolkit";

interface DialogState {
  createPostOpen: boolean;
}

const initialState: DialogState = {
  createPostOpen: false,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openCreatePostDialog: (state) => {
      state.createPostOpen = true;
    },
    closeCreatePostDialog: (state) => {
      state.createPostOpen = false;
    },
  },
});

export const { openCreatePostDialog, closeCreatePostDialog } =
  dialogSlice.actions;
export default dialogSlice.reducer;
