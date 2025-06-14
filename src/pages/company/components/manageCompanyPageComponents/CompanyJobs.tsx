import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getJobsFromCompany } from '@/endpoints/company';
import { JobCard, Job } from './CompanyJobCard'; 
import JobApplicantsComponent from './JobApplicantsComponent';
import manOnChair from '@/assets/man_on_chair.svg'
interface CompanyJobsComponentProps {
  companyId?: string;
}

type JobStatus = 'open' | 'closed';

interface JobsState {
  open: Job[];
  closed: Job[];
}

interface ApiJob {
  _id: string;
  job_title: string;
  job_status: string;
  location: string;
  workplace_type: string;
  experience_level: string;
  posted_time?: string; 
  applied_applications?: Array<unknown>; 
}

function sanitizeJob(apiJob: ApiJob): Job {
  return {
    _id: apiJob._id || '',
    job_title: apiJob.job_title || 'Untitled Job',
    job_status: apiJob.job_status || 'open',
    location: apiJob.location || 'Unknown location',
    workplace_type: apiJob.workplace_type || 'Unknown',
    experience_level: apiJob.experience_level || 'Not specified',
    posted_time: apiJob.posted_time || new Date().toISOString(),
    applied_applications: apiJob.applied_applications || [],
  };
}

const CompanyJobsComponent: React.FC<CompanyJobsComponentProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<JobStatus>('open');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<JobsState>({
    open: [],
    closed: []
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showApplicants, setShowApplicants] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      const response = await getJobsFromCompany(companyId);
      
      const categorizedJobs: JobsState = {
        open: [],
        closed: []
      };
      
      (response.jobs as ApiJob[]).forEach((apiJob) => {
        const processedJob = sanitizeJob(apiJob);
        
        const status = processedJob.job_status?.toLowerCase();
        if (status === 'open') {
          categorizedJobs.open.push(processedJob);
        } else if (status === 'closed') {
          categorizedJobs.closed.push(processedJob);
        }
      });
      
      setJobs(categorizedJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      toast.error('Failed to load job listings');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handlePostJob = () => {
    if (!companyId) {
      toast.error('Company ID is required to post a job');
      return;
    }
    navigate(`/company-manage/${companyId}/jobs/create`);
  };

  const handleViewApplicants = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowApplicants(true);
  };

  const handleBackToJobs = () => {
    setShowApplicants(false);
    setSelectedJobId(null);
  };

  const handleJobStatusChanged = () => {
    // Refresh the job listings after status change
    fetchJobs();
  };

  const tabNames = {
    open: 'Open',
    closed: 'Closed'
  };

  const renderEmptyState = () => {
    const messages = {
      open: "You haven't posted any jobs yet",
      closed: "You don't have closed jobs yet"
    };

    const descriptions = {
      open: "Post a job in minutes and reach qualified candidates you can't find anywhere else.",
      closed: "Jobs that are closed will appear here."
    };

    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4">
        <div className="w-40 h-40 sm:w-64 sm:h-64 mb-4 sm:mb-6 flex justify-center">
          <img 
            src={manOnChair}  
            alt="Person working on chair" 
            className="w-full "
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">{messages[activeTab]}</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center max-w-md">{descriptions[activeTab]}</p>
        <button 
          id="post-job-button"
          onClick={handlePostJob}
          className="rounded-full px-4 sm:px-6 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm sm:text-base"
        >
          Post a job
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">Jobs</h1>
        <div className="flex justify-center items-center h-48 sm:h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading job listings...</p>
        </div>
      </div>
    );
  }

  // Show job applicants component when a job is selected
  if (showApplicants && selectedJobId) {
    return (
      <JobApplicantsComponent 
        jobId={selectedJobId}
        onBack={handleBackToJobs}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 w-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Jobs</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your page's job posts.</p>
          </div>
          <button 
            id="post-job-main-button"
            onClick={handlePostJob}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center justify-center sm:justify-start transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <FaPlus className="mr-2" size={14} />
            Post a job
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex whitespace-nowrap min-w-full">
          {(['open', 'closed'] as JobStatus[]).map((tab) => (
            <button 
              key={tab}
              id={`job-tab-${tab}`}
              className={`py-2 px-3 sm:px-6 text-sm sm:text-base ${activeTab === tab 
                ? 'text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400 font-medium' 
                : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabNames[tab]}
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
                companyId={companyId}
                onViewApplicants={handleViewApplicants}
                onStatusChanged={handleJobStatusChanged}
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