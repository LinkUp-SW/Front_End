import axiosInstance from "@/services/axiosInstance";
import Cookies from 'js-cookie';
import { 
  CompanyProfileData, 
  CompanyProfileResponse, 
  UserCompaniesResponse,
  Job
} from "../../src/pages/jobs/types";

// Helper functions
const getAuthToken = () => {
  const token = Cookies.get('linkup_auth_token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return token;
};

const getAuthHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const createCompanyProfile = async (companyData: CompanyProfileData): Promise<CompanyProfileResponse> => {
  const token = getAuthToken();
  const url = '/api/v1/company/create-company-profile';
 
  console.log('Creating company with data:', companyData);
  
  // Clean up data before sending - removing undefined values
  const cleanData = Object.fromEntries(
    Object.entries(companyData).filter(([, value]) => value !== undefined && value !== '')
  );
  
  const response = await axiosInstance.post(url, cleanData, getAuthHeader(token));
  return response.data;
};

export const getUserCompanies = async (): Promise<UserCompaniesResponse> => {
  const token = getAuthToken();
  const url = '/api/v1/company/get-user-comapanies';
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const getCompanyAdminView = async (companyId: string): Promise<CompanyProfileResponse> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-company-admin-view/${companyId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const getCompanyAllView = async (companyId: string): Promise<CompanyProfileResponse> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-company-all-view/${companyId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const updateCompanyProfile = async (companyId: string, companyData: Partial<CompanyProfileData>): Promise<CompanyProfileResponse> => {
  const token = getAuthToken();
  const url = `/api/v1/company/update-company-profile/${companyId}`;
  
  console.log('Updating company with data:', {
    ...companyData,
    logo: companyData.logo ? '[BASE64_DATA]' : undefined
  });
  
  // Clean up data before sending - removing undefined values
  const cleanData = Object.fromEntries(
    Object.entries(companyData).filter(([, value]) => value !== undefined && value !== '')
  );
  
  // Regular JSON request with the logo included
  const response = await axiosInstance.put(url, cleanData, getAuthHeader(token));
  
  return response.data;
};

export const deactivateCompanyPage = async (companyId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/delete-company-profile/${companyId}`;
  
  console.log('Deactivating company page:', companyId);
  
  const response = await axiosInstance.delete(url, getAuthHeader(token));
  return response.data;
};

export const createJobFromCompany = async (organizationId: string, jobData: Partial<Job>): Promise<{ success: boolean; job: Job }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/create-job-from-company/${organizationId}`;
  
  // Clean up data before sending - removing undefined values
  const cleanData = Object.fromEntries(
    Object.entries(jobData).filter(([, value]) => value !== undefined && value !== '')
  );
  
  console.log('Creating job with data:', cleanData);
  
  const response = await axiosInstance.post(url, cleanData, getAuthHeader(token));
  return response.data;
};


export const getJobsFromCompany = async (organizationId: string): Promise<{ jobs: Job[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-jobs-from-company/${organizationId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const searchCompanies = async (query: string): Promise<{ message: string; data: CompanyProfileResponse[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/search/${query}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

// Admin Management API Functions
export interface Admin {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  headline?: string;
  profile_picture?: string;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  headline?: string;
  profile_photo?: string;
}

export const getCompanyAdmins = async (companyId: string): Promise<{ admins: Admin[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-admins/${companyId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const searchUsers = async (query: string): Promise<{ results: User[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/search/users/${query}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const makeUserAdmin = async (companyId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/make-admin/${companyId}/${userId}`;
  
  const response = await axiosInstance.post(url, {}, getAuthHeader(token));
  return response.data;
};

export const removeAdmin = async (companyId: string, adminId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/remove-admin/${companyId}/${adminId}`;
  
  const response = await axiosInstance.delete(url, getAuthHeader(token));
  return response.data;
};



export interface Follower {
  _id: string;
  user_id: string;
  bio: {
    first_name: string;
    last_name: string;
    headline: string;
  };
  profile_photo?: string;
}

export const getCompanyFollowers = async (organizationId: string): Promise<{ followers: Follower[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-followers/${organizationId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const blockFollower = async (organizationId: string, followerId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/block-follower/${organizationId}/${followerId}`;
  
  const response = await axiosInstance.post(url, {}, getAuthHeader(token));
  return response.data;
};

export const getBlockedFollowers = async (organizationId: string): Promise<{ blocked_followers: Follower[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-blocked-followers/${organizationId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const unblockFollower = async (organizationId: string, followerId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/unblock-follower/${organizationId}/${followerId}`;
  
  const response = await axiosInstance.delete(url, getAuthHeader(token));
  return response.data;
};

export const checkIsFollowing = async (organizationId: string): Promise<{ isFollower: boolean }> => {
  const token = getAuthToken();
  const url = `/api/v1/search/is-follower/${organizationId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const followOrganization = async (organizationId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/follow-organization/${organizationId}`;
  
  const response = await axiosInstance.post(url, {}, getAuthHeader(token));
  return response.data;
};

export const unfollowOrganization = async (organizationId: string): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/unfollow-organization/${organizationId}`;
  
  const response = await axiosInstance.delete(url, getAuthHeader(token));
  return response.data;
};

export interface JobApplicant {
  _id: string;
  job_id: string;
  user_id: {
    _id: string;
    bio: {
      first_name: string;
      last_name: string;
      headline: string;
      contact_info?: {
        phone_number: number;
        country_code: string;
      };
    };
    profile_photo?: string;
  };
  first_name: string;
  last_name: string;
  phone_number: number;
  country_code: string;
  email: string;
  resume: string;
  application_status: 'Pending' | 'Viewed' | 'Accepted' | 'Rejected';
}

export const getJobApplicants = async (jobId: string): Promise<{ data: JobApplicant[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/job-application/get-job-applications/${jobId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const updateApplicationStatus = async (applicantId: string, status: JobApplicant['application_status']): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const url = `/api/v1/job-application/update-job-application-status/${applicantId}`;
  
  const response = await axiosInstance.put(url, { status }, getAuthHeader(token));
  return response.data;
};
