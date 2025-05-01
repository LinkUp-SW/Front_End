import React, { useEffect, useState } from "react";
import { getSearchJobs, SearchJobs, saveJob, removeFromSaved } from "@/endpoints/jobs";
import { toast } from "sonner";
import Cookies from "js-cookie";

const Jobs: React.FC<{ query: string }> = ({ query }) => {
  const [jobs, setJobs] = useState<SearchJobs[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const token = Cookies.get("linkup_auth_token");

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token || !query) {
        setJobs([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getSearchJobs(token, query, null, 3);
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, query]);

  const handleToggleSaveJob = async (jobId: string, isSaved: boolean) => {
    try {
      setSavingId(jobId);
      if (isSaved) {
        await removeFromSaved(jobId);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, is_saved: false } : job
          )
        );
        toast.success("Job unsaved successfully!");
      } else {
        await saveJob(jobId);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, is_saved: true } : job
          )
        );
        toast.success("Job saved successfully!");
      }
    } catch (error) {
      console.error("Failed to toggle save job", error);
      toast.error("Failed to save or unsave job");
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
                  onClick={() => handleToggleSaveJob(job._id, job.is_saved)}
                  disabled={savingId === job._id}
                  className={`px-4 py-2 border rounded-full 
                    ${job.is_saved ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'} 
                    hover:bg-blue-100 dark:hover:bg-gray-700 disabled:opacity-50`}
                >
                  {savingId === job._id
                    ? (job.is_saved ? "Unsaving..." : "Saving...")
                    : job.is_saved
                    ? "Saved"
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
