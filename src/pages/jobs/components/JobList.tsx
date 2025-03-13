import React from "react";
import JobListItem from "./JobListItem";
import { Job } from "../types";

interface JobListProps {
  jobs: Job[];
  selectedJobId: string;
  onSelectJob: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, selectedJobId, onSelectJob }) => {
  return (
    <>
      {/* Top Job Recommendations Header - Fixed */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <h2 className="text-xl font-bold">Top job picks for you</h2>
        <p className="text-sm text-gray-600">Based on your profile, preferences, and activity like applies, searches, and saves</p>
        <p className="text-sm text-gray-500 mt-1">{jobs.length} results</p>
      </div>
      
      {/* Scrollable Job List */}
      <div>
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