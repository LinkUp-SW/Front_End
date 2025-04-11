import React from "react";
import JobListItem from "./JobListItem";
import { Job } from "../../types";

interface JobListProps {
  jobs: Job[];
  selectedJobId: string;
  onSelectJob: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, selectedJobId, onSelectJob }) => {
  return (
    <>
      {/* Top Job Recommendations Header - Fixed */}
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top job picks for you</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your profile, preferences, and activity like applies, searches, and saves</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{jobs.length} results</p>
      </div>
      
      {/* Scrollable Job List */}
      <div className="dark:bg-gray-800">
        {jobs.map((job) => (
          <JobListItem 
            key={job.id} 
            job={job}
            isSelected={selectedJobId === job.id}
            onClick={() => onSelectJob(job)}
          />
        ))}
      </div>
    </>
  );
};

export default JobList;