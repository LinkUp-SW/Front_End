import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import JobCard from "./JobCard";
import { Job } from "../types";
import { JOB_COLLECTIONS } from "../../../constants/index";

interface JobCollectionsProps {
  jobs: Job[];
  onDismissJob: (id: string) => void;
}

const JobCollections: React.FC<JobCollectionsProps> = ({ jobs, onDismissJob }) => {
  const [activeTab, setActiveTab] = useState("Easy Apply");

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4">
        <h2 className="text-xl font-bold">Explore with job collections</h2>
      </div>

      {/* Job Categories */}
      <div className="flex border-b">
        {JOB_COLLECTIONS.map((collection) => (
          <button
            key={collection.id}
            onClick={() => setActiveTab(collection.title)}
            className={`flex items-center gap-2 px-4 py-3 text-gray-700 font-medium border-b-2 
              ${activeTab === collection.title ? "border-black" : "border-transparent"} 
              hover:bg-gray-100 transition`}
          >
            <div className="p-2 bg-gray-100 rounded">
              {React.createElement(collection.icon, { className: "text-gray-600", size: 20 })}
            </div>
            <span>{collection.title}</span>
          </button>
        ))}
      </div>

      {/* Job Listings */}
      <div className="divide-y">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onDismiss={onDismissJob} />
        ))}
      </div>

      {/* Show All Button */}
      <div className="p-4 flex justify-center">
        <button className="flex items-center text-gray-600 hover:text-blue-600">
          Show all <FaArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default JobCollections;
