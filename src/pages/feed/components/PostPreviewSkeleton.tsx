import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostPreviewSkeletonProps {
  showHeader?: boolean;
}

const PostPreviewSkeleton: React.FC<PostPreviewSkeletonProps> = ({
  showHeader = true,
}) => {
  return (
    <div className="border-t dark:border-t-gray-600 p-4 flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {showHeader && (
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full dark:bg-gray-700 bg-gray-300" />
          <div className="flex flex-col gap-2 flex-grow">
            <Skeleton className="h-4 w-1/3 dark:bg-gray-700 bg-gray-300" />
            <Skeleton className="h-3 w-1/4 dark:bg-gray-700 bg-gray-300" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full dark:bg-gray-700 bg-gray-300" />
        </div>
      )}

      <div className="flex gap-4">
        <Skeleton className="w-20 h-20 rounded-lg dark:bg-gray-700 bg-gray-300 shrink-0" />
        <div className="flex flex-col space-y-2 w-full">
          <Skeleton className="h-4 w-full dark:bg-gray-700 bg-gray-300" />
          <Skeleton className="h-4 w-5/6 dark:bg-gray-700 bg-gray-300" />
          <Skeleton className="h-4 w-4/6 dark:bg-gray-700 bg-gray-300" />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Skeleton className="h-6 w-24 dark:bg-gray-700 bg-gray-300 rounded-full" />
        <Skeleton className="h-6 w-24 dark:bg-gray-700 bg-gray-300 rounded-full" />
        <Skeleton className="h-6 w-24 dark:bg-gray-700 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default PostPreviewSkeleton;
