// src/pages/SeeMorePage/components/JobListings/index.tsx
import React, { useState } from "react";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import { Job } from "../types";

const JobListings: React.FC = () => {
  // Sample job data with enhanced details
  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Software Product Owner (Fintech)",
      company: "Arib",
      location: "Qesm 1st Nasser City, Cairo, Egypt",
      isRemote: false,
      isSaved: false,
      logo: "A",
      isPromoted: true,
      hasEasyApply: true,
      applied: false,
      verified: true,
      workMode: "On-site",
      timePosted: "1 week ago",
      reviewTime: "typically 6 days",
      responseTime: "typically 6 days",
      postedTime: "1 week ago",
      connections: 0
    },
    {
      id: "2",
      title: "Corporate (Senior) Product Owner",
      company: "EFG Holding",
      location: "Cairo, Egypt",
      isRemote: false,
      isSaved: false,
      logo: "E",
      isPromoted: true,
      hasEasyApply: true,
      connections: 2,
      workMode: "On-site"
    },
    {
      id: "3",
      title: "Product Development Team Leader",
      company: "e& Egypt",
      location: "Cairo, Egypt",
      isRemote: true,
      isSaved: false,
      logo: "e&",
      isPromoted: true,
      hasEasyApply: true,
      connections: 7,
      workMode: "Hybrid"
    },
    {
      id: "4",
      title: "Senior Technology Project Manager",
      company: "Cleopatra Hospitals Group",
      location: "Cairo, Egypt",
      isRemote: false,
      isSaved: false,
      logo: "CHG",
      isPromoted: false,
      hasEasyApply: true,
      connections: 1,
      workMode: "On-site"
    }
  ];

  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]); // Default selected job

  return (
    <div className="min-h-screen pt-12 overflow-hidden">
      {/* Container with max width and centered */}
      <div className="max-w-6xl mx-auto bg-white flex flex-col md:flex-row">
        {/* Job List Component */}
        <div className="w-full md:w-1/3 overflow-y-auto" style={{ maxHeight: "100vh" }}>
          <JobList 
            jobs={jobs} 
            selectedJobId={selectedJob.id} 
            onSelectJob={setSelectedJob} 
          />
        </div>
        
        {/* Job Details Component */}
        <div className="w-full md:w-2/3 overflow-y-auto" style={{ maxHeight: "100vh" }}>
          <JobDetail job={selectedJob} />
        </div>
      </div>
    </div>
  );
};

export default JobListings;