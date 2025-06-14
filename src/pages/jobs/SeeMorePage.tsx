import { useState, useEffect } from 'react';
import { WithNavBar } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import JobFilterBar from "../../components/jobs_filter_bar/JobFilterBar";
import JobListings from "./components/seeMorePageComponents/JobListings";
import { JobFilters, Job } from './types';
import { fetchSingleJob, convertJobDataToJob } from '../../endpoints/jobs';
import Cookies from 'js-cookie';

const SeeMorePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedJobId = queryParams.get('selected');
  
  const [filters, setFilters] = useState<JobFilters>({
    locations: [],
    company: [],
    experienceLevels: [],
    workModes: [],
    salaryRanges: []
  });
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch selected job when the page loads with a job ID
  useEffect(() => {
    const fetchSelectedJobData = async () => {
      if (!selectedJobId) return;
      
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetchSingleJob(token, selectedJobId);
        const jobData = convertJobDataToJob(response.data);
        setSelectedJob(jobData);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSelectedJobData();
  }, [selectedJobId]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  // Handle job selection and update URL
  const handleJobSelection = (job: Job) => {
    // Update URL with selected job ID
    const newParams = new URLSearchParams(location.search);
    newParams.set('selected', job.id!);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    
    // Update selected job state
    setSelectedJob(job);
  };

  return (
    <div id="see-more-page-container">
      <JobFilterBar onFiltersChange={handleFiltersChange} /> 
      <JobListings 
        filters={filters} 
        selectedJobId={selectedJobId || undefined} 
        selectedJob={selectedJob}
        loading={loading}
        onJobSelect={handleJobSelection}
      />
    </div>
  );
};

export default WithNavBar(SeeMorePage);