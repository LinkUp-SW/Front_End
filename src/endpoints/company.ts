import axiosInstance from "@/services/axiosInstance";
import Cookies from 'js-cookie';
import { 
  CompanyProfileData, 
  CompanyProfileResponse, 
  UserCompaniesResponse,
  Job 
} from "../pages/jobs/types"; 

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
  try {
    const token = getAuthToken();
    const url = '/api/v1/company/create-company-profile';
    
    // Log the request data for debugging
    console.log('Creating company with data:', companyData);
    
    // Clean up data before sending - removing undefined values
    const cleanData = Object.fromEntries(
      Object.entries(companyData).filter(([_, v]) => v !== undefined && v !== '')
    );
    
    const response = await axiosInstance.post(url, cleanData, getAuthHeader(token));
    return response.data;
  } catch (error: any) {

    console.error('API Error Details:', error.response?.data || error.message);
 
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const getUserCompanies = async (): Promise<UserCompaniesResponse> => {
  try {
    const token = getAuthToken();
    const url = '/api/v1/company/get-user-comapanies';
    
    const response = await axiosInstance.get(url, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user companies:', error.response?.data || error.message);
    
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to load your pages');
  }
};


export const getCompanyAdminView = async (companyId: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/company/get-company-admin-view/${companyId}`;
    
    const response = await axiosInstance.get(url, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch company admin data:', error.response?.data || error.message);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to load company data');
  }
};



export const getCompanyAllView = async (companyId: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/company/get-company-all-view/${companyId}`;
    
    const response = await axiosInstance.get(url, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch complete company data:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to load complete company data');
  }
};


export const updateCompanyProfile = async (companyId: string, companyData: Partial<CompanyProfileData>): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/company/update-company-profile/${companyId}`;
    
    // Log the update data for debugging
    console.log('Updating company with data:', {
      ...companyData,
      logo: companyData.logo ? `${companyData.logo.substring(0, 30)}... (truncated)` : undefined
    });
    
    // Clean up data before sending - removing undefined values
    const cleanData = Object.fromEntries(
      Object.entries(companyData).filter(([_, v]) => v !== undefined && v !== '')
    );
    
    // Use multipart/form-data if there's a logo update
    let response;
    
    if (cleanData.logo && cleanData.logo.startsWith('data:image/')) {
      // The logo is a base64 string, create form data
      const formData = new FormData();
      
      // Add all other fields to form data
      Object.entries(cleanData).forEach(([key, value]) => {
        if (key !== 'logo') {
          // Handle nested objects like location
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Convert base64 to blob and add to form data
      const base64Response = await fetch(cleanData.logo);
      const blob = await base64Response.blob();
      formData.append('logo', blob, 'company-logo.png');
      
      // Send the multipart request
      response = await axiosInstance.put(
        url, 
        formData, 
        {
          ...getAuthHeader(token),
          headers: {
            ...getAuthHeader(token).headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    } else {
      // Regular JSON request if no logo update
      response = await axiosInstance.put(url, cleanData, getAuthHeader(token));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('API Error Details:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};



export const deactivateCompanyPage = async (companyId: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/company/delete-company-profile/${companyId}`;
    
    console.log('Deactivating company page:', companyId);
    
    const response = await axiosInstance.delete(url, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('Failed to deactivate company page:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to deactivate company page');
  }
};



export const createJobFromCompany = async (organizationId: string, jobData: Partial<Job>): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/company/create-job-from-company/${organizationId}`;
    
    // Clean up data before sending - removing undefined values
    const cleanData = Object.fromEntries(
      Object.entries(jobData).filter(([_, v]) => v !== undefined && v !== '')
    );
    
    console.log('Creating job with data:', cleanData);
    
    const response = await axiosInstance.post(url, cleanData, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('API Error Details:', error.response?.data || error.message);
    
    // Enhanced error handling
    if (error.response?.status === 401) {
      throw new Error('Authentication error. Please log in again.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to create job. Please try again.');
    }
  }
};

// Get jobs from a company
export const getJobsFromCompany = async (organizationId: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/company/get-jobs-from-company/${organizationId}`;
    
    const response = await axiosInstance.get(url, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch company jobs:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to load company jobs');
  }
};

export const searchCompanies = async (query: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const url = `/api/v1/search/${query}`;
    
    const response = await axiosInstance.get(url, getAuthHeader(token));
    return response.data;
  } catch (error: any) {
    console.error('Failed to search companies:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to search companies');
  }
};