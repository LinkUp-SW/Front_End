import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import JobCard from './JobCard';
import { Job } from '../../types';

interface TopJobPicksProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
  loading?: boolean;
}

const TopJobPicks: React.FC<TopJobPicksProps> = ({ jobs, onDismissJob, loading = false }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top job picks for you</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your profile, preferences, and activity like applies, searches, and saves</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          // Display loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
            No top job picks available at the moment.
          </div>
        )}
      </div>
      
      <div className="p-4 flex justify-center">
        <button 
          onClick={() => navigate("/jobs/see-more")} 
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Show all <FaArrowRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopJobPicks;