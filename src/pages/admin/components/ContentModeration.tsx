import { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface Report {
  id: string;
  type: string;
  reason: string;
  reported: string;
  status: "Pending" | "Resolved";
  reports: number;
}

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState<"Pending" | "Resolved" | "All Reports">("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const reports: Report[] = [
    {
      id: "REP-001",
      type: "Comment",
      reason: "Harassment",
      reported: "Apr 15, 2023",
      status: "Pending",
      reports: 3,
    },
    {
      id: "REP-002",
      type: "Post",
      reason: "Inappropriate Content",
      reported: "Apr 15, 2023",
      status: "Pending",
      reports: 5,
    },
    {
      id: "REP-003",
      type: "Job Listing",
      reason: "Misleading Information",
      reported: "Apr 15, 2023",
      status: "Pending",
      reports: 2,
    },
    {
      id: "REP-004",
      type: "Comment",
      reason: "Spam",
      reported: "Apr 14, 2023",
      status: "Resolved",
      reports: 7,
    },
    {
      id: "REP-005",
      type: "Post",
      reason: "Hate Speech",
      reported: "Apr 14, 2023",
      status: "Resolved",
      reports: 12,
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "Pending") return matchesSearch && report.status === "Pending";
    if (activeTab === "Resolved") return matchesSearch && report.status === "Resolved";
    return matchesSearch;
  });

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-6 transform transition duration-300 mb-12 overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Content Moderation
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
        Review and manage reported content across the platform.
      </p>

      <div className="relative mb-4 sm:mb-6">
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

      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "Pending"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "Resolved"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("Resolved")}
        >
          Resolved
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "All Reports"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("All Reports")}
        >
          All Reports
        </button>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
          {activeTab === "Pending" && "Pending Reports"}
          {activeTab === "Resolved" && "Resolved Reports"}
          {activeTab === "All Reports" && "All Reports"}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          {activeTab === "Pending" && "Review and take action on pending content reports."}
          {activeTab === "Resolved" && "View previously resolved content reports."}
          {activeTab === "All Reports" && "View all content reports."}
        </p>

        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">ID</th>
                <th className="px-4 py-2 whitespace-nowrap">Type</th>
                <th className="px-4 py-2 whitespace-nowrap">Reason</th>
                <th className="px-4 py-2 whitespace-nowrap">Reported</th>
                <th className="px-4 py-2 whitespace-nowrap">Status</th>
                <th className="px-4 py-2 whitespace-nowrap">Reports</th>
                <th className="px-4 py-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 font-semibold whitespace-nowrap">{report.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.type}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.reason}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.reported}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        report.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.reports}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.status === "Pending" ? (
                      <button className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                        €
                      </button>
                    ) : (
                      <button className="text-green-500 hover:text-green-700">
                        ✓
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;
