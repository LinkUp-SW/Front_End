import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface JobsComponentProps {
  companyId?: string;
  companyName?: string;
}

// Define job status types for type safety
type JobStatus = 'open' | 'draft' | 'inReview' | 'paused' | 'closed';

const CompanyJobsComponent: React.FC<JobsComponentProps> = ({ companyId, companyName = "Your Company" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<JobStatus>('open');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Record<JobStatus, any[]>>({
    open: [],
    draft: [],
    inReview: [],
    paused: [],
    closed: []
  });

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) return;
      
      try {
        setIsLoading(true);
        // This would be replaced with your actual API call
        // const response = await getCompanyJobs(companyId);
        // setJobs(response.jobs);
        
        // For now, we'll just simulate empty states
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        toast.error('Failed to load job listings');
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  const handlePostJob = () => {
    // Navigate to the job posting form page
    if (!companyId) {
      toast.error('Company ID is required to post a job');
      return;
    }
    
    // Navigate to the job posting form with company ID
    navigate(`/company-manage/:companyId/jobs/create`);
  };

  // Helper function to render the appropriate empty state
  const renderEmptyState = () => {
    switch (activeTab) {
      case 'open':
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6 flex justify-center">
              <img 
                src='/src/assets/man_on_chair.svg'  
                alt="Person working on chair" 
                className="w-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You haven't posted any jobs yet</h2>
            <p className="text-gray-600 mb-6 text-center">Post a job in minutes and reach qualified candidates you can't find anywhere else.</p>
            <button 
              onClick={handlePostJob}
              className="rounded-full px-6 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Post a job
            </button>
          </div>
        );
      case 'draft':
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6 flex justify-center">
              <img 
                src='/src/assets/man_on_chair.svg' 
                alt="Person working on chair" 
                className="w-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You don't have draft jobs yet</h2>
            <p className="text-gray-600 mb-6">Jobs that are in drafts will appear here.</p>
            <button 
              onClick={handlePostJob}
              className="rounded-full px-6 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Post a job
            </button>
          </div>
        );
      case 'inReview':
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6 flex justify-center">
              <img 
                src='/src/assets/man_on_chair.svg' 
                alt="Person working on chair" 
                className="w-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You don't have jobs in review yet</h2>
            <p className="text-gray-600 mb-6">Jobs that are in review will appear here.</p>
            <button 
              onClick={handlePostJob}
              className="rounded-full px-6 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Post a job
            </button>
          </div>
        );
      case 'paused':
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6 flex justify-center">
              <img 
                src='/src/assets/man_on_chair.svg' 
                alt="Person working on chair" 
                className="w-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You don't have paused jobs yet</h2>
            <p className="text-gray-600 mb-6">Jobs that are paused will appear here.</p>
            <button 
              onClick={handlePostJob}
              className="rounded-full px-6 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Post a job
            </button>
          </div>
        );
      case 'closed':
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6 flex justify-center">
              <img 
                src='/src/assets/man_on_chair.svg'  
                alt="Person working on chair" 
                className="w-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You don't have closed jobs yet</h2>
            <p className="text-gray-600 mb-6">Jobs that are closed will appear here.</p>
            <button 
              onClick={handlePostJob}
              className="rounded-full px-6 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Post a job
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading job listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Jobs</h1>
            <p className="text-gray-600">Manage your page's job posts.</p>
          </div>
          <button 
            onClick={handlePostJob}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center transition-colors"
          >
            <FaPlus className="mr-2" size={14} />
            Post a job
          </button>
        </div>
      </div>

      {/* Job status tabs */}
      <div className="border-t border-gray-200">
        <div className="flex">
          <button 
            className={`py-2 px-6 ${activeTab === 'open' ? 'text-green-700 border-b-2 border-green-700 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('open')}
          >
            Open
          </button>
          <button 
            className={`py-2 px-6 ${activeTab === 'draft' ? 'text-green-700 border-b-2 border-green-700 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('draft')}
          >
            Draft
          </button>
          <button 
            className={`py-2 px-6 ${activeTab === 'inReview' ? 'text-green-700 border-b-2 border-green-700 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('inReview')}
          >
            In review
          </button>
          <button 
            className={`py-2 px-6 ${activeTab === 'paused' ? 'text-green-700 border-b-2 border-green-700 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('paused')}
          >
            Paused
          </button>
          <button 
            className={`py-2 px-6 ${activeTab === 'closed' ? 'text-green-700 border-b-2 border-green-700 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed
          </button>
        </div>
      </div>

      {/* Job content area */}
      <div className="p-4">
        {jobs[activeTab]?.length > 0 ? (
          <div className="grid gap-4">
            {/* This would map through your jobs when you have data */}
            {/* {jobs[activeTab].map(job => (
              <JobCard key={job.id} job={job} />
            ))} */}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default CompanyJobsComponent;