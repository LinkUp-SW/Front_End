export interface CompanyInfo {
  name: string;
  logo: string;
  followers: string;
  industryType: string;
  employeeCount: string;
  linkupPresence: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience_level:'Internship' | 'Entry level' | 'Associate' | 'Mid-Senior level' | 'Director' | 'Executive';
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
  companyInfo?: CompanyInfo;  
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