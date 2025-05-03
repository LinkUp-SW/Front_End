import axiosInstance from "@/services/axiosInstance";
import { CommentType, PostType } from "@/types";

export interface Report {
  content_id: string;
  content_mongo_id: string;
  content_ref: string;
  type: string;
  reasons: string[];
  created_at: number; // Unix timestamp
  status: "pending" | "resolved"; // assuming only these two
  admin_action: string; // e.g., "none", "deleted", etc.
  report_count: number;
}

interface StatusCounts {
  pending: number;
  resolved: number;
}

interface ReportResponse {
  message: string;
  success: boolean;
  data: ReportData;
}

interface ReportData {
  reports: Report[];
  total_count: number;
  status_counts: StatusCounts;
  next_cursor: number;
}

interface ReportDetailsReponse {
  message: string;
  success: boolean;
  data: ReportDetailsPostData | ReportDetailsCommentData | ReportDetailsJobData;
}

export interface ReportDetailsPostData {
  content: PostType;
  parent_post?: PostType;
  total_count: number;
  reasons_summary: {
    [key: string]: number;
  };
}

export interface ReportDetailsCommentData {
  content: CommentType;
  parent_post?: PostType;
  total_count: number;
  reasons_summary: {
    [key: string]: number;
  };
}

export interface ReportDetailsJobData {
  content: {
    _id: string;
    type: string;
    title: string;
    description: string;
    qualifications: string[];
    responsibilities: string[];
    benefits: string[];
    organization: {
      _id: string;
      name: string;
      logo: string;
    };
  };
  parent_post?: PostType;
  total_count: number;
  reasons_summary: {
    [key: string]: number;
  };
}

export interface DashboardDataResponse {
    summary: {
      reported_content: number;
      total_jobs: number; 
      total_users: number;
      delta: {
        reports: number;
        jobs: number;
        users: number;
      };
    };
    content_moderation: {
      pending_reviews: number;
      resolved_today: number;
      avg_response_time_hours: number;
    };
    job_management: {
      pending_approval: number;
      approved_today: number;
      rejected_today: number;
    };
    platform_analytics: {
      new_users_today: number;
      content_posted_today: number;
    };
  }
  export interface AnalyticsDataResponse {
    message: string;
    period: string; 
    interval: string; 
    data: {
      userGrowth: {
        date: string;
        count: number;
      }[];
      contentCreation: {
        posts: {
          date: string;
          count: number;
        }[];
      };
      engagementMetrics: {
        reactions: {
          date: string;
          type: string; 
          count: number;
        }[];
        connections: {
          date: string;
          count: number;
        }[];
        comments: {
          date: string;
          count: number;
        }[];
      };
      moderationMetrics: {
        reportsCreated: {
          date: string;
          count: number;
        }[];
        reportsResolved: {
          date: string;
          count: number;
          avgResolutionHours: number;
        }[];
      };
      jobMetrics: {
        jobsPosted: {
          date: string;
          count: number;
        }[];
        applicationOutcomes: {
          date: string;
          status: string; 
          count: number;
        }[];
      };
    };
  }
  
  
  

export const getreports = async (
  token: string,
  status: string,
  cursor: number | null,
  limit: number
): Promise<ReportResponse> => {
  const response = await axiosInstance.get("/api/v1/admin/report", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { status, cursor, limit },
  });
  return response.data;
};

export const getReportDetails = async (
  token: string,
  contentType: string,
  contentRef: string
): Promise<ReportDetailsReponse> => {
  const response = await axiosInstance.get(
    `/api/v1/admin/report/content/${contentType}/${contentRef}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};



export const DeleteContent = async (
  token: string,
  contentType: string,
  contentRef: string,
  
): Promise<{ message: string; success: boolean }> => {
  const response = await axiosInstance.delete(
    `/api/v1/admin/report/resolve/${contentType}/${contentRef}`,
    
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const DismissReport = async (
    token: string,
    contentType: string,
    contentRef: string,
    
  ): Promise<{ message: string; success: boolean }> => {
    const response = await axiosInstance.patch(
      `/api/v1/admin/report/resolve/${contentType}/${contentRef}`,
      {},
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };
  

  export const getDashboardData = async (
    token: string,
   
  ): Promise<DashboardDataResponse> => {
    const response = await axiosInstance.get("/api/v1/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    });
    return response.data;
  };

  export const getAnalyticsData = async (
    token: string,
    periodParam:string,
    metricParam:string
   
  ): Promise<AnalyticsDataResponse> => {
    const response = await axiosInstance.get("/api/v1/admin/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {periodParam, metricParam},
    
    });
    return response.data;
  };