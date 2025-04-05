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
  const JOBS_PER_PAGE = 10; // Define how many jobs to show per page
  
  // Check if any filters are active
  const isFilterActive = useMemo(() => {
    return Object.values(filters).some(filterArr => filterArr.length > 0);
  }, [filters]);
  
  // Apply filters to jobs only if filters are active
  const filteredJobs = useMemo(() => {
    // If no filters are active, return all jobs
    if (!isFilterActive) {
      return jobs;
    }
    
    // Start with all jobs
    let result = [...jobs];
    
    // Filter by location
    if (filters.locations && filters.locations.length > 0) {
      result = result.filter(job => 
        filters.locations.some(location => 
          job.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }
    
    // Filter by company
    if (filters.company && filters.company.length > 0) {
      result = result.filter(job => 
        filters.company.some(company => 
          job.company.toLowerCase().includes(company.toLowerCase())
        )
      );
    }
    
    // Filter by experience level
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      result = result.filter(job => 
        filters.experienceLevels.includes(job.experience_level)
      );
    }
    
    // Filter by work mode
    if (filters.workModes && filters.workModes.length > 0) {
      result = result.filter(job => 
        filters.workModes.includes(job.workMode)
      );
    }
    
    // Filter by salary range - implement if salary has a consistent format
    if (filters.salaryRanges && filters.salaryRanges.length > 0) {
      result = result.filter(job => {
        if (!job.salary) return false;
        
        const salaryStr = String(job.salary); // Ensure it's a string
        const salaryValue = parseInt(salaryStr.replace(/[^0-9]/g, ''));
        
        return filters.salaryRanges.some(range => {
          if (range === '1000-5000') return salaryValue >= 1000 && salaryValue <= 5000;
          if (range === '5000-10000') return salaryValue >= 5000 && salaryValue <= 10000;
          if (range === '10000+') return salaryValue >= 10000;
          return false;
        });
      });
    }
    
    return result;
  }, [jobs, filters, isFilterActive]);

  // Calculate total pages based on filtered jobs
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  
  // Get current page's jobs
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage, JOBS_PER_PAGE]);
  
  const convertApiDataToJob = (jobData: any): Job => {
    return {
      id: jobData._id,
      title: jobData.job_title,
      company: jobData.organization ? jobData.organization.name : 'Unknown Company',
      location: jobData.location || 'Unknown Location',
      experience_level: jobData.experience_level || 'Entry level',
      isRemote: jobData.workplace_type === 'Remote',
      isSaved: false,
      logo: jobData.organization ? jobData.organization.logo : '',
      isPromoted: false,
      hasEasyApply: true,
      workMode: jobData.workplace_type || 'On-site',
      postedTime: jobData.timeAgo || 'Recently',
      salary: jobData.salary || '',
      description: jobData.description || '',
      responsibilities: jobData.responsibilities || [],
      qualifications: jobData.qualifications || [],
      benefits: jobData.benefits || [],
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
        // Set limit to a high number to get all jobs at once
        const response = await fetchJobs(token, 100); 
        const jobsData = response.data.map(job => convertApiDataToJob(job));
        setJobs(jobsData);
        setFetchedOnce(true);
        console.log(`Fetched ${jobsData.length} jobs`);
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
      // Check if the job has complete data before passing it up
      if (job.description && 
          Array.isArray(job.responsibilities) && 
          Array.isArray(job.qualifications) && 
          Array.isArray(job.benefits)) {
        onJobSelect(job);
      } else {
        // If job doesn't have complete data, fetch it first
        setJobDetailLoading(true);
        fetchSelectedJob(job.id);
      }
      return;
    }
    
    // Otherwise handle selection internally
    if (job.description && 
        Array.isArray(job.responsibilities) && 
        Array.isArray(job.qualifications) && 
        Array.isArray(job.benefits)) {
      setSelectedJob(job);
    } else {
      // Otherwise fetch the full details
      fetchSelectedJob(job.id);
    }
  };

  // Effect to select first job when currentJobs change and no job is selected
  useEffect(() => {
    if (!selectedJob && currentJobs.length > 0 && !propSelectedJobId) {
      // If no job is selected and we have jobs, select the first one
      const firstJob = currentJobs[0];
      handleSelectJob(firstJob);
    }
  }, [currentJobs, selectedJob, propSelectedJobId]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of job list when page changes
    const jobListElement = document.querySelector('.job-list-container');
    if (jobListElement) {
      jobListElement.scrollTop = 0;
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="min-h-screen pt-11 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700 job-list-container" style={{ maxHeight: "100vh" }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Showing {currentJobs.length} of {filteredJobs.length} jobs
                  {isFilterActive && jobs.length !== filteredJobs.length && ` (filtered from ${jobs.length} total)`}
                </p>
                {isFilterActive && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filters.locations.map(loc => (
                      <span key={loc} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-800 dark:text-blue-100">
                        Location: {loc}
                      </span>
                    ))}
                    {filters.company.map(comp => (
                      <span key={comp} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-800 dark:text-green-100">
                        Company: {comp}
                      </span>
                    ))}
                    {filters.experienceLevels.map(exp => (
                      <span key={exp} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded dark:bg-purple-800 dark:text-purple-100">
                        Experience: {exp}
                      </span>
                    ))}
                    {filters.workModes.map(mode => (
                      <span key={mode} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded dark:bg-orange-800 dark:text-orange-100">
                        Work mode: {mode}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <JobList 
                jobs={currentJobs} 
                selectedJobId={selectedJob?.id || ''} 
                onSelectJob={handleSelectJob} 
              />
              
              {filteredJobs.length > JOBS_PER_PAGE && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
              
              {filteredJobs.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {isFilterActive ? "No jobs match your filter criteria" : "No jobs available"}
                </div>
              )}
            </>
          )}
          
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
              No job selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;