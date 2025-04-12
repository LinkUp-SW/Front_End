import React, { useEffect, useState } from "react";
import { Job } from "../../pages/jobs/types";

const JobsDashboard: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Job[]>([]);

  useEffect(() => {
    // Load saved jobs from localStorage
    const loadSavedPosts = () => {
      const savedJobsString = localStorage.getItem("savedJobs");
      if (savedJobsString) {
        try {
          const jobs = JSON.parse(savedJobsString);
          setSavedPosts(jobs);
        } catch (error) {
          console.error("Error parsing saved jobs:", error);
        }
      }
    };

    loadSavedPosts();

    // Set up event listener for job updates
    window.addEventListener("savedPostsUpdated", loadSavedPosts);

    return () => {
      window.removeEventListener("savedPostsUpdated", loadSavedPosts);
    };
  }, []);

  const removeFromSaved = (postID: string) => {
    const updatedJobs = savedPosts.filter((post) => post.id !== postID);

    setSavedPosts(updatedJobs);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("savedPostsUpdated"));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
          Saved Posts
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            id="saved-jobs-tab"
            className="bg-green-700 text-white px-4 py-1 rounded-full"
          >
            Saved
          </button>
          <button
            id="in-progress-tab"
            className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1 rounded-full text-gray-800 dark:text-gray-200"
          >
            In Progress
          </button>
          <button
            id="applied-tab"
            className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1 rounded-full text-gray-800 dark:text-gray-200"
          >
            Applied
          </button>
          <button
            id="archived-tab"
            className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1 rounded-full text-gray-800 dark:text-gray-200"
          >
            Archived
          </button>
        </div>

        {savedPosts.length > 0 ? (
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <div key={post.id} className="border-t pt-4">
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center overflow-hidden">
                      {post.logo ? (
                        <img
                          src={post.logo}
                          alt={`${post.company} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-orange-500 rounded-full transform translate-y-1/4"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        {post.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Posted {post.postedTime} •{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                          Easy Apply
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <button
                      id={`job-options-${post.id}`}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => removeFromSaved(post.id)}
                    >
                      •••
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t pt-6 pb-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No saved jobs yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse jobs and click "Save" to add them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsDashboard;
