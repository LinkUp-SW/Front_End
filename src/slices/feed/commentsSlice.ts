import { CommentObjectType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommentsState {
  list: CommentObjectType[];
}

const initialState: CommentsState = {
  list: [],
};

const commentsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<CommentObjectType[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
