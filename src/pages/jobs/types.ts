export interface CompanyInfo {
  name: string;
  logo: string;
  followers: string;
  industryType: string;
  employeeCount: string;
  linkedInPresence: string;
  description: string;
  hasMoreDescription?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  isSaved: boolean;
  logo: string;
  isPromoted: boolean;
  hasEasyApply: boolean;
  timePosted?: string;
  reviewTime?: string;
  alumniCount?: number;
  applied?: boolean;
  connections?: number;
  verified?: boolean;
  responseTime?: string;
  postedTime?: string;
  workMode?: string;
  companyInfo?: CompanyInfo;  
}

export interface RecentSearch {
  query: string;
  location: string;
  applyOn: boolean;
  alert?: boolean;
}