// components/Dashboard.tsx
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { DashboardDataResponse as DashboardData } from "@/endpoints/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardData } from "@/endpoints/admin";

const SmallStatCard = ({
  title,
  value,
  change,
  isNegative,
}: {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}) => {
  const changeColor = isNegative
    ? "text-red-500 dark:text-red-400"
    : "text-green-500 dark:text-green-400";

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 flex flex-col justify-between transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className={`text-xs mt-1 ${changeColor}`}>{change}</div>
    </div>
  );
};

const LargeInfoCard = ({
  title,
  description,
  stats,
  buttonLabel,
}: {
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  buttonLabel: string;
}) => {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-6 flex flex-col justify-between transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl">
      <div>
        <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</div>
        <div className="space-y-3 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-auto bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 px-5 rounded-xl text-sm font-medium hover:opacity-90 transition">
        {buttonLabel}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("linkup_auth_token") ?? "";
        const result = await getDashboardData(token);
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <div className="hidden md:block mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Welcome to the admin panel. Monitor and manage Link UP content and activities.
        </p>
      </div>

      {/* First row: Small cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SmallStatCard
          title="Reported Content"
          value={data.summary.reported_content.toString()}
          change={`${data.summary.delta.reports >= 0 ? "+" : ""}${data.summary.delta.reports} since yesterday`}
          isNegative={data.summary.delta.reports < 0}
        />
        <SmallStatCard
          title="Total Jobs"
          value={data.summary.total_jobs.toString()}
          change={`${data.summary.delta.jobs >= 0 ? "+" : ""}${data.summary.delta.jobs} since yesterday`}
          isNegative={data.summary.delta.jobs < 0}
        />
        <SmallStatCard
          title="Active Users"
          value={data.summary.total_users.toString()}
          change={`${data.summary.delta.users >= 0 ? "+" : ""}${data.summary.delta.users} since yesterday`}
          isNegative={data.summary.delta.users < 0}
        />
      </div>

      {/* Second row: Large cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <LargeInfoCard
          title="Content Moderation"
          description="Review and manage reported content"
          stats={[
            {
              label: "Pending reviews",
              value: data.content_moderation.pending_reviews.toString(),
            },
            {
              label: "Resolved today",
              value: data.content_moderation.resolved_today.toString(),
            },
            {
              label: "Avg. response time",
              value: `${data.content_moderation.avg_response_time_hours.toFixed(1)} hours`,
            },
          ]}
          buttonLabel="View Reports"
        />
        <LargeInfoCard
          title="Job Posting Management"
          description="Review and manage job listings"
          stats={[
            {
              label: "Pending approval",
              value: data.job_management.pending_approval.toString(),
            },
            {
              label: "Approved today",
              value: data.job_management.approved_today.toString(),
            },
            {
              label: "Rejected today",
              value: data.job_management.rejected_today.toString(),
            },
          ]}
          buttonLabel="Manage Jobs"
        />
        <LargeInfoCard
          title="Platform Analytics"
          description="View platform performance metrics"
          stats={[
            {
              label: "New users today",
              value: data.platform_analytics.new_users_today.toString(),
            },
            {
              label: "Content posted today",
              value: data.platform_analytics.content_posted_today.toString(),
            },
          ]}
          buttonLabel="View Analytics"
        />
      </div>
    </div>
  );
};

export default Dashboard;
