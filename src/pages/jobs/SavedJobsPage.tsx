// SavedJobsPage.tsx
import React, { useEffect, useState } from 'react';
import { WithNavBar } from '../../components';
import { FaBookmark } from "react-icons/fa";
import { Job } from './types';

// Left Sidebar Component
const LeftSidebar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="font-medium text-gray-700 dark:text-gray-200 mb-4 flex items-center">
        <FaBookmark className="mr-2" /> 
        <span>My items</span>
      </h2>
      
      <div className="mt-2">
        <div className="flex justify-between items-center py-2 border-l-4 border-blue-500 pl-2">
          <span className="text-blue-600 dark:text-blue-400">My jobs</span>
          <span className="text-blue-600 dark:text-blue-400 text-sm">248</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 dark:text-gray-400">Saved posts and articles</span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">10+</span>
        </div>
      </div>
    </div>
  );
};

// Jobs Dashboard Component
const JobsDashboard: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Load saved jobs from localStorage
    const loadSavedJobs = () => {
      const savedJobsString = localStorage.getItem('savedJobs');
      if (savedJobsString) {
        try {
          const jobs = JSON.parse(savedJobsString);
          setSavedJobs(jobs);
        } catch (error) {
          console.error('Error parsing saved jobs:', error);
        }
      }
    };

    loadSavedJobs();
    
    // Set up event listener for job updates
    window.addEventListener('savedJobsUpdated', loadSavedJobs);
    
    return () => {
      window.removeEventListener('savedJobsUpdated', loadSavedJobs);
    };
  }, []);

  const removeFromSaved = (jobId: string) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    setSavedJobs(updatedJobs);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('savedJobsUpdated'));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">My Jobs</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="bg-green-700 text-white px-4 py-1 rounded-full">Saved</button>
          <button className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1 rounded-full text-gray-800 dark:text-gray-200">In Progress</button>
          <button className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1 rounded-full text-gray-800 dark:text-gray-200">Applied</button>
          <button className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1 rounded-full text-gray-800 dark:text-gray-200">Archived</button>
        </div>
        
        {savedJobs.length > 0 ? (
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
                        Posted {job.postedTime || job.timePosted} • <span className="text-blue-600 dark:text-blue-400">Easy Apply</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <button 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => removeFromSaved(job.id)}
                    >
                      •••
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t pt-6 pb-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">No saved jobs yet.</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse jobs and click "Save" to add them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Interview Tips Panel Component
const InterviewTipsPanel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
        Noha, learn what hiring managers look for in answers to top interview questions
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt="Professional headshot" className="w-12 h-12 rounded-full" />
          <p className="ml-3 text-gray-800 dark:text-gray-200">Tell me about something you've accomplished that you are proud of.</p>
        </div>
        
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt="Professional headshot" className="w-12 h-12 rounded-full" />
          <p className="ml-3 text-gray-800 dark:text-gray-200">Where do you see yourself in 5 years?</p>
        </div>
        
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt="Professional headshot" className="w-12 h-12 rounded-full" />
          <p className="ml-3 text-gray-800 dark:text-gray-200">Tell me about yourself.</p>
        </div>
      </div>
      
      <button className="w-full mt-4 text-center py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
        See all questions
      </button>
    </div>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium mb-2">About</h3>
            <ul className="space-y-2">
              <li>Professional Community Policies</li>
              <li>Privacy & Terms</li>
              <li>Sales Solutions</li>
              <li>Safety Center</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Accessibility</h3>
            <ul className="space-y-2">
              <li>Careers</li>
              <li>Ad Choices</li>
              <li>Mobile</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Talent Solutions</h3>
            <ul className="space-y-2">
              <li>Marketing Solutions</li>
              <li>Advertising</li>
              <li>Small Business</li>
            </ul>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Questions?</h3>
              <p className="text-sm">Visit our Help Center.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-1">Manage your account and privacy</h3>
              <p className="text-sm">Go to your Settings.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Recommendation transparency</h3>
              <p className="text-sm">Learn more about Recommended Content.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center sm:text-left">
          <p>LinkUp Corporation © 2025</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const SavedJobsPage: React.FC = () => {
  return (
    <div className="min-h-screen  dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <LeftSidebar />
          </div>
          
          <div className="md:col-span-6">
            <JobsDashboard />
          </div>
          
          <div className="md:col-span-3">
            <InterviewTipsPanel />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WithNavBar(SavedJobsPage);