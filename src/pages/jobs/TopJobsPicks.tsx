import React from 'react';
import { FaArrowRight } from "react-icons/fa6"
import JobCard from './JobCard';
import { Job } from './JobInterfaces';

interface TopJobPicksProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
}

const TopJobPicks: React.FC<TopJobPicksProps> = ({ jobs, onDismissJob }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4">
        <h2 className="text-xl font-bold">Top job picks for you</h2>
        <p className="text-sm text-gray-600">Based on your profile, preferences, and activity like applies, searches, and saves</p>
      </div>
      
      <div className="divide-y">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
        ))}
      </div>
      
      <div className="p-4 flex justify-center">
        <button className="flex items-center text-gray-600 hover:text-blue-600">
          Show all <FaArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopJobPicks;