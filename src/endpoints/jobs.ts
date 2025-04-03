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
  organization_id: {
    name: string;
    logo: string;
  };
  job_title: string;
  location: string;
  workplace_type: "On-site" | "Remote" | "Hybrid";
  applications_count: number;
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