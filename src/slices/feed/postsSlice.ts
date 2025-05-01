import { CommentType, PostType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostsState {
  list: PostType[];
  hasMore: boolean;
  nextCursor: number;
  isLoading: boolean;
  initialLoading: boolean;
}

type UpdatedCommentData = {
  content?: string;
  media?: {
    link: string;
    media_type: "image" | "video" | "none";
  };
  is_edited?: boolean;
};

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
    unshiftPosts: (state, action: PayloadAction<PostType[]>) => {
      state.list = [...action.payload, ...state.list];
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
    updateComment: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        content?: string;
        media?: {
          link: string;
          media_type: "video" | "image" | "none";
        };
        is_edited?: boolean;
      }>
    ) => {
      const { postId, commentId, ...updatedData } = action.payload;
      const post = state.list.find((post) => post._id === postId);

      if (post?.comments_data) {
        const updateCommentRecursively = (
          comments: CommentType[]
        ): CommentType[] => {
          return comments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                ...updatedData,
                is_edited: true,
              };
            }

            if (comment.children && comment.children.length > 0) {
              return {
                ...comment,
                children: updateCommentRecursively(comment.children),
              };
            }

            return comment;
          });
        };

        post.comments_data.comments = updateCommentRecursively(
          post.comments_data.comments
        );
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

      if (post && post.comments_data) {
        // Append new comments
        post.comments_data.comments = [
          ...post.comments_data.comments,
          ...comments,
        ];
        post.comments_data.nextCursor = nextCursor;
      }
    },

    // For adding a new comment to a post
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

      if (post) {
        // Increment the post's comment count
        post.comments_count = (post.comments_count || 0) + 1;

        if (post.comments_data) {
          // Add new comment to the beginning of the array
          post.comments_data.comments = [
            comment,
            ...post.comments_data.comments,
          ];
          // Increment the comments_data count
          post.comments_data.count = (post.comments_data.count || 0) + 1;
        } else {
          // Initialize comments_data if it doesn't exist
          post.comments_data = {
            comments: [comment],
            count: 1,
            nextCursor: null,
          };
        }
      }
    },

    // For adding a reply to a comment
    removeComment: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
      }>
    ) => {
      const { postId, commentId } = action.payload;
      const post = state.list.find((post) => post._id === postId);

      if (post && post.comments_data) {
        let commentRemoved = false;

        // Function to recursively find and remove comments or replies
        const removeCommentById = (comments: CommentType[]): CommentType[] => {
          // Check if the comment exists at this level
          const filteredComments = comments.filter(
            (comment) => comment._id !== commentId
          );

          // If we found and removed a comment at this level
          if (filteredComments.length < comments.length) {
            commentRemoved = true;
            // Update post and comments_data counts
            if (post.comments_count !== undefined) post.comments_count -= 1;

            return filteredComments;
          }

          // If not found at this level, check in each comment's children
          return filteredComments.map((comment) => {
            // Skip if we already processed this comment's children and removed the target
            if (commentRemoved) return comment;

            // Process this comment's children if they exist
            if (comment.children && comment.children.length > 0) {
              const filteredChildren = removeCommentById(comment.children);

              // If a child was removed, update the children array
              if (filteredChildren.length < comment.children.length) {
                return { ...comment, children: filteredChildren };
              }
            }
            return comment;
          });
        };

        // Update comments array with the comment/reply removed
        post.comments_data.comments = removeCommentById(
          post.comments_data.comments
        );
      }
    },
    addRepliesToComment: (
      state,
      action: PayloadAction<{
        postId: string;
        parentCommentId: string;
        replies: CommentType[];
        nextCursor: number | null;
      }>
    ) => {
      const { postId, parentCommentId, replies, nextCursor } = action.payload;
      const postIndex = state.list.findIndex((post) => post._id === postId);

      if (postIndex === -1 || !state.list[postIndex].comments_data) {
        return;
      }

      // Function to find the parent comment and add replies to it
      const updateCommentsWithNewReplies = (
        comments: CommentType[]
      ): CommentType[] => {
        return comments.map((comment) => {
          if (comment._id === parentCommentId) {
            // Found the parent comment, add the new replies
            const existingChildren = comment.children || [];
            const existingChildrenArray = Array.isArray(existingChildren)
              ? existingChildren
              : (Object.values(existingChildren) as CommentType[]);

            // Create a new array with existing and new replies
            // Filter out any duplicates by ID
            const existingIds = new Set(
              existingChildrenArray.map((r) => r._id)
            );
            const uniqueNewReplies = replies.filter(
              (r) => !existingIds.has(r._id)
            );

            return {
              ...comment,
              children: [...existingChildrenArray, ...uniqueNewReplies],
              replyNextCursor: nextCursor,
            } as CommentType;
          }

          // If this comment has children, check them recursively
          if (comment.children && comment.children.length > 0) {
            return {
              ...comment,
              children: updateCommentsWithNewReplies(comment.children),
            };
          }

          // Not the parent comment, return unchanged
          return comment;
        });
      };

      // Update the comments array
      state.list[postIndex].comments_data.comments =
        updateCommentsWithNewReplies(
          state.list[postIndex].comments_data.comments
        );
    },
    removeReply: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        replyId: string;
      }>
    ) => {
      const { postId, commentId, replyId } = action.payload;
      const postIndex = state.list.findIndex((post) => post._id === postId);

      if (postIndex !== -1 && state.list[postIndex].comments_data) {
        const post = state.list[postIndex];

        // More direct approach to update nested comments
        const updateCommentsWithoutReply = (
          comments: CommentType[]
        ): CommentType[] => {
          return comments.map((comment) => {
            // Create a new comment object to ensure Redux detects the change
            const updatedComment = { ...comment };

            // If this is the parent comment that contains the reply
            if (updatedComment._id === commentId) {
              // Add null check for children
              if (
                updatedComment.children &&
                Array.isArray(updatedComment.children)
              ) {
                const originalLength = updatedComment.children.length;

                // Filter out the reply by ID
                updatedComment.children = updatedComment.children.filter(
                  (reply) => reply._id !== replyId
                );

                // If we actually removed something, update counts
                if (updatedComment.children.length < originalLength) {
                  // ADDED: Update children_count
                  updatedComment.children_count = Math.max(
                    0,
                    (updatedComment.children_count || 0) - 1
                  );

                  // Update post comment count
                  if (post.comments_count !== undefined) {
                    post.comments_count -= 1;
                  }

                  // Update comments_data count
                  if (
                    post.comments_data &&
                    post.comments_data.count !== undefined
                  ) {
                    post.comments_data.count -= 1;
                  }

                  console.log(
                    `Reply ${replyId} removed from comment ${commentId}`
                  );
                }
              } else {
                console.warn(
                  `Comment ${commentId} has no children array or it's null`
                );
              }
              return updatedComment;
            }

            // If this comment has children, recursively check them
            if (
              updatedComment.children &&
              Array.isArray(updatedComment.children) &&
              updatedComment.children.length > 0
            ) {
              updatedComment.children = updateCommentsWithoutReply(
                updatedComment.children
              );
            }

            return updatedComment;
          });
        };

        // Update the comments array
        if (post.comments_data?.comments) {
          post.comments_data.comments = updateCommentsWithoutReply(
            post.comments_data.comments
          );
        }
      }
    },
    updateCommentReaction: (
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        reactions: string[]; // Use proper type here based on your API response
        reactions_count: number;
        user_reaction: string | null;
      }>
    ) => {
      const { postId, commentId, reactions, reactions_count, user_reaction } =
        action.payload;
      const postIndex = state.list.findIndex((post) => post._id === postId);

      if (postIndex !== -1 && state.list[postIndex].comments_data) {
        // Helper function to recursively find and update the comment
        const updateCommentReactions = (
          comments: CommentType[]
        ): CommentType[] => {
          return comments.map((comment) => {
            // If this is the target comment, update its reactions
            if (comment._id === commentId) {
              return {
                ...comment,
                reactions: reactions,
                reactions_count: reactions_count,
                user_reaction: user_reaction,
                top_reactions: reactions, // Simply use the reactions array directly
              };
            }

            // If this comment has children, recursively search them
            if (comment.children && comment.children.length > 0) {
              return {
                ...comment,
                children: updateCommentReactions(comment.children),
              };
            }

            // Otherwise, return the comment unchanged
            return comment;
          });
        };

        // Update the comments
        if (state.list[postIndex].comments_data.comments) {
          state.list[postIndex].comments_data.comments = updateCommentReactions(
            state.list[postIndex].comments_data.comments
          );
        }
      }
    },
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
      let replyAdded = false;

      if (post && post.comments_data) {
        // Find the parent comment
        const findAndAddReply = (comments: CommentType[]): boolean => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i]._id === parentCommentId) {
              // Add reply to this comment
              comments[i].children = comments[i].children || [];
              comments[i].children?.push(reply);

              // Increment the reply count on the parent comment
              comments[i].children_count = comments[i].children_count || 0;

              comments[i].children_count =
                (comments[i].children_count ?? 0) + 1;

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

        replyAdded = findAndAddReply(post.comments_data.comments);

        // Only increment counts if reply was successfully added
        if (replyAdded) {
          // Increment both the total post comment count
          post.comments_count = (post.comments_count || 0) + 1;
          // And the comments_data count
          post.comments_data.count = (post.comments_data.count || 0) + 1;
        }
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
  addRepliesToComment, // Add this export
  updateComment,
  setNextCursor,
  setHasMore,
  setLoading,
  setInitialLoading,
  removeComment,
  removeReply,
  updateCommentReaction,
  unshiftPosts,
} = postsSlice.actions;

export default postsSlice.reducer;
