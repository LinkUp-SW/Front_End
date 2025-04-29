
// Company interface for API responses
export interface Company {
  _id: string;
  name: string;
  logo: string;
  category_type?: string;
  unique_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  tagline?: string; 
  founded?: string;
  overview?: string;
  description?: string;
  industry?: string;
  location?: {
    country: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    location_name: string;
  } | null;
  size?: string;
  type?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  specialties?: string[];
  mission?: string;
  values?: string[];
  benefits?: string[];
  culture?: string;
  followerCount?: number;
  followers_count?: number;
  posts?: string[];
  followers?: string[];
  blocked?: string[];
  conversations?: string[];
  admins?: string[];
  __v?: number;
  industryType?: string;
  employeeCount?: string;
}

// API response interfaces
export interface UserCompaniesResponse {
  organizations: Company[];
}

export interface CompanyProfileResponse {
  message?: string;
  companyProfile: Company;
  company?: Company; 
  success?: boolean; 
}

// Request payload interface
export interface CompanyProfileData {
  name: string;
  category_type: "company" | "education";
  unique_url: string;
  website?: string;
  logo?: string;
  email?: string;
  phone?: string;
  tagline?: string; 
  founded?: string;
  overview?: string;
  description?: string;
  industry: string;
  location?: {
    country: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    location_name: string;
  } | null;
  size: string;
  type: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  specialties?: string[];
  mission?: string;
  values?: string[];
  benefits?: string[];
  culture?: string;
}


export interface Job {
  _id: string; // Using _id to match backend MongoDB convention
  id?: string; // For compatibility
  job_title?: string;
  title?: string; // For compatibility
  company: string;
  job_description?: string;
  description?: string; // For compatibility
  job_status: string;
  workplace_type?: string;
  workMode?: 'On-site' | 'Remote' | 'Hybrid';
  location: string;
  experience_level: 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director' | 'Executive';
  isRemote?: boolean;
  isSaved?: boolean;
  logo?: string;
  isPromoted?: boolean;
  hasEasyApply?: boolean;
  reviewTime?: string;
  alumniCount?: number;
  applied?: boolean;
  connections?: number;
  verified?: boolean;
  responseTime?: string;
  postedTime?: string;
  companyInfo?: Company;
  qualifications?: string[];
  responsibilities?: string[];
  benefits?: string[];
  salary: string;
}

export interface JobsResponse {
  jobs: Job[];
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