// src/pages/SeeMorePage/components/JobListings/index.tsx
import React, { useState } from "react";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import Pagination from "./Pagination";
import { Job } from "../types";
import { FOOTER_LINKS } from '../../../constants/index';
import { FaSortDown } from "react-icons/fa6";


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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8; // Based on the image showing pagination from 1-8



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

        {/* Feedback Section */}
          <div className="p-4 border-t">
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-1">Are these results helpful?</h3>
                <p className="text-sm text-gray-600">Your feedback helps us improve job recommendations.</p>
              </div>
              <div className="flex gap-2">
                <button className="border rounded-md p-2 hover:bg-gray-50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 21l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm0 12l-4.34 4.34L12 14H3v-2l3-7h9v10zm4-12h4v12h-4z"/>
                  </svg>
                </button>
                <button className="border rounded-md p-2 hover:bg-gray-50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59c-.36.36-.58.86-.58 1.41v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z"/>
                  </svg>
                </button>
              </div>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            {/* Footer Links */}
                  <div className="mt-6 text-xs text-gray-600">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {FOOTER_LINKS.map((link, index) => (
                        <span key={index} className="cursor-pointer hover:underline flex items-center">
                          {link.text} {link.hasArrow && <FaSortDown  size={12} />}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex justify-center items-center">
                      <img className="w-5 h-5" src="/link_up_logo.png"></img>
                      <span className="ml-2">LinkUp Corporation © 2025</span>
                    </div>
                  </div>

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