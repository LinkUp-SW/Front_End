// src/pages/SeeMorePage/components/JobListings/JobListItem.tsx
import React from "react";
import { Job } from "../types";

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
        return "bg-blue-100 text-blue-500";
      case "EFG Holding":
        return "bg-green-800 text-white";
      case "e& Egypt":
        return "bg-red-100 text-red-500";
      case "Cleopatra Hospitals Group":
        return "bg-teal-100 text-teal-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const logoBgClass = getLogoBgColor(job.company);
  const logoTextSize = job.logo.length > 1 ? "text-xs" : "text-lg";
  
  return (
    <div 
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${isSelected ? 'border-l-4 border-l-blue-500' : ''}`}
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
            <h3 className="text-blue-600 font-semibold">{job.title}</h3>
            <button className="text-gray-400 text-xl">×</button>
          </div>
          <p className="text-sm text-gray-800">{job.company}</p>
          <p className="text-sm text-gray-500">{job.location} {job.workMode && `(${job.workMode})`}</p>
          
          {job.responseTime && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              <span>Response time is {job.responseTime}</span>
            </div>
          )}
          
          {job.connections && job.connections > 0 && (
            <div className="flex items-center mt-1">
              <div className="flex -space-x-2 mr-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                {job.connections > 1 && <div className="w-6 h-6 rounded-full bg-gray-400 border border-white"></div>}
              </div>
              <span className="text-sm text-gray-500">{job.connections} connections work here</span>
            </div>
          )}
          
          <div className="mt-2 flex items-center">
            {job.applied && <span className="text-xs text-gray-500 mr-2">Viewed</span>}
            {job.isPromoted && <span className="text-xs text-gray-500 mr-2">• Promoted</span>}
            {job.hasEasyApply && (
              <span className="text-xs flex items-center">
                <span className="bg-blue-600 text-white rounded px-1 mr-1 text-xs">in</span> 
                <span className="text-blue-600">Easy Apply</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListItem;