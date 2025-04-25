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

// Helper to convert JobData to Job interface
export const convertJobDataToJob = (jobData: JobData): Job => {
  return {
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
      industryType: jobData.organization.industry,
      employeeCount: jobData.organization.size
    } : undefined
  };
};