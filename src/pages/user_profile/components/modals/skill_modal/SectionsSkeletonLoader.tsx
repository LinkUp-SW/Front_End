import React from "react";

const SectionsSkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
  </div>
);

export default SectionsSkeletonLoader;
