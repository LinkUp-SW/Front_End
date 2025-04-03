import React from 'react';
import JobCard from './JobCard';
import { Job } from '../../types';
import { FaSpinner } from 'react-icons/fa';

interface MoreJobsProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const MoreJobs: React.FC<MoreJobsProps> = ({ 
  jobs, 
  onDismissJob, 
  loading = false,
  hasMore = false,
  onLoadMore
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">More jobs for you</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your profile, preferences, and activity like applies, searches, and saves</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No jobs found. Check back later!</p>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="p-4 text-center">
          <FaSpinner className="animate-spin mx-auto text-blue-500 text-2xl mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Loading more jobs...</p>
        </div>
      )}
      
      {(!hasMore && jobs.length > 0) && (
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">No more jobs to load</p>
        </div>
      )}
      
      {(hasMore && jobs.length > 0 && !loading) && (
        <div className="p-4 text-center">
          <button 
            onClick={onLoadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md cursor-pointer"
          >
            Load more jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default MoreJobs;