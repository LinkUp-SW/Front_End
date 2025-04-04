import React from "react";
import JobHeader from "./JobHeader";
import JobContent from "./JobContent";
import { Job } from "../../types";

interface JobDetailProps {
  job: Job;
  isLoading?: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <JobHeader job={job} />
      <JobContent job={job} />
      
      {/* About the company section */}
      <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">About the company</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {job.logo && job.logo.startsWith('http') ? (
              <img 
                src={job.logo} 
                alt={`${job.company} logo`} 
                className="w-10 h-10 object-contain bg-white dark:bg-gray-700 rounded-md p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.appendChild(document.createTextNode(job.company.substring(0, 1)));
                    parent.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-500', 'dark:text-blue-300', 'flex', 'items-center', 'justify-center');
                  }
                }}
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                style={{ backgroundColor: `hsl(${job.company.charCodeAt(0) % 360}, 70%, 50%)` }}
              >
                <span className="font-semibold">{job.company.substring(0, 2)}</span>
              </div>
            )}
            <div>
              <h3 className="font-medium dark:text-white">{job.company}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.companyInfo?.followers || "10,000+"} followers
              </p>
            </div>
          </div>
          
          <button className="border rounded-full px-4 py-1 flex items-center gap-2 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 text-sm">
            + Follow
          </button>
        </div>
        
        <div className="text-sm text-gray-700 dark:text-gray-400 mb-3">
          {job.companyInfo?.industryType || "Information Technology"} • 
          {job.companyInfo?.employeeCount || "51-200 employees"} • 
          {job.companyInfo?.linkupPresence || "100+ on LinkUp"}
        </div>
        
        <p className="text-sm mb-2 text-gray-700 dark:text-gray-400">
          {job.companyInfo?.description || 
           "A growing company focused on innovation and excellence in their field."}
        </p>
        <button className="block w-full text-center border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-full py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            Show more
        </button>
      </div>
    </div>
  );
};

export default JobDetail;