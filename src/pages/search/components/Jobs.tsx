import React, { useEffect, useState } from "react";
import { getSearchJobs, SearchJobs, saveJob } from "@/endpoints/jobs";
import { toast } from "sonner";

const Jobs: React.FC<{ query: string }> = ({ query }) => {
  const [jobs, setJobs] = useState<SearchJobs[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await getSearchJobs(query, null, 3);
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchJobs();
  }, [query]);

  const handleSaveJob = async (jobId: string) => {
    try {
      setSavingId(jobId);
      await saveJob(jobId);
      setSavedJobs((prev) => new Set(prev).add(jobId));
      toast.success("Job saved successfully!");
    } catch (error) {
      console.error("Failed to save job", error);
      toast.error("Failed to save job");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <div className="flex justify-center mt-6">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Jobs</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-4 border-b last:border-none bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={job.organization.logo} alt={job.organization.name} className="w-12 h-12 rounded-md" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{job.job_title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{job.organization.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {job.experience_level} · {job.workplace_type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">EGP {job.salary.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.timeAgo}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSaveJob(job._id)}
                  disabled={savingId === job._id || savedJobs.has(job._id)}
                  className={`px-4 py-2 border rounded-full 
                    ${savedJobs.has(job._id) ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'} 
                    hover:bg-blue-100 dark:hover:bg-gray-700 disabled:opacity-50`}
                >
                  {savedJobs.has(job._id)
                    ? "Saved"
                    : savingId === job._id
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-2 py-2 text-gray-500 dark:text-gray-400 border-t pt-2">
          See all job results in Egypt
        </button>
      </div>
    </div>
  );
};

export default Jobs;
