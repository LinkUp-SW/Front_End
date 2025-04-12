import React from "react";

const SkillsSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="space-y-4">
      {[1].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="pl-4 space-y-1">
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkillsSkeleton;
