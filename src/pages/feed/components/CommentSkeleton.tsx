import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CommentSkeleton: React.FC = () => {
  return (
    <div className="flex gap-3 w-full mb-5 relative pl-4">
      {/* Avatar skeleton */}
      <div className="flex-shrink-0 mt-1">
        <Skeleton className="rounded-full h-8 w-8 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col rounded-xl p-3 bg-gray-100 dark:bg-gray-800">
          {/* User name and timestamp */}
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-600" />{" "}
              {/* Username */}
              <Skeleton className="h-3 w-12 bg-gray-200 dark:bg-gray-700" />{" "}
              {/* Role/badge */}
            </div>
            <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />{" "}
            {/* Time */}
          </div>

          {/* Comment content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-600" />
            <Skeleton className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>

        {/* Comment actions */}
        <div className="flex gap-4 px-2 mt-2">
          <Skeleton className="h-4 w-10 bg-gray-200 dark:bg-gray-700" />{" "}
          {/* Like */}
          <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />{" "}
          {/* Reply */}
          <Skeleton className="h-4 w-14 bg-gray-200 dark:bg-gray-700" />{" "}
          {/* Time */}
        </div>
      </div>
    </div>
  );
};

// Nested reply skeleton with indent
export const ReplyCommentSkeleton: React.FC = () => {
  return (
    <div className="flex gap-3 w-full mb-4 ml-10 relative">
      {/* Border connector to parent comment */}
      <div className="absolute left-[-20px] top-[-10px] border-l-2 border-b-2 border-gray-200 dark:border-gray-700 h-6 w-6 rounded-bl-lg" />

      {/* Avatar skeleton */}
      <div className="flex-shrink-0 mt-1">
        <Skeleton className="rounded-full h-7 w-7 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col rounded-xl p-3 bg-gray-100 dark:bg-gray-800">
          {/* User name and timestamp */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-600" />{" "}
              {/* Username */}
            </div>
            <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />{" "}
            {/* Time */}
          </div>

          {/* Reply content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-600" />
            <Skeleton className="h-4 w-4/6 bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>

        {/* Reply actions */}
        <div className="flex gap-4 px-2 mt-1.5">
          <Skeleton className="h-3 w-8 bg-gray-200 dark:bg-gray-700" />{" "}
          {/* Like */}
          <Skeleton className="h-3 w-10 bg-gray-200 dark:bg-gray-700" />{" "}
          {/* Reply */}
        </div>
      </div>
    </div>
  );
};

// Function to create a comment thread skeleton with replies
export const CommentWithRepliesSkeleton: React.FC<{ replyCount?: number }> = ({
  replyCount = 1,
}) => {
  return (
    <div className="w-full space-y-1">
      <CommentSkeleton />
      {Array.from({ length: replyCount }).map((_, idx) => (
        <ReplyCommentSkeleton key={idx} />
      ))}
    </div>
  );
};

// Multiple comments skeleton for use in feed loading
export const CommentsFeedSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <CommentWithRepliesSkeleton replyCount={1} />
      <CommentSkeleton />
      <CommentWithRepliesSkeleton replyCount={2} />
    </div>
  );
};

export default CommentSkeleton;
