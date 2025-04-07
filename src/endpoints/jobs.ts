import axiosInstance from "@/services/axiosInstance";

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
    linkup_presence: string;
    size: string;
    industry: string;
    followers: string;
  };
  job_title: string;
  location: string;
  workplace_type: "On-site" | "Remote" | "Hybrid";
  experience_level: 'Internship' | 'Entry level' | 'Associate' | 'Mid-Senior level' | 'Director' | 'Executive';
  salary: string;
  posted_time:string;
  timeAgo:string;
  description:string;
  benefits:string[];
  qualifications:string[];
  responsibilities:string[];
  isPromoted:boolean;
  hasEasyApply:boolean;
}

export const fetchJobs = async (token: string, limit: number = 10, cursor?: string): Promise<JobResponse> => {
    const url = cursor 
      ? `/api/v1/jobs/get-jobs?cursor=${cursor}&limit=${limit}` 
      : `/api/v1/jobs/get-jobs?limit=${limit}`;
    
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Jobs response:", response.data);
    return response.data;
  };

export const fetchTopJobs = async (token: string, limit: number = 3): Promise<JobResponse> => {
    const url = `/api/v1/jobs/get-top-jobs?limit=${limit}`;
    
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Top Jobs response:", response.data);
    return response.data;
  };  

export const fetchSingleJob = async (token: string, jobId: string): Promise<{ data: JobData }> => {
    const url = `/api/v1/jobs/get-job/${jobId}`;
    
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Single Job response:", response.data);
    return response.data;
  };