import React from "react";
import JobListItem from "./JobListItem";
import { Job } from "../../types";

interface JobListProps {
  jobs: Job[];
  selectedJobId: string;
  onSelectJob: (job: Job) => void;
  isLoading?: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, selectedJobId, onSelectJob, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array(5).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="p-4 animate-pulse">
            <div className="flex">
              <div className="mr-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Top Job Recommendations Header - Fixed */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
        <h2 className="text-lg font-semibold dark:text-white">Top job picks for you</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Based on your profile, preferences, and activity
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {jobs.length} results
        </p>
      </div>
      
      {/* Scrollable Job List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobListItem 
              key={job.id}
              job={job}
              isSelected={job.id === selectedJobId}
              onClick={() => onSelectJob(job)}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="mb-3 text-gray-400 dark:text-gray-500">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No jobs match your current filters</p>
          </div>
        )}
      </div>
    </>
  );
};

export default JobList;