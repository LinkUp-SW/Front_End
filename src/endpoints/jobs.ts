import axiosInstance from "@/services/axiosInstance";
import Cookies from 'js-cookie';
import { Job } from "../pages/jobs/types";

export interface JobResponse {
  message: string;
  count: number;
  total: number;
  data: JobData[];
  nextCursor: string;
}

export interface JobData {
  _id: string;
  organization: {
    _id: string;
    name: string;
    logo: string;
    description: string;
    size: string;
    industry: string;
    followers: string;
    followers_count:number;
  };
  job_title: string;
  location: string;
  workplace_type: "On-site" | "Remote" | "Hybrid";
  experience_level: 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director' | 'Executive';
  salary: string;
  posted_time: string;
  timeAgo: string;
  description: string;
  benefits: string[];
  qualifications: string[];
  responsibilities: string[];
  isPromoted: boolean;
  hasEasyApply: boolean;
  isSaved?: boolean;
}

export interface SavedJobsResponse {
  message: string;
  data: JobData[];
}

interface Organization {
  _id: string;
  name: string;
  logo: string;
}

export interface SearchJobs {
  _id: string;
  job_title: string;
  location: string;
  workplace_type: string;
  experience_level: string;
  salary: number;
  timeAgo: string;
  organization: Organization;
}

interface JobSearchResponse {
  message: string;
  query: string;
  count: number;
  total: number;
  data: SearchJobs[];
  nextCursor: string;
}

// New interface for user information in job application
export interface UserInfo {
  bio: {
    contact_info: {
      phone_number: number;
      country_code: string;
    };
    first_name: string;
    last_name: string;
    headline: string;
  };
  _id: string;
  profile_photo: string;
  resume: string;
  email: string;
}

// New interface for job application payload
export interface JobApplicationData {
  phone_number: number;
  country_code: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_photo: string;
  resume: string; // Will now contain base64 data if newly uploaded
  is_uploaded: boolean;
}

// Token helper function
const getAuthToken = () => {
  const token = Cookies.get('linkup_auth_token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return token;
};

// Helper function to add auth header
const getAuthHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// API call functions
export const fetchJobs = async (token: string, limit: number = 10, cursor?: string): Promise<JobResponse> => {
  const url = `/api/v1/jobs/get-jobs?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`;
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const fetchTopJobs = async (token: string, limit: number = 3): Promise<JobResponse> => {
  const url = `/api/v1/jobs/get-top-jobs?limit=${limit}`;
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};  

export const fetchSingleJob = async (token: string, jobId: string): Promise<{ data: JobData }> => {
  const url = `/api/v1/jobs/get-job/${jobId}`;
  const response = await axiosInstance.get(url, getAuthHeader(token));

  try {
    const savedJobs = await fetchSavedJobs();
    response.data.data.isSaved = savedJobs.some(savedJob => savedJob._id === jobId);
  } catch (error) {
    console.error('Error checking saved status:', error);
  }
 
  return response.data;
};

// Saved jobs functions
export const fetchSavedJobs = async (): Promise<JobData[]> => {
  const token = getAuthToken();
  const url = '/api/v1/jobs/get-saved-jobs';
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data.data || [];
};

export const saveJob = async (jobId: string): Promise<{ message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/jobs/save-jobs/${jobId}`;
  const response = await axiosInstance.post(url, {}, getAuthHeader(token));
  return response.data;
};

export const removeFromSaved = async (jobId: string): Promise<{ message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/jobs/unsave-jobs/${jobId}`;
  const response = await axiosInstance.delete(url, getAuthHeader(token));
  return response.data;
};

// New job application related functions
export const fetchUserJobApplicationInfo = async (): Promise<UserInfo> => {
  const token = getAuthToken();
  const response = await axiosInstance.get('/api/v1/job-application/apply-for-job', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const submitJobApplication = async (jobId: string, applicationData: JobApplicationData): Promise<{ message: string }> => {
  const token = getAuthToken();
  const response = await axiosInstance.post(
    `/api/v1/job-application/create-job-application/${jobId}`, 
    applicationData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Helper to convert JobData to Job interface
export const convertJobDataToJob = (jobData: JobData): Job => {
  return {
    _id: jobData._id, 
    id: jobData._id,
    title: jobData.job_title,
    company: jobData.organization?.name || '',
    location: jobData.location,
    experience_level: jobData.experience_level,
    isRemote: jobData.workplace_type === 'Remote',
    isSaved: jobData.isSaved || false, 
    logo: jobData.organization?.logo || '',
    isPromoted: jobData.isPromoted,
    hasEasyApply: true,
    postedTime: jobData.timeAgo || jobData.posted_time,
    workMode: jobData.workplace_type,
    description: jobData.description,
    qualifications: jobData.qualifications,
    responsibilities: jobData.responsibilities,
    benefits: jobData.benefits,
    salary: jobData.salary,
    companyInfo: jobData.organization ? {
      _id: jobData.organization._id,
      name: jobData.organization.name,
      logo: jobData.organization.logo,
      description: jobData.organization.description,
      industry: jobData.organization.industry,
      size: jobData.organization.size,
      followers: jobData.organization.followers ? [jobData.organization.followers] : [],
      followers_count: jobData.organization.followers_count,
      industryType: jobData.organization.industry,
      employeeCount: jobData.organization.size
    } : undefined,
    job_status: 'open',  
  };
};

export const getSearchJobs = async (
  query: string,
  cursor: string | null,
  limit: number | null
): Promise<JobSearchResponse> => {
  const response = await axiosInstance.get(
    "/api/v1/jobs/search-jobs",
    {
      headers: {
      
      },
      params: { query, cursor, limit },
    }
  );
  return response.data;
};

export interface AppliedJobsResponse {
  message: string;
  count: number;
  data: AppliedJobData[];
}

export interface AppliedJobData extends JobData {
  application_status: 'Pending' | 'Viewed' | 'Accepted' | 'Rejected';
  application_id: string;
}

// Add this new function to fetch applied jobs
export const fetchAppliedJobs = async (): Promise<AppliedJobData[]> => {
  const token = getAuthToken();
  const url = '/api/v1/job-application/get-applied-jobs';
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data.data || [];
};

// Helper to convert AppliedJobData to Job interface with application status
export const convertAppliedJobDataToJob = (jobData: AppliedJobData): Job & { application_status: string, application_id: string } => {
  return {
    ...convertJobDataToJob(jobData),
    application_status: jobData.application_status,
    application_id: jobData.application_id
  };
};