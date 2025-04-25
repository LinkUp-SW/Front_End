// Company interface for API responses
export interface Company {
  _id: string;
  name: string;
  logo: string;
  category_type?: string;
  unique_url?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: {
    country: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    location_name: string;
  };
  size?: string;
  type?: string;
  posts?: any[];
  followers?: any[];
  blocked?: any[];
  conversations?: any[];
  admins?: string[];
  __v?: number;
  industryType: string;
  employeeCount: string;
  phone?: string;
  followers_count?: number
}

// API response interfaces
export interface UserCompaniesResponse {
  organizations: Company[];
}

export interface CompanyProfileResponse {
  message: string;
  companyProfile: Company;
}

// Request payload interface
export interface CompanyProfileData {
  name: string;
  category_type: "company" | "education";
  unique_url: string;
  website?: string;
  logo?: string;
  description?: string;
  industry: string;
  location?: string;
  size: string;
  type: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience_level:'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director' | 'Executive';
  isRemote: boolean;
  isSaved: boolean;
  logo: string;
  isPromoted: boolean;
  hasEasyApply: boolean;
  reviewTime?: string;
  alumniCount?: number;
  applied?: boolean;
  connections?: number;
  verified?: boolean;
  responseTime?: string;
  postedTime?: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  companyInfo?: Company;  
  description?: string;
  qualifications?: string[];
  responsibilities?: string[];
  benefits?: string[];
  salary: string;
}

export interface RecentSearch {
  query: string;
  location: string;
  applyOn: boolean;
  alert?: boolean;
}

export interface JobFilters {
  locations: string[];
  company: string[];
  experienceLevels: string[];
  workModes: string[];
  salaryRanges: string[];
}