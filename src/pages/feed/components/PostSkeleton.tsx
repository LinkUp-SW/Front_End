import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton: React.FC = () => {
  return (
    <div className="border-t dark:border-t-gray-700 p-4 dark:text-gray-400 flex flex-col gap-4 dark:bg-gray-900 bg-white rounded-lg shadow">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full dark:bg-gray-700 bg-gray-300" />{" "}
        {/* Profile Picture */}
        <div className="flex flex-col space-y-2 w-full">
          <Skeleton className="h-4 w-1/3 dark:bg-gray-700 bg-gray-300" />{" "}
          {/* Name */}
          <Skeleton className="h-3 w-1/4 dark:bg-gray-700 bg-gray-300" />{" "}
          {/* Connection Degree */}
        </div>
      </div>
      {/* Content Skeleton */}
      <Skeleton className="h-6 w-full dark:bg-gray-700 bg-gray-300" />{" "}
      {/* First line of content */}
      <Skeleton className="h-6 w-3/4 dark:bg-gray-700 bg-gray-300" />{" "}
      {/* Second line of content */}
      {/* Footer Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="w-6 h-6 rounded-full dark:bg-gray-700 bg-gray-300" />{" "}
          {/* Reaction Icon */}
          <Skeleton className="w-6 h-6 rounded-full dark:bg-gray-700 bg-gray-300" />{" "}
          {/* Reaction Icon */}
          <Skeleton className="w-6 h-6 rounded-full dark:bg-gray-700 bg-gray-300" />{" "}
          {/* Reaction Icon */}
        </div>
        <Skeleton className="h-4 w-1/4 dark:bg-gray-700 bg-gray-300" />{" "}
        {/* Comments and reposts */}
      </div>
    </div>
  );
};

export default PostSkeleton;
