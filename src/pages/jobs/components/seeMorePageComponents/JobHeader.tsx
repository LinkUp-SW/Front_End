import React, { useState, useEffect } from "react";
import { Job } from "../../types";

interface JobHeaderProps {
  job: Job;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if this job is already saved
    const savedJobsString = localStorage.getItem('savedJobs');
    if (savedJobsString) {
      try {
        const savedJobs = JSON.parse(savedJobsString);
        const alreadySaved = savedJobs.some((savedJob: Job) => savedJob.id === job.id);
        setIsSaved(alreadySaved);
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
      }
    }
  }, [job.id]);

  const handleSaveJob = () => {
    // Get existing saved jobs
    const savedJobsString = localStorage.getItem('savedJobs');
    let savedJobs: Job[] = [];
    
    if (savedJobsString) {
      try {
        savedJobs = JSON.parse(savedJobsString);
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
      }
    }
    
    if (isSaved) {
      // Remove job from saved jobs
      savedJobs = savedJobs.filter(savedJob => savedJob.id !== job.id);
      setIsSaved(false);
    } else {
      // Add job to saved jobs if it's not already there
      const isAlreadySaved = savedJobs.some(savedJob => savedJob.id === job.id);
      if (!isAlreadySaved) {
        savedJobs.push(job);
      }
      setIsSaved(true);
    }
    
    // Save updated list back to localStorage
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('savedJobsUpdated'));
  };

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{job.company}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3h2v10h-2V3zm0 12h2v2h-2v-2z"/>
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-white">{job.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {job.location} · {job.postedTime || job.timePosted}
      </p>
      
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {job.workMode && (
          <div className="flex items-center text-green-700 dark:text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md text-sm">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span>{job.workMode}</span>
          </div>
        )}
        <div className="text-sm text-gray-600 dark:text-gray-400">0 of 10 skills match</div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 md:px-6 rounded-full flex items-center text-sm font-medium transition-colors">
          <span className="bg-white text-blue-600 rounded px-1 mr-2 text-xs">in</span>
          <span>Easy Apply</span>
        </button>
        <button 
          className={`
            py-2 px-4 md:px-6 rounded-full text-sm font-medium transition-colors
            ${isSaved 
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700" 
              : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}
          `}
          onClick={handleSaveJob}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </>
  );
};

export default JobHeader;