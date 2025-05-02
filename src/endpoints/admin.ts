import axiosInstance from "@/services/axiosInstance";
import { PostType } from "@/types";

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
  data: ReportDetailsData;
}
export interface ReportDetailsData {
  content: {
    parent_post?: PostType;
  };
  total_count: number;
  reasons_summary: {
    [key: string]: number;
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
