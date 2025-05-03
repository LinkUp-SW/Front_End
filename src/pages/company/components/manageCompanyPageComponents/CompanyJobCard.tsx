import React, { useState } from 'react';
import { toast } from 'sonner';
import { changeJobStatus } from '@/endpoints/company';

export interface Job {
  _id: string;
  job_title: string;
  job_status: string;
  location: string;
  workplace_type: string;
  experience_level: string;
  posted_time: string;
  applied_applications: Array<unknown>;
}

interface JobCardProps {
  job: Job;
  onViewApplicants: (jobId: string) => void;
  companyId?: string;
  onStatusChanged?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewApplicants, companyId, onStatusChanged }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggleStatus = async () => {
    if (!companyId) {
      toast.error('Company ID is required to change job status');
      return;
    }
    
    try {
      setIsLoading(true);
      const newStatus = job.job_status.toLowerCase() === 'open' ? 'Closed' : 'Open';
      
      await changeJobStatus(job._id, companyId, newStatus);
      
      toast.success(`Job successfully ${newStatus.toLowerCase()}`);
      
      // Refresh the job list if callback is provided
      if (onStatusChanged) {
        onStatusChanged();
      }
    } catch (error) {
      console.error('Failed to change job status:', error);
      toast.error('Failed to update job status');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      id={`job-card-${job._id}`} 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow bg-white dark:bg-gray-800 overflow-hidden"
    >
      <div id={`job-card-header-${job._id}`} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <h3 
          id={`job-title-${job._id}`} 
          className="font-medium text-lg dark:text-white overflow-hidden text-ellipsis line-clamp-2 break-words"
        >
          {job.job_title}
        </h3>
        <span 
          id={`job-status-${job._id}`}
          className={`px-2 py-1 text-xs rounded-full inline-block whitespace-nowrap flex-shrink-0 ${
            job.job_status.toLowerCase() === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
            job.job_status.toLowerCase() === 'closed' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
          }`}
        >
          {job.job_status}
        </span>
      </div>
      
      <div id={`job-details-${job._id}`} className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex flex-wrap items-center">
        <span id={`job-location-${job._id}`} className="max-w-full overflow-hidden text-ellipsis break-words mr-2">
          {job.location}
        </span>
        <span className="hidden sm:inline mx-2 flex-shrink-0">•</span>
        <span id={`job-workplace-type-${job._id}`} className="max-w-full overflow-hidden text-ellipsis break-words mr-2">
          {job.workplace_type}
        </span>
        <span className="hidden sm:inline mx-2 flex-shrink-0">•</span>
        <span id={`job-experience-level-${job._id}`} className="max-w-full overflow-hidden text-ellipsis break-words">
          {job.experience_level}
        </span>
      </div>
      
      <p id={`job-posted-date-${job._id}`} className="text-sm text-gray-500 dark:text-gray-500 mb-3">
        Posted on: {new Date(job.posted_time).toLocaleDateString()}
      </p>
      
      <div id={`job-card-footer-${job._id}`} className="border-t border-gray-100 dark:border-gray-700 pt-3 flex flex-col sm:flex-row sm:justify-between gap-2">
        <button
          id={`job-applicants-btn-${job._id}`}
          onClick={() => onViewApplicants(job._id)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline text-left"
        >
          {job.applied_applications?.length || 0} applicants
        </button>
        <div className="flex space-x-2">
          <button 
            id={`job-toggle-status-btn-${job._id}`}
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`text-sm hover:underline ${
              isLoading ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' :
              job.job_status.toLowerCase() === 'open' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}
          >
            {isLoading ? 'Updating...' : job.job_status.toLowerCase() === 'open' ? 'Close' : 'Open'}
          </button>
        </div>
      </div>
    </div>
  );
};