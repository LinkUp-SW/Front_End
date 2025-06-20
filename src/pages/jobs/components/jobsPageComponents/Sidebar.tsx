import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSortDown } from "react-icons/fa6";
import { FaEdit, FaBookmark } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { FOOTER_LINKS } from "../../../../constants/index";
import { getUserCompanies } from "@/endpoints/company";
import { Company } from "../../types";
import buildingsImg from "@/assets/buildings.jpeg";
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCompanies = async () => {
      setIsLoading(true);

      try {
        const response = await getUserCompanies();
        setUserCompanies(response.organizations || []);
        setError(null);
      } catch {
        setError("Failed to load your pages");
        console.error("Failed to fetch user companies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCompanies();
  }, []);

  const handleMyJobsClick = () => {
    navigate("/my-items/saved-jobs");
  };

  const handleCompanyClick = (companyId: string) => {
    navigate(`/company-manage/${companyId}`);
  };

  // Handler for "Post a free job" button
  const handlePostFreeJob = () => {
    navigate("/jobs/create");
  };

  return (
    <div className="w-full md:w-1/4 md:sticky md:top-20 md:self-start">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-4 transition-colors">
        <div
          id="sidebar-item-my-jobs"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
          onClick={handleMyJobsClick}
          role="button"
        >
          <span className="text-gray-600 dark:text-gray-300">
            <FaBookmark size={20} />
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            My jobs
          </span>
        </div>

        <div className="border-t dark:border-gray-700 my-4"></div>

        <div
          id="post-job-btn"
          className="flex items-center gap-2 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded cursor-pointer transition-colors"
          onClick={handlePostFreeJob}
          role="button"
        >
          <FaEdit size={20} />
          <span className="font-medium">Post a free job</span>
        </div>
      </div>

      {/* My Pages Component */}
      <div className="mt-6">
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
              My pages ({isLoading ? "..." : userCompanies.length})
            </h2>

            {isLoading ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500 dark:text-red-400">
                {error}
              </div>
            ) : userCompanies.length === 0 ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                You don't have any pages yet
              </div>
            ) : (
              userCompanies.map((company) => (
                <div
                  key={company._id}
                  id={`company-page-item-${company._id}`}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleCompanyClick(company._id)}
                >
                  <div className="flex items-center w-full min-w-0">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        src={company.logo || buildingsImg}
                        alt={company.name}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-medium text-gray-800 dark:text-gray-200 truncate"
                        title={company.name}
                      >
                        {company.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Activity
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Grow your business
            </p>
            <button className="flex items-center text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FiTarget
                className="mr-2 text-gray-800 dark:text-gray-200"
                size={20}
              />
              Try Campaign Manager
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-xs text-gray-600 dark:text-gray-400 transition-colors">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link, index) => (
            <span
              key={index}
              id={`footer-link-${index}`}
              className="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-200 flex items-center transition-colors"
              role="button"
            >
              {link.text} {link.hasArrow && <FaSortDown size={12} />}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-center items-center">
          <img className="w-5 h-5" src="/link_up_logo.png" alt="LinkUp Logo" />
          <span className="ml-2">LinkUp Corporation © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
