import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import JobCard from "./JobCard";
import { Job } from "../../types";
import { JOB_COLLECTIONS } from "../../../../constants/index";

interface JobCollectionsProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
}

const JobCollections: React.FC<JobCollectionsProps> = ({ jobs, onDismissJob }) => {
  const [activeTab, setActiveTab] = useState("Easy Apply");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore with job collections</h2>
      </div>

      {/* Job Categories */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {JOB_COLLECTIONS.map((collection) => (
          <button
            key={collection.id}
            onClick={() => setActiveTab(collection.title)}
            className={`flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 font-medium border-b-2 
              ${activeTab === collection.title ? "border-black dark:border-white" : "border-transparent"} 
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
              {React.createElement(collection.icon, { className: "text-gray-600 dark:text-gray-400", size: 20 })}
            </div>
            <span>{collection.title}</span>
          </button>
        ))}
      </div>

      {/* Job Listings */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
        ))}
      </div>

      {/* Show All Button */}
      <div className="p-4 flex justify-center">
        <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Show all <FaArrowRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

export default JobCollections;