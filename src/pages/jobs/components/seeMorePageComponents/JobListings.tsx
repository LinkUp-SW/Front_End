import React, { useState, useMemo, useEffect } from "react";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import Pagination from "./Pagination";
import { Job, JobFilters } from "../../types";
import { FOOTER_LINKS } from '../../../../constants/index';
import { FaSortDown } from "react-icons/fa6";
import { fetchSingleJob, fetchJobs } from '../../../../endpoints/jobs';
import Cookies from 'js-cookie';

interface JobListingsProps {
  filters: JobFilters;
  jobs?: Job[]; // Optional prop to accept jobs from parent component
  selectedJobId?: string; // Optional selected job ID
  selectedJob?: Job | null; // Optional selected job object
  loading?: boolean; // Optional loading state
  onJobSelect?: (job: Job) => void; // New callback for job selection
}

const JobListings: React.FC<JobListingsProps> = ({ 
  filters, 
  jobs: propJobs, 
  selectedJobId: propSelectedJobId,
  selectedJob: propSelectedJob,
  loading: propLoading = false,
  onJobSelect
}) => {
  // State variables
  const [jobs, setJobs] = useState<Job[]>(propJobs || []);
  const [loading, setLoading] = useState(propLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(propSelectedJob || null);
  const [jobDetailLoading, setJobDetailLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  
  // Filtered jobs based on selected filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
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
        (job.salary && filters.salaryRanges.includes(job.salary));
      
      return matchesLocations && 
             matchesCompany && 
             matchesExperienceLevels && 
             matchesWorkModes && 
             matchesSalaryRanges;
    });
  }, [jobs, filters]);

  const totalPages = Math.ceil(filteredJobs.length / 10); // 10 jobs per page
  
  const convertApiDataToJob = (jobData: any): Job => {
    return {
      id: jobData._id,
      title: jobData.job_title,
      company: jobData.organization_id.name,
      location: jobData.location,
      experience_level: jobData.experience_level,
      isRemote: jobData.workplace_type === 'Remote',
      isSaved: false,
      logo: jobData.organization_id.logo,
      isPromoted: false,
      hasEasyApply: true,
      workMode: jobData.workplace_type,
      postedTime: jobData.timeAgo,
      salary: jobData.salary,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      benefits: jobData.benefits,
    };
  };

  // Fetch jobs if no props were provided
  useEffect(() => {
    const fetchAllJobs = async () => {
      // If we already have jobs from props, don't fetch
      if (propJobs && propJobs.length > 0) {
        setJobs(propJobs);
        return;
      }
      
      // Don't fetch twice
      if (fetchedOnce) return;
      
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetchJobs(token, 20); 
        const jobsData = response.data.map(job => convertApiDataToJob(job));
        setJobs(jobsData);
        setFetchedOnce(true); 
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllJobs();
  }, [propJobs, fetchedOnce]);

  // Update jobs when prop jobs change
  useEffect(() => {
    if (propJobs && propJobs.length > 0) {
      setJobs(propJobs);
    }
  }, [propJobs]);

  // Handle job selection from parent prop
  useEffect(() => {
    if (propSelectedJob) {
      setSelectedJob(propSelectedJob);
    }
  }, [propSelectedJob]);

  // Handle job selection from prop ID
  useEffect(() => {
    const getJobFromId = async () => {
      if (!propSelectedJobId) return;
      
      // Check if the job is already in our list
      const jobInList = jobs.find(job => job.id === propSelectedJobId);
      if (jobInList) {
        setSelectedJob(jobInList);
        return;
      }

      // If job is not in list, fetch just that one job
      await fetchSelectedJob(propSelectedJobId);
    };

    getJobFromId();
  }, [propSelectedJobId, jobs]);

  // Fetch a single job when selected
  const fetchSelectedJob = async (jobId: string) => {
    setJobDetailLoading(true);
    
    const token = Cookies.get('linkup_auth_token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      setJobDetailLoading(false);
      return;
    }

    try {
      const response = await fetchSingleJob(token, jobId);
      const jobData = convertApiDataToJob(response.data);
      setSelectedJob(jobData);
      
      // If parent provided a callback, use it
      if (onJobSelect) {
        onJobSelect(jobData);
      }
    } catch (error) {
      console.error('Error fetching selected job:', error);
    } finally {
      setJobDetailLoading(false);
    }
  };

  // Handle job selection from list
  const handleSelectJob = (job: Job) => {
    // If parent component provided onJobSelect, call it
    if (onJobSelect) {
      onJobSelect(job);
      return;
    }
    
    // Otherwise handle selection internally
    // If we already have full details for this job, just select it
    if (job.description && job.responsibilities && job.qualifications) {
      setSelectedJob(job);
    } else {
      // Otherwise fetch the full details
      fetchSelectedJob(job.id);
    }
  };

  // Effect to select first job when filtered jobs change and no job is selected
  useEffect(() => {
    if (!selectedJob && filteredJobs.length > 0 && !propSelectedJobId) {
      // If no job is selected and we have filtered jobs, select the first one
      const firstJob = filteredJobs[0];
      handleSelectJob(firstJob);
    }
  }, [filteredJobs, selectedJob, propSelectedJobId]);

  return (
    <div className="min-h-screen pt-11 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700" style={{ maxHeight: "100vh" }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
            </div>
          ) : (
            <JobList 
              jobs={filteredJobs} 
              selectedJobId={selectedJob?.id || ''} 
              onSelectJob={handleSelectJob} 
            />
          )}
          
          {!loading && (
            <>
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
            </>
          )}
        </div>

        {/* Job Details Component */}
        <div className="w-full md:w-2/3 overflow-y-auto bg-white dark:bg-gray-900" style={{ maxHeight: "100vh" }}>
          {selectedJob ? (
            <JobDetail 
              job={selectedJob} 
              isLoading={jobDetailLoading} 
            />
          ) : loading || jobDetailLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
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

export default JobListings;