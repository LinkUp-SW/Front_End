import React from "react";
import { Job } from "../../types";

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, isSelected, onClick }) => {
  // Helper function to get logo background color based on company
  const getLogoBgColor = (company: string): string => {
    switch (company) {
      case "Arib":
        return "bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300";
      case "EFG Holding":
        return "bg-green-800 text-white";
      case "e& Egypt":
        return "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300";
      case "Cleopatra Hospitals Group":
        return "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300";
    }
  };

  const logoBgClass = getLogoBgColor(job.company);
  const logoTextSize = job.logo.length > 1 ? "text-xs" : "text-lg";
  
  return (
    <div 
      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:bg-gray-900
        ${isSelected ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-gray-50 dark:bg-gray-700' : ''}`}
      onClick={onClick}
    >
      <div className="flex">
        <div className="mr-3">
          <div className={`w-12 h-12 ${logoBgClass} flex items-center justify-center rounded`}>
            <span className={`${logoTextSize} font-semibold`}>{job.logo}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold">{job.title}</h3>
            <button className="text-gray-400 dark:text-gray-500 text-xl">×</button>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200">{job.company}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} {job.workMode && `(${job.workMode})`}</p>
          
          {job.responseTime && (
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              <span>Response time is {job.responseTime}</span>
            </div>
          )}
          
          {job.connections && job.connections > 0 && (
            <div className="flex items-center mt-1">
              <div className="flex -space-x-2 mr-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border border-white dark:border-gray-800"></div>
                {job.connections > 1 && <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-500 border border-white dark:border-gray-800"></div>}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{job.connections} connections work here</span>
            </div>
          )}
          
          <div className="mt-2 flex items-center">
            {job.applied && <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Viewed</span>}
            {job.isPromoted && <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">• Promoted</span>}
            {job.hasEasyApply && (
              <span className="text-xs flex items-center">
                <span className="bg-blue-600 dark:bg-blue-700 text-white rounded px-1 mr-1 text-xs">in</span> 
                <span className="text-blue-600 dark:text-blue-400">Easy Apply</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListItem;