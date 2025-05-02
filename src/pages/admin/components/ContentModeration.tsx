import { useEffect, useRef, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { FiSearch } from "react-icons/fi";
import { getreports } from "@/endpoints/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Report {
  content_id: string;
  content_mongo_id: string;
  content_ref: string;
  type: string;
  reasons: string[];
  created_at: number;
  status: "pending" | "resolved";
  admin_action: string;
  report_count: number;
}

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const token = Cookies.get("linkup_auth_token") ?? "";

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = useCallback(async () => {
    if (!token || loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await getreports(token, activeTab, cursor, 5);
      if (res.success) {
        const newReports: Report[] = res.data.reports || [];

        setReports((prev) => {
          const existingIds = new Set(prev.map((r) => r.content_id));
          const filtered = newReports.filter((r) => !existingIds.has(r.content_id));
          return [...prev, ...filtered];
        });

        if (!res.data.next_cursor || newReports.length === 0) {
          setHasMore(false);
        } else {
          setCursor(res.data.next_cursor);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, cursor, hasMore, loading]);

  useEffect(() => {
    setReports([]);
    setCursor(null);
    setHasMore(true);
  }, [activeTab]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchReports();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchReports, hasMore, loading]);

  const filteredReports = reports.filter((report) => {
    const q = searchQuery.toLowerCase();
    return (
      report.content_id.toLowerCase().includes(q) ||
      report.type.toLowerCase().includes(q) ||
      report.reasons.some((r) => r.toLowerCase().includes(q))
    );
  });

  const handleDeleteContent = (report: Report) => {
    console.log("Delete content for", report.content_id);
    // Add actual delete logic here
  };

  const handleDismissReport = (report: Report) => {
    console.log("Dismiss report for", report.content_id);
    // Add actual dismiss logic here
  };

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-6 mb-12 overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content Moderation</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Review and manage reported content across the platform.</p>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search reports..."
          className="pl-10 w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {["pending", "resolved"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab(tab as "pending" | "resolved")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {activeTab === "pending" ? "Pending Reports" : "Resolved Reports"}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {activeTab === "pending"
            ? "Review and take action on pending content reports."
            : "View previously resolved content reports."}
        </p>

        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Reason(s)</th>
                <th className="px-4 py-2">Reported</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Reports</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={`${report.content_id}-${report.created_at}`} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 font-semibold">{report.content_id}</td>
                  <td className="px-4 py-2">{report.type}</td>
                  <td className="px-4 py-2">{report.reasons.join(", ")}</td>
                  <td className="px-4 py-2">
                    {new Date(report.created_at * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{report.report_count}</td>
                  <td className="px-4 py-2">
                    {report.status === "pending" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-lg shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700"
                            onClick={() => setSelectedReport(report)}
                          >
                            Manage
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Report</DialogTitle>
                            <DialogDescription>
                              {selectedReport
                                ? `Choose an action for content ID: ${selectedReport.content_id}`
                                : "No report selected."}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-3 mt-4">
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl"
                              onClick={() => {
                                if (selectedReport) handleDeleteContent(selectedReport);
                              }}
                            >
                              Delete Content
                            </button>
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl"
                              onClick={() => {
                                if (selectedReport) handleDismissReport(selectedReport);
                              }}
                            >
                              Dismiss Report
                            </button>
                            <button
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-xl"
                            >
                              Cancel
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <button className="text-green-500 hover:text-green-700">✓</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={observerRef} className="h-10" />
          {loading && <p className="text-center text-gray-500 py-4">Loading...</p>}
          {!loading && !hasMore && filteredReports.length === 0 && (
            <p className="text-center text-gray-500 py-4">No reports found.</p>
          )}
          {!loading && !hasMore && filteredReports.length > 0 && (
            <p className="text-center text-gray-500 py-4">No more reports to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;
