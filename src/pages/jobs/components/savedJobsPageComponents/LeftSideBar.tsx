import React from 'react';
import { FaBookmark } from "react-icons/fa";

const LeftSidebar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="font-medium text-gray-700 dark:text-gray-200 mb-4 flex items-center">
        <FaBookmark className="mr-2" /> 
        <span>My items</span>
      </h2>
      
      <div className="mt-2">
        <div className="flex justify-between items-center py-2 border-l-4 border-blue-500 pl-2">
          <span className="text-blue-600 dark:text-blue-400">My jobs</span>
          <span className="text-blue-600 dark:text-blue-400 text-sm">248</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 dark:text-gray-400">Saved posts and articles</span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">10+</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;