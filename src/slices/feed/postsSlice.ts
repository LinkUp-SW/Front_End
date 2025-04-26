import { PostType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostsState {
  list: PostType[];
}

const initialState: PostsState = {
  list: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;
