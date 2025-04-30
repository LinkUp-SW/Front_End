import React from 'react';

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
  onEdit: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  return (
    <div 
      id={`job-card-${job._id}`} 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow bg-white dark:bg-gray-800"
    >
      <div id={`job-card-header-${job._id}`} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <h3 id={`job-title-${job._id}`} className="font-medium text-lg dark:text-white">{job.job_title}</h3>
        <span 
          id={`job-status-${job._id}`}
          className={`px-2 py-1 text-xs rounded-full inline-block w-fit ${
            job.job_status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
            job.job_status === 'Closed' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
          }`}
        >
          {job.job_status}
        </span>
      </div>
      
      <div id={`job-details-${job._id}`} className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex flex-wrap items-center">
        <span id={`job-location-${job._id}`} className="mr-2">{job.location}</span>
        <span className="hidden sm:inline mx-2">•</span>
        <span id={`job-workplace-type-${job._id}`} className="mr-2">{job.workplace_type}</span>
        <span className="hidden sm:inline mx-2">•</span>
        <span id={`job-experience-level-${job._id}`}>{job.experience_level}</span>
      </div>
      
      <p id={`job-posted-date-${job._id}`} className="text-sm text-gray-500 dark:text-gray-500 mb-3">
        Posted on: {new Date(job.posted_time).toLocaleDateString()}
      </p>
      
      <div id={`job-card-footer-${job._id}`} className="border-t border-gray-100 dark:border-gray-700 pt-3 flex flex-col sm:flex-row sm:justify-between gap-2">
        <span id={`job-applicants-count-${job._id}`} className="text-sm dark:text-gray-400">
          {job.applied_applications?.length || 0} applicants
        </span>
        <div className="flex space-x-2">
          <button 
            id={`job-edit-btn-${job._id}`}
            className="text-red-600 dark:text-red-400 text-sm hover:underline"
            onClick={() => onEdit(job._id)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};