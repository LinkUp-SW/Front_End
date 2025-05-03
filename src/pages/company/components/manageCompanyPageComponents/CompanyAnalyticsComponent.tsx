import { useEffect, useState } from 'react';
import { getCompanyJobsAnalytics, JobAnalytics } from '@/endpoints/company';
import { toast } from 'sonner';

interface AnalyticsComponentProps {
  companyId: string | undefined;
}

const AnalyticsComponent: React.FC<AnalyticsComponentProps> = ({ companyId }) => {
  const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyId) return;
      
      try {
        setIsLoading(true);
        const response = await getCompanyJobsAnalytics(companyId);
        setAnalytics(response.analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-300">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-gray-700 dark:text-gray-300">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Jobs</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analytics.totalJobs}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Open Jobs</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{analytics.openJobs}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Closed Jobs</h3>
          <p className="text-3xl font-bold text-gray-500 dark:text-gray-400 mt-1">{analytics.closedJobs}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{analytics.totalApplications}</p>
        </div>
      </div>

      {/* Application Status Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Status Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-gray-700 dark:text-gray-300">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {analytics.applicationStatusDistribution.Pending || 0}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-700 dark:text-gray-300">Accepted</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {analytics.applicationStatusDistribution.Accepted || 0}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-gray-700 dark:text-gray-300">Rejected</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {analytics.applicationStatusDistribution.Rejected || 0}
            </p>
          </div>
          {analytics.applicationStatusDistribution.Viewed && (
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">Viewed</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {analytics.applicationStatusDistribution.Viewed}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Jobs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Jobs by Applications</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applications
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analytics.topJobs.map((job) => (
                <tr key={job.job_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {job.job_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {job.applications_count}
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

export default AnalyticsComponent;