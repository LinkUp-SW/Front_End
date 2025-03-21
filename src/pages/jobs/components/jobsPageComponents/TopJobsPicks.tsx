import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6"
import JobCard from './JobCard';
import { Job } from '../../types';

interface TopJobPicksProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
}

const TopJobPicks: React.FC<TopJobPicksProps> = ({ jobs, onDismissJob }) => {
  const navigate = useNavigate(); // Initialize navigation function

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top job picks for you</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your profile, preferences, and activity like applies, searches, and saves</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
        ))}
      </div>
      
      <div className="p-4 flex justify-center">
        <button 
          onClick={() => navigate("/collections")} 
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Show all <FaArrowRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopJobPicks;