import axiosInstance from "@/services/axiosInstance";

export interface Report {
    content_id: string;
    content_mongo_id: string;
    content_ref: string;
    type: string;
    reasons: string[];
    created_at: number; // Unix timestamp
    status: 'pending' | 'resolved'; // assuming only these two
    admin_action: string; // e.g., "none", "deleted", etc.
    report_count: number;
  }
  
  interface StatusCounts {
    pending: number;
    resolved: number;
  }
  
  interface ReportData {
    reports: Report[];
    total_count: number;
    status_counts: StatusCounts;
    next_cursor: number;
  }
  
  interface ReportResponse {
    message: string;
    success: boolean;
    data: ReportData;
  }
  

  export const getreports = async (
    token: string,
    status: string,
    cursor: number | null,
    limit:number
  ): Promise<ReportResponse> => {
    const response = await axiosInstance.get(
      "/api/v1/admin/report",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status, cursor,limit },
      }
    );
    return response.data;
  }
  