import React from "react";
import JobHeader from "./JobHeader";
import JobContent from "./JobContent";
import { Job } from "../types";

interface JobDetailProps {
  job: Job;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  // Initialize company info if not provided
  if (!job.companyInfo) {
    job.companyInfo = {
      name: job.company,
      logo: job.logo,
      followers: "235,014",
      industryType: "IT Services and IT Consulting",
      employeeCount: "201-500 employees",
      linkedInPresence: "218 on LinkedIn",
      description: "We are a global team who's passionate about transformative enterprise solutions & intelligent design."
    };
  }

  return (
    <div className="p-4 md:p-6">
      <JobHeader job={job} />
      <JobContent job={job} />
      
      {/* About the company section */}
      <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">About the company</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={job.companyInfo.logo || "/placeholder-logo.png"} 
              alt={`${job.companyInfo.name} logo`} 
              className="w-8 h-8 object-contain bg-white dark:bg-gray-700 rounded-md"
            />
            <div>
              <h3 className="font-medium dark:text-white">{job.companyInfo.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.companyInfo.followers} followers</p>
            </div>
          </div>
          
          <button className="border rounded-full px-4 py-1 flex items-center gap-2 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            Following
          </button>
        </div>
        
        <div className="text-sm text-gray-700 dark:text-gray-400 mb-3">
          {job.companyInfo.industryType} • {job.companyInfo.employeeCount} • {job.companyInfo.linkedInPresence}
        </div>
        
        <p className="text-sm mb-2 text-gray-700 dark:text-gray-400">{job.companyInfo.description}</p>
        
        <div className="text-center mt-4">
          <button className="text-blue-600 dark:text-blue-400 font-medium">Show more</button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;