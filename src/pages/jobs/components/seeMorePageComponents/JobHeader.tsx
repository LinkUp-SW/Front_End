import React, { useState, useEffect } from "react";
import { Job } from "../../types";
import Cookies from 'js-cookie';

interface JobHeaderProps {
  job: Job;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState<boolean>(job.isSaved || false);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if this job is already saved in localStorage
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

  const handleSaveJob = async () => {
    setSaveInProgress(true);
    
    // Get existing saved jobs from localStorage
    const savedJobsString = localStorage.getItem('savedJobs');
    let savedJobs: Job[] = [];
    
    if (savedJobsString) {
      try {
        savedJobs = JSON.parse(savedJobsString);
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
      }
    }
    
    // Try to update on backend if user has authentication
    const token = Cookies.get('linkup_auth_token');
    if (token) {
      try {
        // Example API call to save/unsave job
        // const response = await (isSaved ? unsaveJob(token, job.id) : saveJob(token, job.id));
        // If backend call succeeds, update local state
      } catch (error) {
        console.error('Error updating saved job status:', error);
        // Continue with local storage update even if backend fails
      }
    }
    
    // Update localStorage regardless of backend result
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
    setSaveInProgress(false);
  };

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{job.company}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Get job alerts"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.4-1.4c-.6-.6-1-1.4-1-2.3V9c0-3.1-2.2-5.7-5.2-6.3v-.6c0-1.2-1-2.1-2.1-2.1S9 .9 9 2.1v.6C5.9 3.3 3.7 6 3.7 9v4.3c0 .9-.4 1.7-1 2.3L1.3 17h5"/>
              <path d="M10 19a2 2 0 1 0 4 0"/>
            </svg>
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="More options"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-white">{job.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {job.location} · {job.postedTime}
        {job.salary && job.salary !== "Not disclosed" && (
          <span className="ml-1">· {job.salary}</span>
        )}
      </p>
      
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {job.workMode && (
          <div className="flex items-center text-green-700 dark:text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md text-xs">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span>{job.workMode}</span>
          </div>
        )}
        {job.experience_level && (
          <div className="flex items-center text-blue-700 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-xs">
            <span>{job.experience_level}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {job.hasEasyApply && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 md:px-6 rounded-full flex items-center text-sm font-medium transition-colors">
            <span className="bg-white text-blue-600 rounded px-1 mr-2 text-xs">in</span>
            <span>Easy Apply</span>
          </button>
        )}
        <button
          disabled={saveInProgress}
          className={`
            py-2 px-4 md:px-6 rounded-full text-sm font-medium transition-colors flex items-center
            ${saveInProgress ? "opacity-70 cursor-not-allowed" : ""}
            ${isSaved 
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700" 
              : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}
          `}
          onClick={handleSaveJob}
        >
          {saveInProgress ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              {isSaved ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  Save
                </>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default JobHeader;