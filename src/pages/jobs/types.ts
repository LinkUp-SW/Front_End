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
  }
  
  export interface RecentSearch {
    query: string;
    location: string;
    applyOn: boolean;
    alert?: boolean;
  }