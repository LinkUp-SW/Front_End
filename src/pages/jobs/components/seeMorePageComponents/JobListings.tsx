import React, { useState, useMemo , useEffect} from "react";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import Pagination from "./Pagination";
import { Job, JobFilters } from "../../types";
import { FOOTER_LINKS } from '../../../../constants/index';
import { FaSortDown } from "react-icons/fa6";

interface JobListingsProps {
  filters: JobFilters;
}

const JobListings: React.FC<JobListingsProps> = ({ filters }) => {
  const allJobs: Job[] = [
    {
      id: "1",
      title: "Senior Software Product Owner (Fintech)",
      company: "Arib",
      location: "Cairo, Egypt",
      isRemote: false,
      isSaved: false,
      logo: "A",
      isPromoted: true,
      hasEasyApply: true,
      applied: false,
      verified: true,
      workMode: "On-site",
      reviewTime: "typically 6 days",
      responseTime: "typically 6 days",
      postedTime: "1 week ago",
      connections: 0,
      experience_level: "Mid-Senior level", 
      salary: "5000-10000",
      description: "Detailed job description would go here", 
      qualifications: "Required qualifications", 
      responsibilities: "Key job responsibilities",
      benefits: "Company benefits"
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
      workMode: "On-site",
      experience_level: "Entry level", 
      salary: "1000-5000",
      description: "Detailed job description would go here"
    },
    {
      id: "3",
      title: "Product Development Team Leader",
      company: "e& Egypt",
      location: "United States",
      isRemote: true,
      isSaved: false,
      logo: "e&",
      isPromoted: true,
      hasEasyApply: true,
      connections: 7,
      workMode: "Remote",
      experience_level: "Mid-Senior level",
      salary: "10000+",
      description: "Detailed job description would go here"
    },
    {
      id: "4",
      title: "Senior Technology Project Manager",
      company: "Cleopatra Hospitals Group",
      location: "Saudi Arabia",
      isRemote: false,
      isSaved: false,
      logo: "CHG",
      isPromoted: false,
      hasEasyApply: true,
      connections: 1,
      workMode: "Hybrid",
      experience_level: "Associate", 
      salary: "5000-10000",
      description: "Detailed job description would go here"
    }
  ];

  // Filtered jobs based on selected filters
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Location filter 
      const matchesLocations = filters.locations.length === 0 || 
        filters.locations.some(loc => 
          job.location.toLowerCase().includes(loc.toLowerCase())
        );
      
      // Company filter 
      const matchesCompany = filters.company.length === 0 || 
        filters.company.some(type => 
          job.company.toLowerCase().includes(type.toLowerCase())
        );
      
      // Experience level filter
      const matchesExperienceLevels = filters.experienceLevels.length === 0 || 
        filters.experienceLevels.includes(job.experience_level);
      
      // Work mode filter
      const matchesWorkModes = filters.workModes.length === 0 || 
        filters.workModes.includes(job.workMode);
      
      // Salary range filter
      const matchesSalaryRanges = filters.salaryRanges.length === 0 || 
        filters.salaryRanges.includes(job.salary);
      
      return matchesLocations && 
             matchesCompany && 
             matchesExperienceLevels && 
             matchesWorkModes && 
             matchesSalaryRanges;
    });
  }, [allJobs, filters]);

   // Smart job selection logic
   const [selectedJob, setSelectedJob] = useState<Job | null>(null);

   // Effect to manage job selection when filtered jobs change
   useEffect(() => {
     if (filteredJobs.length > 0) {
       // If the previously selected job is in the filtered list, keep it
       if (selectedJob && filteredJobs.some(job => job.id === selectedJob.id)) {
         return;
       }
       
       // Otherwise, select the first job in the filtered list
       setSelectedJob(filteredJobs[0]);
     } else {
       // If no jobs match the filter, set selected job to null
       setSelectedJob(null);
     }
   }, [filteredJobs]);
 
   const [currentPage, setCurrentPage] = useState(1);
   const totalPages = Math.ceil(filteredJobs.length / 10); // Assuming 10 jobs per page
 

  return (
    <div className="min-h-screen pt-12 overflow-hidden ">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700" style={{ maxHeight: "100vh" }}>
          <JobList 
            jobs={filteredJobs} 
            selectedJobId={selectedJob?.id|| ''} 
            onSelectJob={setSelectedJob} 
          />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
          <div className="mt-6 text-xs text-gray-600 dark:text-gray-400 p-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((link, index) => (
                <span key={index} className="cursor-pointer hover:underline flex items-center dark:text-gray-400 dark:hover:text-gray-300">
                  {link.text} {link.hasArrow && <FaSortDown size={12} />}
                </span>
              ))}
            </div>
            
            <div className="mt-2 flex justify-center items-center">
              <img className="w-5 h-5" src="/link_up_logo.png" alt="LinkUp Logo"></img>
              <span className="ml-2">LinkUp Corporation © 2025</span>
            </div>
          </div>
        </div>

        {/* Job Details Component */}
        <div className="w-full md:w-2/3 overflow-y-auto bg-white dark:bg-gray-900" style={{ maxHeight: "100vh" }}>
          {selectedJob ? (
            <JobDetail job={selectedJob} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No jobs match the current filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings