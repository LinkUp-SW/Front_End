import { useEffect, useState } from "react";
import { getCompanyJobsAnalytics, JobAnalytics } from "@/endpoints/company";
import { toast } from "sonner";
import {
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiBarChart2,
  FiEye,
  FiClock,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

interface AnalyticsComponentProps {
  companyId: string | undefined;
}

const AnalyticsComponent: React.FC<AnalyticsComponentProps> = ({
  companyId,
}) => {
  const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        const response = await getCompanyJobsAnalytics(companyId);
        setAnalytics(response.analytics);

        // Start animation after data is loaded
        setTimeout(() => {
          setShowAnimation(true);
        }, 100);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
          <div className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-700 dark:text-gray-300">
        <FiAlertCircle className="w-12 h-12 text-gray-500 mb-3" />
        <p className="text-lg font-medium">No analytics data available</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Try again later or check your company settings
        </p>
      </div>
    );
  }

  // Calculate percentages for progress bars
  const totalApplications = analytics?.totalApplications || 1; // Prevent division by zero
  const pendingPercentage =
    ((analytics?.applicationStatusDistribution?.Pending || 0) /
      totalApplications) *
    100;
  const acceptedPercentage =
    ((analytics?.applicationStatusDistribution?.Accepted || 0) /
      totalApplications) *
    100;
  const rejectedPercentage =
    ((analytics?.applicationStatusDistribution?.Rejected || 0) /
      totalApplications) *
    100;
  const viewedPercentage =
    ((analytics?.applicationStatusDistribution?.Viewed || 0) /
      totalApplications) *
    100;

  return (
    <div
      className={`space-y-8 transition-opacity duration-500 ${
        showAnimation ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Dashboard Title */}
      <div className="flex items-center">
        <FiBarChart2 className="text-blue-600 dark:text-blue-400 w-6 h-6 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-gray-600 transform transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Jobs
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalJobs}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-green-200 dark:border-gray-600 transform transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Open Jobs
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {analytics.openJobs}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 transform transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-lg">
              <FiXCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Closed Jobs
              </h3>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                {analytics.closedJobs}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-purple-200 dark:border-gray-600 transform transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Applications
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {analytics.totalApplications}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Status Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Application Status Distribution
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiClock className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Pending
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {analytics?.applicationStatusDistribution?.Pending || 0} (
                {Math.round(pendingPercentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Accepted
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {analytics?.applicationStatusDistribution?.Accepted || 0} (
                {Math.round(acceptedPercentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${acceptedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiXCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Rejected
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {analytics?.applicationStatusDistribution?.Rejected || 0} (
                {Math.round(rejectedPercentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${rejectedPercentage}%` }}
              ></div>
            </div>
          </div>

          {analytics?.applicationStatusDistribution?.Viewed && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiEye className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Viewed
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {analytics?.applicationStatusDistribution?.Viewed} (
                  {Math.round(viewedPercentage)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${viewedPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Jobs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Top Jobs by Applications
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 rounded-tl-lg"
                >
                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 rounded-tr-lg"
                >
                  Applications
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analytics?.topJobs?.map((job, index) => (
                <tr
                  key={job.job_id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index === 0 ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <FiBriefcase className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.job_title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {job.job_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          index === 0
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {job.applications_count}
                      </div>
                      <div className="ml-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0
                              ? "bg-blue-500"
                              : "bg-gray-500 dark:bg-gray-400"
                          }`}
                          style={{
                            width: `${
                              (job.applications_count /
                                analytics.topJobs[0].applications_count) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {analytics?.topJobs?.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <FiAlertCircle className="w-6 h-6 mb-2" />
                      <p>No job application data available yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;
