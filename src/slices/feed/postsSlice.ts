import { CommentType, PostType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostsState {
  list: PostType[];
  hasMore: boolean;
  nextCursor: number;
  isLoading: boolean;
  initialLoading: boolean;
}

const initialState: PostsState = {
  list: [],
  hasMore: true,
  nextCursor: 0,
  isLoading: false,
  initialLoading: true,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.list = action.payload;
    },

    appendPosts: (state, action: PayloadAction<PostType[]>) => {
      state.list = [...state.list, ...action.payload];
    },

    updatePost: (
      state,
      action: PayloadAction<{ postId: string; updatedPost: Partial<PostType> }>
    ) => {
      const { postId, updatedPost } = action.payload;
      const index = state.list.findIndex((post) => post._id === postId);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updatedPost };
      }
    },

    // For adding comments to a post (lazy loading)
    addCommentsToPost: (
      state,
      action: PayloadAction<{
        postId: string;
        comments: CommentType[];
        nextCursor: number | null;
      }>
    ) => {
      const { postId, comments, nextCursor } = action.payload;
      const post = state.list.find((post) => post._id === postId);

      if (post && post.commentsData) {
        // Append new comments
        post.commentsData.comments = [
          ...post.commentsData.comments,
          ...comments,
        ];
        post.commentsData.nextCursor = nextCursor;
      }
    },

    // For adding a new comment to a post
    addNewCommentToPost: (
      state,
      action: PayloadAction<{
        postId: string;
        comment: CommentType;
      }>
    ) => {
      const { postId, comment } = action.payload;
      const post = state.list.find((post) => post._id === postId);

      if (post && post.commentsData) {
        // Add new comment to the beginning of the array
        post.commentsData.comments = [comment, ...post.commentsData.comments];
        post.commentsData.count += 1;
      }
    },

    // For adding a reply to a comment
    addReplyToComment: (
      state,
      action: PayloadAction<{
        postId: string;
        parentCommentId: string;
        reply: CommentType;
      }>
    ) => {
      const { postId, parentCommentId, reply } = action.payload;
      const post = state.list.find((post) => post._id === postId);

      if (post && post.commentsData) {
        // Find the parent comment
        const findAndAddReply = (comments: CommentType[]): boolean => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i]._id === parentCommentId) {
              // Add reply to this comment
              comments[i].children = comments[i].children || [];
              comments[i].children?.push(reply);
              return true;
            }

            // Check in children recursively
            if (
              comments[i].children &&
              findAndAddReply(comments[i].children || [])
            ) {
              return true;
            }
          }
          return false;
        };

        findAndAddReply(post.commentsData.comments);
        post.commentsData.count += 1;
      }
    },

    // Pagination and loading state
    setNextCursor: (state, action: PayloadAction<number>) => {
      state.nextCursor = action.payload;
    },

    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.initialLoading = action.payload;
    },
  },
});

export const {
  setPosts,
  appendPosts,
  updatePost,
  addCommentsToPost,
  addNewCommentToPost,
  addReplyToComment,
  setNextCursor,
  setHasMore,
  setLoading,
  setInitialLoading,
} = postsSlice.actions;

export default postsSlice.reducer;
