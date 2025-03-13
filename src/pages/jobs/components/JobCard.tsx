import React from 'react';
import { HiOutlineXMark } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onDismiss: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDismiss }) => (
  <div className="p-4 flex items-start gap-4 relative">
    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
    
    <div className="flex-1">
      <div className="flex justify-between">
        <a href="#" className="text-blue-600 font-medium hover:underline">
          {job.title} {job.verified && <span className="inline-block ml-1">✓</span>}
        </a>
        <button 
          onClick={() => onDismiss(job.id)}
          className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
        >
          <HiOutlineXMark size={20} />
        </button>
      </div>
      
      <div className="text-sm">{job.company} · {job.location}</div>
      
      {job.alumniCount && (
        <div className="mt-1 text-xs text-gray-600 flex items-center gap-1">
          <span className="bg-gray-200 w-4 h-4 rounded-full flex items-center justify-center">
            <span className="text-gray-700 text-xs">👤</span>
          </span>
          {job.alumniCount} school alumni work here
        </div>
      )}
      
      {job.connections && (
        <div className="mt-1 text-xs text-gray-600 flex items-center gap-1">
          <span className="bg-gray-200 w-4 h-4 rounded-full flex items-center justify-center">
            <span className="text-gray-700 text-xs">👥</span>
          </span>
          {job.connections} connections work here
        </div>
      )}
      
      {job.reviewTime && (
        <div className="mt-1 text-xs text-gray-600 flex items-center gap-1">
          <span className="text-green-600">
            <FaCheck size={16} />
          </span>
          Applicant review time is typically {job.reviewTime}
        </div>
      )}
      
      {job.responseTime && (
        <div className="mt-1 text-xs text-gray-600 flex items-center gap-1">
          <span className="text-green-600">
            <FaCheck size={16} />
          </span>
          Response time is typically {job.responseTime}
        </div>
      )}
      
      <div className="mt-2 flex items-center">
        {job.applied && (
          <span className="text-sm text-gray-600">Applied</span>
        )}
        
        {job.isPromoted && !job.applied && (
          <span className="text-sm text-gray-600 mr-2">Promoted</span>
        )}
        
        {!job.isPromoted && !job.applied && (job.timePosted || job.postedTime) && (
          <span className="text-sm text-gray-600 mr-2">{job.timePosted || job.postedTime}</span>
        )}
        
        {job.hasEasyApply && !job.applied && (
          <div className="flex items-center gap-1 ml-2">
            <span className="text-blue-600 font-bold text-sm">In</span>
            <span className="text-sm text-blue-600">Easy Apply</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default JobCard;