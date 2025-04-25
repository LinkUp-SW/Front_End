import React from 'react';

export interface Job {
  _id: string;
  job_title: string;
  job_status: string;
  location: string;
  workplace_type: string;
  experience_level: string;
  posted_time: string;
  applied_applications: Array<unknown>;
}

interface JobCardProps {
  job: Job;
  onEdit: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{job.job_title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          job.job_status === 'Open' ? 'bg-green-100 text-green-800' : 
          job.job_status === 'Closed' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {job.job_status}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-2 flex items-center">
        <span>{job.location}</span>
        <span className="mx-2">•</span>
        <span>{job.workplace_type}</span>
        <span className="mx-2">•</span>
        <span>{job.experience_level}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3">Posted on: {new Date(job.posted_time).toLocaleDateString()}</p>
      
      <div className="border-t border-gray-100 pt-3 flex justify-between">
        <span className="text-sm">
          {job.applied_applications?.length || 0} applicants
        </span>
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 text-sm hover:underline"
            onClick={() => onEdit(job._id)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};