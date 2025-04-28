import axiosInstance from "@/services/axiosInstance";
import Cookies from 'js-cookie';
import { 
  CompanyProfileData, 
  CompanyProfileResponse, 
  UserCompaniesResponse,
  Job
} from "../../src/pages/jobs/types"; // Import from your unified types file

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
  
  // Log the request data for debugging
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
  
  // Log the update data for debugging
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

// Get jobs from a company
export const getJobsFromCompany = async (organizationId: string): Promise<{ jobs: Job[] }> => {
  const token = getAuthToken();
  const url = `/api/v1/company/get-jobs-from-company/${organizationId}`;
  
  const response = await axiosInstance.get(url, getAuthHeader(token));
  return response.data;
};

export const searchCompanies = async (query: string): Promise<{ companies: CompanyProfileResponse[] }> => {
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