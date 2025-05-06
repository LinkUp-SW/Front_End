import React, { useState, useEffect, useCallback } from "react";
import { getJobsFromCompany } from "@/endpoints/company";
import { toast } from "sonner";
import manOnChair from "@/assets/man_on_chair.svg";
interface JobViewerProps {
  companyId?: string;
  isVisible: boolean;
}

interface Job {
  _id: string;
  job_title: string;
  job_status: string;
  location: string;
  workplace_type: string;
  experience_level: string;
  posted_time: string;
}

interface ApiJob {
  _id: string;
  job_title: string;
  job_status: string;
  location: string;
  workplace_type: string;
  experience_level: string;
  posted_time?: string;
}

function sanitizeJob(apiJob: ApiJob): Job {
  return {
    _id: apiJob._id || "",
    job_title: apiJob.job_title || "Untitled Job",
    job_status: apiJob.job_status || "open",
    location: apiJob.location || "Unknown location",
    workplace_type: apiJob.workplace_type || "Unknown",
    experience_level: apiJob.experience_level || "Not specified",
    posted_time: apiJob.posted_time || new Date().toISOString(),
  };
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-medium text-lg dark:text-white">{job.job_title}</h3>
        {job.job_status.toLowerCase() === "open" && (
          <span className="px-2 py-1 text-xs rounded-full inline-block w-fit bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
            {job.job_status}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex flex-wrap items-center">
        <span className="mr-2">{job.location}</span>
        <span className="hidden sm:inline mx-2 dark:text-gray-500">•</span>
        <span className="mr-2">{job.workplace_type}</span>
        <span className="hidden sm:inline mx-2 dark:text-gray-500">•</span>
        <span>{job.experience_level}</span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Posted on: {new Date(job.posted_time).toLocaleDateString()}
      </p>

      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors">
        View Details
      </button>
    </div>
  );
};

const JobViewerComponent: React.FC<JobViewerProps> = ({
  companyId,
  isVisible,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;

    try {
      setIsLoading(true);
      const response = await getJobsFromCompany(companyId);

      const openJobs = (response.jobs as ApiJob[])
        .filter((job) => job.job_status?.toLowerCase() === "open")
        .map(sanitizeJob);

      setJobs(openJobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to load job listings");
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (isVisible) {
      fetchJobs();
    }
  }, [fetchJobs, isVisible]);

  if (!isVisible) return null;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 my-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Jobs</h2>
        <div className="flex justify-center items-center h-48">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 dark:border-blue-400 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">
              Loading job listings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 my-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Open Positions</h2>

      {jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-40 h-40 mb-4 flex justify-center">
            <img
              src={manOnChair}
              alt="No jobs available"
              className="w-full dark:filter dark:invert-[.25]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/100/100";
              }}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">
            No open positions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
            This company doesn't have any open positions right now.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobViewerComponent;
