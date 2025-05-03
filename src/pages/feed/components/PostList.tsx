"use client";

import React from "react";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { PostType } from "@/types";

interface PostListProps {
  posts: PostType[];
  viewMore: boolean;
  isLoading: boolean;
  initialLoading: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  viewMore,
  isLoading,
  initialLoading,
  observerRef,
}) => {
  if (initialLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <PostSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-2xl bg-white dark:bg-gray-900 p-4 rounded-lg">
        No posts to display. Start connecting to people!
      </p>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post._id}
          postData={
            post.original_post && post.post_type === "Repost instant"
              ? post.original_post
              : post
          }
          viewMore={viewMore}
          action={post.activity_context}
          originalPost={
            post.post_type === "Repost instant"
              ? post
              : post.post_type === "Repost thought"
              ? post.original_post
              : undefined
          }
        />
      ))}
      {isLoading && <PostSkeleton />}
      <div ref={observerRef} className="h-10" />
    </>
  );
};

export default PostList;
