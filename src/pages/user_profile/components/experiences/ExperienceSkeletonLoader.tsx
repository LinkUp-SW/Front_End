import React from "react";

const ExperienceSkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default ExperienceSkeletonLoader;
