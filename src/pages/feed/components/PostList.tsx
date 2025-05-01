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
          postData={post}
          viewMore={viewMore}
          action={post.activityContext}
        />
      ))}
      {isLoading && <PostSkeleton />}
      <div ref={observerRef} className="h-10" />
    </>
  );
};

export default PostList;
