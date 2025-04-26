const SmallStatCard = ({
    title,
    value,
    change,
  }: {
    title: string;
    value: string;
    change: string;
  }) => {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 flex flex-col justify-between transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-xs mt-1 text-green-500 dark:text-green-400">{change}</div>
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
    return (
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-all duration-500 overflow-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Welcome to the admin panel. Monitor and manage Link UP content and activities.
          </p>
        </div>
  
        {/* First row: Small cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <SmallStatCard title="Reported Content" value="100" change="+10 since yesterday" />
          <SmallStatCard title="Pending Jobs" value="100" change="+10 since yesterday" />
          <SmallStatCard title="Active Users" value="100" change="+10 since yesterday" />
          <SmallStatCard title="Deleted Accounts" value="10.5%" change="+10.1% from last week" />
        </div>
  
        {/* Second row: Large cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <LargeInfoCard
            title="Content Moderation"
            description="Review and manage reported content"
            stats={[
              { label: "Pending reviews", value: "2" },
              { label: "Resolved today", value: "2" },
              { label: "Avg. response time", value: "2 hours" },
            ]}
            buttonLabel="View Reports"
          />
          <LargeInfoCard
            title="Job Posting Management"
            description="Review and manage job listings"
            stats={[
              { label: "Pending approval", value: "2" },
              { label: "Approved today", value: "2" },
              { label: "Rejected today", value: "2" },
            ]}
            buttonLabel="Manage Jobs"
          />
          <LargeInfoCard
            title="Platform Analytics"
            description="View platform performance metrics"
            stats={[
              { label: "New users today", value: "2" },
              { label: "Content posted today", value: "2" },
              { label: "Platform uptime", value: "2.2%" },
            ]}
            buttonLabel="View Analytics"
          />
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  