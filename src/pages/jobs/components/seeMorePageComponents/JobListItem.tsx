import React from "react";
import { Job } from "../../types";

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, isSelected, onClick }) => {
  return (
    <div 
      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:bg-gray-900
        ${isSelected ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-gray-50 dark:bg-gray-700' : ''}`}
      onClick={onClick}
      data-testid={`job-item-${job.id}`}
      id={`job-list-item-${job.id}`}
    >
      <div className="flex items-start">
        <div className="mr-3">
          {job.logo && job.logo.startsWith('http') ? (
            <img 
              src={job.logo} 
              alt={`${job.company} logo`} 
              className="w-12 h-12 object-contain bg-white dark:bg-gray-800 rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                {job.company.substring(0, 2)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold">{job.title}</h3>
            {job.isSaved && (
              <span className="text-yellow-500 dark:text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                </svg>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200">{job.company}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {job.location} {job.workMode  && `• ${job.workMode}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{job.postedTime}</p>
          
          <div className="mt-2 flex items-center">
            {job.applied && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded mr-2">
                Applied
              </span>
            )}
            {job.isPromoted && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded mr-2">
                Promoted
              </span>
            )}
            {job.hasEasyApply && (
              <span className="text-xs flex items-center">
                <span className="bg-blue-600 dark:bg-blue-700 text-white rounded px-1 mr-1 text-xs">Up</span> 
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