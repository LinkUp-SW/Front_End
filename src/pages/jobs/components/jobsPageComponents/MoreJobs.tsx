import React from 'react';
import JobCard from './JobCard';
import { Job } from '../../types';

interface MoreJobsProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
}

const MoreJobs: React.FC<MoreJobsProps> = ({ jobs, onDismissJob }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">More jobs for you</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your profile, preferences, and activity like applies, searches, and saves</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
        ))}
      </div>
    </div>
  );
};

export default MoreJobs;