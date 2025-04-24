import axiosInstance from "@/services/axiosInstance";
import Cookies from 'js-cookie';
import { 
  Company, 
  CompanyProfileData, 
  CompanyProfileResponse, 
  UserCompaniesResponse 
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
    console.log('Updating company with data:', companyData);
    
    // Clean up data before sending - removing undefined values
    const cleanData = Object.fromEntries(
      Object.entries(companyData).filter(([_, v]) => v !== undefined && v !== '')
    );
    
    const response = await axiosInstance.put(url, cleanData, getAuthHeader(token));
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