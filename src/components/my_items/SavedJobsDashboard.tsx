import React, { useEffect, useState } from 'react';
import { Job } from '../../pages/jobs/types';
import { fetchSavedJobs, removeFromSaved, convertJobDataToJob } from '../../endpoints/jobs';
import Cookies from 'js-cookie';
import { MdClose } from 'react-icons/md';

enum TabState {
  SAVED = 'saved',
  IN_PROGRESS = 'in-progress',
  APPLIED = 'applied',
  ARCHIVED = 'archived'
}

const SavedJobsDashboard: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabState>(TabState.SAVED);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('linkup_auth_token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      const jobsData = await fetchSavedJobs();
      const jobs = jobsData.map(jobData => convertJobDataToJob(jobData));
      setSavedJobs(jobs);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
    
    // Set up event listener for job updates
    const handleJobsUpdated = () => {
      loadSavedJobs();
    };
    
    window.addEventListener('savedJobsUpdated', handleJobsUpdated);
    
    return () => {
      window.removeEventListener('savedJobsUpdated', handleJobsUpdated);
    };
  }, []);

  const handleRemoveFromSaved = async (jobId: string) => {
    try {
      await removeFromSaved(jobId);
      
      // Update local state
      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('savedJobsUpdated'));
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('Failed to remove job from saved jobs');
    }
  };

  const handleTabChange = (tab: TabState) => {
    setActiveTab(tab);
    // Here you would fetch the appropriate jobs for the selected tab
    // For now we only have implementation for saved jobs
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <p className="text-red-500">{error}</p>
          {error === 'Authentication required' && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Please log in to view your saved jobs.
            </p>
          )}
        </div>
      );
    }

    if (activeTab === TabState.SAVED && savedJobs.length === 0) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <img 
              src={isDarkMode ? '/src/assets/no-saved-jobs-dark.svg' : '/src/assets/no-saved-jobs-light.svg'} 
              alt="No saved jobs" 
              className="w-48 h-48 mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400 text-2xl">No recent job activity.</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse jobs and click "Save" to add them here.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <div key={job.id} className="border-t pt-4">
            <div className="flex justify-between">
              <div className="flex">
                <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center overflow-hidden">
                  {job.logo ? (
                    <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 bg-orange-500 rounded-full transform translate-y-1/4"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-300">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posted {job.postedTime} • {job.hasEasyApply && <span className="text-blue-600 dark:text-blue-400">Easy Apply</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleRemoveFromSaved(job.id!)}
                  title="Remove from saved"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">My Jobs</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            className={`px-4 py-1 rounded-full ${activeTab === TabState.SAVED ? 'bg-green-700 text-white' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200'}`}
            onClick={() => handleTabChange(TabState.SAVED)}
          >
            Saved
          </button>
          <button 
            className={`px-4 py-1 rounded-full ${activeTab === TabState.IN_PROGRESS ? 'bg-green-700 text-white' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200'}`}
            onClick={() => handleTabChange(TabState.IN_PROGRESS)}
          >
            In Progress
          </button>
          <button 
            className={`px-4 py-1 rounded-full ${activeTab === TabState.APPLIED ? 'bg-green-700 text-white' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200'}`}
            onClick={() => handleTabChange(TabState.APPLIED)}
          >
            Applied
          </button>
          <button 
            className={`px-4 py-1 rounded-full ${activeTab === TabState.ARCHIVED ? 'bg-green-700 text-white' : 'bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200'}`}
            onClick={() => handleTabChange(TabState.ARCHIVED)}
          >
            Archived
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default SavedJobsDashboard;