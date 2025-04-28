import React, { useState, useMemo, useEffect } from "react";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import Pagination from "./Pagination";
import { Job, JobFilters } from "../../types";
import { FOOTER_LINKS } from '../../../../constants/index';
import { FaSortDown } from "react-icons/fa6";
import { fetchSingleJob, fetchJobs, convertJobDataToJob } from '../../../../endpoints/jobs';
import Cookies from 'js-cookie';

interface JobListingsProps {
  filters: JobFilters;
  jobs?: Job[];
  selectedJobId?: string;
  selectedJob?: Job | null;
  loading?: boolean;
  onJobSelect?: (job: Job) => void;
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
  const JOBS_PER_PAGE = 10;
  
  // Check if any filters are active
  const isFilterActive = useMemo(() => {
    return Object.values(filters).some(filterArr => filterArr.length > 0);
  }, [filters]);
  
  // Apply filters to jobs
  const filteredJobs = useMemo(() => {
    if (!isFilterActive) return jobs;
    
    let result = [...jobs];
    
    if (filters.locations.length > 0) {
      result = result.filter(job => 
        filters.locations.some(location => 
          job.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }
    
    if (filters.company.length > 0) {
      result = result.filter(job => 
        filters.company.some(company => 
          job.company.toLowerCase().includes(company.toLowerCase())
        )
      );
    }
    
    if (filters.experienceLevels.length > 0) {
      result = result.filter(job => 
        filters.experienceLevels.includes(job.experience_level)
      );
    }
    
    if (filters.workModes.length > 0) {
      result = result.filter(job => 
        filters.workModes.includes(job.workMode!)
      );
    }
    
    if (filters.salaryRanges.length > 0) {
      result = result.filter(job => {
        if (!job.salary) return false;
        
        const salaryStr = String(job.salary);
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // Fetch jobs when needed
  useEffect(() => {
    const fetchAllJobs = async () => {
      if ((propJobs && propJobs.length > 0) || fetchedOnce) return;
      
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetchJobs(token, 100);
        const jobsData = response.data.map(job => convertJobDataToJob(job));
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
      
      const jobInList = jobs.find(job => job.id === propSelectedJobId);
      if (jobInList) {
        setSelectedJob(jobInList);
        return;
      }

      await fetchSelectedJob(propSelectedJobId);
    };

    getJobFromId();
  }, [propSelectedJobId, jobs]);

  // Fetch a single job
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
      const jobData = convertJobDataToJob(response.data);
      setSelectedJob(jobData);
      
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
    const hasCompleteData = job.description && 
                           Array.isArray(job.responsibilities) && 
                           Array.isArray(job.qualifications) && 
                           Array.isArray(job.benefits);
    
    if (onJobSelect) {
      if (hasCompleteData) {
        onJobSelect(job);
      } else {
        setJobDetailLoading(true);
        fetchSelectedJob(job.id!);
      }
      return;
    }
    
    if (hasCompleteData) {
      setSelectedJob(job);
    } else {
      fetchSelectedJob(job.id!);
    }
  };

  // Auto-select first job when needed
  useEffect(() => {
    if (!selectedJob && currentJobs.length > 0 && !propSelectedJobId) {
      handleSelectJob(currentJobs[0]);
    }
  }, [currentJobs, selectedJob, propSelectedJobId]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    <div id="jobs-listings-container" className="min-h-screen pt-11 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 flex flex-col md:flex-row">
        <div id="job-list-sidebar" className="w-full md:w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700 job-list-container" style={{ maxHeight: "100vh" }}>
          {loading ? (
            <div id="job-list-loading" className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
            </div>
          ) : (
            <>
              <div id="job-results-header" className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Showing {currentJobs.length} of {filteredJobs.length} jobs
                  {isFilterActive && jobs.length !== filteredJobs.length && ` (filtered from ${jobs.length} total)`}
                </p>
                {isFilterActive && (
                  <div id="active-filters" className="mt-2 flex flex-wrap gap-2">
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
                <div id="no-jobs-message" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {isFilterActive ? "No jobs match your filter criteria" : "No jobs available"}
                </div>
              )}
            </>
          )}
          
          <div id="footer-links" className="mt-6 text-xs text-gray-600 dark:text-gray-400 p-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((link, index) => (
                <span id={`footer-link-${index}`} key={index} className="cursor-pointer hover:underline flex items-center dark:text-gray-400 dark:hover:text-gray-300">
                  {link.text} {link.hasArrow && <FaSortDown size={12} />}
                </span>
              ))}
            </div>
            
            <div id="copyright-footer" className="mt-2 flex justify-center items-center">
              <img className="w-5 h-5" src="/link_up_logo.png" alt="LinkUp Logo"></img>
              <span className="ml-2">LinkUp Corporation © 2025</span>
            </div>
          </div>
        </div>

        {/* Job Details Component */}
        <div id="job-detail-container" className="w-full md:w-2/3 overflow-y-auto bg-white dark:bg-gray-900" style={{ maxHeight: "100vh" }}>
          {selectedJob ? (
            <JobDetail 
              job={selectedJob} 
              isLoading={jobDetailLoading} 
            />
          ) : loading || jobDetailLoading ? (
            <div id="job-detail-loading" className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div id="no-job-selected" className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No job selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;