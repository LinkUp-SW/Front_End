import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getJobsFromCompany } from '@/endpoints/company';
import { JobCard, Job } from './CompanyJobCard';

interface CompanyJobsComponentProps {
  companyId?: string;
  companyName?: string;
}

type JobStatus = 'open' | 'draft' | 'inReview' | 'paused' | 'closed';

interface JobsState {
  open: Job[];
  draft: Job[];
  inReview: Job[];
  paused: Job[];
  closed: Job[];
}

interface JobsResponse {
  jobs: Job[];
}

const CompanyJobsComponent: React.FC<CompanyJobsComponentProps> = ({ companyId, companyName = "Your Company" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<JobStatus>('open');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<JobsState>({
    open: [],
    draft: [],
    inReview: [],
    paused: [],
    closed: []
  });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) return;
      
      try {
        setIsLoading(true);
        const response = await getJobsFromCompany(companyId) as JobsResponse;
        
        const categorizedJobs: JobsState = {
          open: [],
          draft: [],
          inReview: [],
          paused: [],
          closed: []
        };
        
        response.jobs.forEach((job: Job) => {
          const status = job.job_status.toLowerCase();
          if (status === 'open') {
            categorizedJobs.open.push(job);
          } else if (status === 'draft') {
            categorizedJobs.draft.push(job);
          } else if (status === 'in review') {
            categorizedJobs.inReview.push(job);
          } else if (status === 'paused') {
            categorizedJobs.paused.push(job);
          } else if (status === 'closed') {
            categorizedJobs.closed.push(job);
          }
        });
        
        setJobs(categorizedJobs);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        toast.error('Failed to load job listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  const handlePostJob = () => {
    if (!companyId) {
      toast.error('Company ID is required to post a job');
      return;
    }
    // Implement job edit logic here
    navigate(`/company-manage/${companyId}/jobs/create`);
  };

  const handleEditJob = (jobId: string) => {
    if (!companyId) return;
    navigate(`/company-manage/${companyId}/jobs/edit/${jobId}`);
  };

 

  const renderEmptyState = () => {
    const messages = {
      open: "You haven't posted any jobs yet",
      draft: "You don't have draft jobs yet",
      inReview: "You don't have jobs in review yet",
      paused: "You don't have paused jobs yet",
      closed: "You don't have closed jobs yet"
    };

    const descriptions = {
      open: "Post a job in minutes and reach qualified candidates you can't find anywhere else.",
      draft: "Jobs that are in drafts will appear here.",
      inReview: "Jobs that are in review will appear here.",
      paused: "Jobs that are paused will appear here.",
      closed: "Jobs that are closed will appear here."
    };

    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-64 h-64 mb-6 flex justify-center">
          <img 
            src='/src/assets/man_on_chair.svg'  
            alt="Person working on chair" 
            className="w-full"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{messages[activeTab]}</h2>
        <p className="text-gray-600 mb-6 text-center">{descriptions[activeTab]}</p>
        <button 
          onClick={handlePostJob}
          className="rounded-full px-6 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          Post a job
        </button>
      </div>
    );
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

      <div className="border-t border-gray-200">
        <div className="flex">
          {(['open', 'draft', 'inReview', 'paused', 'closed'] as JobStatus[]).map((tab) => (
            <button 
              key={tab}
              className={`py-2 px-6 ${activeTab === tab ? 'text-green-700 border-b-2 border-green-700 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'inReview' ? 'In review' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {jobs[activeTab]?.length > 0 ? (
          <div className="grid gap-4">
            {jobs[activeTab].map(job => (
              <JobCard 
                key={job._id} 
                job={job} 
                onEdit={handleEditJob}
              />
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default CompanyJobsComponent;