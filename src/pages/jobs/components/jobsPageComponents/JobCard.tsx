import React from 'react';
import { HiOutlineXMark } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onDismiss: (id: string) => void;
  onSelect: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDismiss, onSelect }) => {
  const navigate = useNavigate();
  
  const handleJobClick = () => {
    onSelect(job.id!);
    navigate(`/jobs/see-more?selected=${job.id}`);
  };

  return (
    <div 
      className="p-4 flex items-start gap-4 relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
      onClick={handleJobClick} 
    >
      {job.logo && job.logo.startsWith('http') ? (
            <img 
              src={job.logo} 
              alt={`${job.company} logo`} 
              className="w-12 h-12 object-contain bg-white dark:bg-gray-800 rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                {job.company.substring(0, 2)}
              </span>
            </div>
          )}
      
      <div className="flex-1">
        <div className="flex justify-between">
          <a 
            id={`job-title-${job.id}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent div click from triggering
              handleJobClick();
            }}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            {job.title} {job.verified && <span className="inline-block ml-1">✓</span>}
          </a>
          <button 
            id={`dismiss-job-${job.id}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent div click from triggering
              onDismiss(job.id!);
            }}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>
        
        <div className="text-sm text-gray-800 dark:text-gray-200">{job.company} · {job.location} ({job.workMode})</div>
        
        {job.alumniCount && (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span className="bg-gray-200 dark:bg-gray-700 w-4 h-4 rounded-full flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-300 text-xs">👤</span>
            </span>
            {job.alumniCount} school alumni work here
          </div>
        )}
        
        {job.connections && (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span className="bg-gray-200 dark:bg-gray-700 w-4 h-4 rounded-full flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-300 text-xs">👥</span>
            </span>
            {job.connections} connections work here
          </div>
        )}
        
        {job.reviewTime && (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span className="text-green-600 dark:text-green-500">
              <FaCheck size={16} />
            </span>
            Applicant review time is typically {job.reviewTime}
          </div>
        )}
        
        {job.responseTime && (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span className="text-green-600 dark:text-green-500">
              <FaCheck size={16} />
            </span>
            Response time is typically {job.responseTime}
          </div>
        )}
        
        <div className="mt-2 flex items-center">
          {job.applied && (
            <span className="text-sm text-gray-600 dark:text-gray-400">Applied</span>
          )}
          
          {job.isPromoted && !job.applied && (
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Promoted</span>
          )}
          
          {!job.isPromoted && !job.applied && (job.postedTime) && (
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{job.postedTime}</span>
          )}
          
          {job.hasEasyApply && !job.applied && (
            <div className="flex items-center gap-1 ml-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">Up</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">Easy Apply</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;