import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobHeader from "./JobHeader";
import JobContent from "./JobContent";
import { Job } from "../../types";
import { checkIsFollowing, followOrganization, unfollowOrganization } from "@/endpoints/company";

interface JobDetailProps {
  job?: Job;
  isLoading?: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, isLoading = false }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);

  useEffect(() => {
    // Check if user is following when job changes
    const checkFollowStatus = async () => {
      // Make sure we have a job and an organization ID
      if (job && job.companyInfo && job.companyInfo._id) {
        try {
          const { isFollower } = await checkIsFollowing(job.companyInfo._id);
          setIsFollowing(isFollower);
          // Initialize followers count from job data
          setFollowersCount(job.companyInfo.followers_count || 0);
        } catch (error) {
          console.error("Error checking follow status:", error);
          setIsFollowing(false); // Default to not following on error
        }
      } else {
        // Reset to not following if no job or organization ID
        setIsFollowing(false);
      }
    };
    
    checkFollowStatus();
    // Reset show full description when job changes
    setShowFullDescription(false);
  }, [job]);

  // Handle navigation to company page
  const handleVisitCompany = () => {
    if (!job || !job.companyInfo || !job.companyInfo._id) {
      console.error("Cannot navigate: Missing company ID");
      return;
    }
    
    // Navigate to the company page using the company ID
    navigate(`/company/${job.companyInfo._id}`);
  };

  const handleFollowToggle = async () => {
    // Use direct ID instead of companyInfo.organizationId
    if (!job || !job.companyInfo) return;
    
    // Get the organizational ID directly from the job
    const organizationId = job.companyInfo._id || "";
    
    if (!organizationId) {
      console.error("No organization ID available");
      return;
    }
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowOrganization(organizationId);
        setIsFollowing(false);
        // Decrease the followers count immediately in UI
        setFollowersCount(prevCount => Math.max(0, prevCount - 1));
      } else {
        await followOrganization(organizationId);
        setIsFollowing(true);
        // Increase the followers count immediately in UI
        setFollowersCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      // Don't change state on error - keep previous state
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle description display
  const getCompanyDescription = () => {
    const description = job?.companyInfo?.description || 
      "A growing company focused on innovation and excellence in their field.";
    
    if (showFullDescription || description.length <= 200) {
      return description;
    }
    
    return `${description.substring(0, 200)}...`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  // Handle case where job is undefined
  if (!job) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No job selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <JobHeader job={job} />
      <JobContent job={job} />
      
      {/* About the company section */}
      <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">About the company</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {job.logo && job.logo.startsWith('http') ? (
              <img 
                src={job.logo} 
                alt={`${job.company} logo`} 
                className="w-10 h-10 object-contain bg-white dark:bg-gray-700 rounded-md p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.appendChild(document.createTextNode(job.company.substring(0, 1)));
                    parent.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-500', 'dark:text-blue-300', 'flex', 'items-center', 'justify-center');
                  }
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded">
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  {job.company.substring(0, 2)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium dark:text-white">{job.company}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {followersCount} followers
              </p>
            </div>
          </div>
          
          <button 
            id="btn-follow-company"
            className={`border rounded-full px-4 py-1 flex items-center gap-2 text-sm transition-colors ${
              isFollowing 
                ? "text-gray-600 dark:text-gray-400 border-gray-600 dark:border-gray-400" 
                : "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
            }`}
            onClick={handleFollowToggle}
            disabled={followLoading}
          >
            {followLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-t-transparent border-blue-600 dark:border-blue-400 rounded-full animate-spin mr-1"></span>
            ) : isFollowing ? "Following" : "+ Follow"}
          </button>
        </div>
        
        <div className="text-sm text-gray-700 dark:text-gray-400 mb-3">
          {job.companyInfo?.industryType && `${job.companyInfo.industryType} • `}
          {job.companyInfo?.employeeCount && `${job.companyInfo.employeeCount}`}
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-400 break-words">
            {getCompanyDescription()}
          </p>
          
          {job.companyInfo?.description && job.companyInfo.description.length > 200 && (
            <button 
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        <button 
          id="btn-show-more-company"
          className="block w-full text-center border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-full py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          onClick={() => handleVisitCompany()}
        >
          Visit company page
        </button>
      </div>
    </div>
  );
};

export default JobDetail;