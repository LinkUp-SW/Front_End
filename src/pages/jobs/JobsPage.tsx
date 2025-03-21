import React, { useState } from 'react';
import { WithNavBar } from '../../components';
import Sidebar from './components/jobsPageComponents/Sidebar';
import TopJobPicks from './components/jobsPageComponents/TopJobsPicks';
import JobCollections from './components/jobsPageComponents/JobCollection';
import RecentSearches from './components/jobsPageComponents/RecentSearches';
import MoreJobs from './components/jobsPageComponents/MoreJobs';
import { SAMPLE_JOBS, MORE_JOBS, RECENT_SEARCHES } from '../../constants/index';
import { Job } from './types';

const JobsPage: React.FC = () => {
  // State for job listings
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [moreJobs, setMoreJobs] = useState<Job[]>(MORE_JOBS);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  
  // Handle job dismissal
  const dismissJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  // Handle more job dismissal
  const dismissMoreJob = (jobId: string) => {
    setMoreJobs(moreJobs.filter(job => job.id !== jobId));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen py-4 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Top job picks section */}
          <TopJobPicks 
            jobs={jobs.slice(0, 3)} 
            onDismissJob={dismissJob} 
          />
          
          {/* Job collections section */}
          <JobCollections 
            jobs={jobs.slice(3, 5)} 
            onDismissJob={dismissJob} 
          />
          
          {/* Recent job searches section */}
          <RecentSearches 
            searches={recentSearches}
            onClear={clearRecentSearches}
          />
          
          {/* More jobs for you section */}
          <MoreJobs 
            jobs={moreJobs} 
            onDismissJob={dismissMoreJob} 
          />
        </div>
      </div>
    </div>
  );
};

export default WithNavBar(JobsPage);