import React, { useEffect, useState } from "react";
import { Job } from "../../pages/jobs/types";
import {
  fetchSavedJobs,
  fetchAppliedJobs,
  removeFromSaved,
  convertJobDataToJob,
  convertAppliedJobDataToJob,
} from "../../endpoints/jobs";
import Cookies from "js-cookie";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import noSavedJobsDark from "@/assets/no-saved-jobs-dark.svg";
import noSavedJobsLight from "@/assets/no-saved-jobs-light.svg";

enum TabState {
  SAVED = "saved",
  APPLIED = "applied",
}

interface AppliedJob extends Job {
  application_status: string;
  application_id: string;
}

const SavedJobsDashboard: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabState>(TabState.SAVED);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const navigate = useNavigate();

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleDarkModeChange = (e: MediaQueryListEvent) =>
      setIsDarkMode(e.matches);

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("linkup_auth_token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const jobsData = await fetchSavedJobs();
      const jobs = jobsData.map((jobData) => convertJobDataToJob(jobData));
      setSavedJobs(jobs);
    } catch (error) {
      console.error("Error loading saved jobs:", error);
      setError("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const loadAppliedJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("linkup_auth_token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const jobsData = await fetchAppliedJobs();
      const jobs = jobsData.map((jobData) =>
        convertAppliedJobDataToJob(jobData)
      );
      setAppliedJobs(jobs);
    } catch (error) {
      console.error("Error loading applied jobs:", error);
      setError("Failed to load applied jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === TabState.SAVED) {
      loadSavedJobs();
    } else {
      loadAppliedJobs();
    }

    const handleSavedJobsUpdated = () => {
      if (activeTab === TabState.SAVED) {
        loadSavedJobs();
      }
    };

    const handleAppliedJobsUpdated = () => {
      if (activeTab === TabState.APPLIED) {
        loadAppliedJobs();
      }
    };

    window.addEventListener("savedJobsUpdated", handleSavedJobsUpdated);
    window.addEventListener("appliedJobsUpdated", handleAppliedJobsUpdated);

    return () => {
      window.removeEventListener("savedJobsUpdated", handleSavedJobsUpdated);
      window.removeEventListener(
        "appliedJobsUpdated",
        handleAppliedJobsUpdated
      );
    };
  }, [activeTab]);

  const handleRemoveFromSaved = async (jobId: string) => {
    try {
      await removeFromSaved(jobId);

      // Update local state
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));

      // Dispatch event to notify other components
      window.dispatchEvent(new Event("savedJobsUpdated"));
    } catch (error) {
      console.error("Error removing saved job:", error);
      alert("Failed to remove job from saved jobs");
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/see-more?selected=${jobId}`);
  };

  const handleTabChange = (tab: TabState) => {
    setActiveTab(tab);
    // Reset error state when changing tabs
    setError(null);
    // Load the appropriate jobs for the selected tab
    if (tab === TabState.SAVED) {
      loadSavedJobs();
    } else {
      loadAppliedJobs();
    }
  };

  // Get status badge color based on application status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Viewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <p className="text-red-500">{error}</p>
          {error === "Authentication required" && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Please log in to view your {activeTab} jobs.
            </p>
          )}
        </div>
      );
    }

    if (activeTab === TabState.SAVED && savedJobs.length === 0) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src={isDarkMode ? noSavedJobsDark : noSavedJobsLight}
              alt="No saved jobs"
              className="w-48 h-48 mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400 text-2xl">
              No saved jobs.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse jobs and click "Save" to add them here.
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === TabState.APPLIED && appliedJobs.length === 0) {
      return (
        <div className="border-t pt-6 pb-4 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src={isDarkMode ? noSavedJobsDark : noSavedJobsLight}
              alt="No applied jobs"
              className="w-48 h-48 mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400 text-2xl">
              No applied jobs.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Apply to jobs to see them listed here.
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === TabState.SAVED) {
      return (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="border-t pt-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleJobClick(job.id!)}
            >
              <div className="flex justify-between">
                <div className="flex">
                  <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-orange-500 rounded-full transform translate-y-1/4"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      {job.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.location} ({job.workMode})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posted {job.postedTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the parent div click from triggering
                      handleRemoveFromSaved(job.id!);
                    }}
                    title="Remove from saved"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Show applied jobs
      return (
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <div
              key={job.id}
              className="border-t pt-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleJobClick(job.id!)}
            >
              <div className="flex justify-between">
                <div className="flex">
                  <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-orange-500 rounded-full transform translate-y-1/4"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      {job.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.location} ({job.workMode})
                    </p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeColor(
                          job.application_status
                        )}`}
                      >
                        {job.application_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
          My Jobs
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-1 rounded-full ${
              activeTab === TabState.SAVED
                ? "bg-green-700 text-white"
                : "bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => handleTabChange(TabState.SAVED)}
          >
            Saved
          </button>
          <button
            className={`px-4 py-1 rounded-full ${
              activeTab === TabState.APPLIED
                ? "bg-green-700 text-white"
                : "bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => handleTabChange(TabState.APPLIED)}
          >
            Applied
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default SavedJobsDashboard;
