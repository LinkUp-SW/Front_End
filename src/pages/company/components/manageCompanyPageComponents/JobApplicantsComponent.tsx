import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { IoIosArrowBack } from "react-icons/io";
import { getJobApplicants, updateApplicationStatus } from '@/endpoints/company';

// Define types for job application data
interface JobApplicant {
  _id: string;
  job_id: string;
  user_id: {
    _id: string;
    bio: {
      first_name: string;
      last_name: string;
      headline: string;
      contact_info?: {
        phone_number: number;
        country_code: string;
      };
    };
    profile_photo?: string;
  };
  first_name: string;
  last_name: string;
  phone_number: number;
  country_code: string;
  email: string;
  resume: string;
  application_status: 'Pending' | 'Viewed' | 'Accepted' | 'Rejected';
}

interface JobApplicantsComponentProps {
  jobId: string;
  onBack: () => void;
}

const JobApplicantsComponent: React.FC<JobApplicantsComponentProps> = ({ jobId, onBack }) => {
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobApplicants();
  }, [jobId]);

  const fetchJobApplicants = async () => {
    try {
      setIsLoading(true);
      const response = await getJobApplicants(jobId);
      
      if (response && response.data) {
        setApplicants(response.data);
      } else {
        setApplicants([]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch job applicants:', err);
      setError('Failed to load job applicants');
      toast.error('Failed to load job applicants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: JobApplicant['application_status']) => {
    try {
      await updateApplicationStatus(applicantId, newStatus);

      // Update local state
      setApplicants(prevApplicants => 
        prevApplicants.map(applicant => 
          applicant._id === applicantId 
            ? { ...applicant, application_status: newStatus } 
            : applicant
        )
      );

      toast.success(`Application status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update application status:', err);
      toast.error('Failed to update application status');
    }
  };

  const getStatusColor = (status: JobApplicant['application_status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Viewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6">
        <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center"
          aria-label="Back to jobs"
        >
          <IoIosArrowBack className="text-2xl"  />
        </button>
        <h1 className="text-xl font-bold dark:text-white"> Job Applicants</h1>
      </div>
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 dark:text-gray-400">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6">
        <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center"
          aria-label="Back to jobs"
        >
          <IoIosArrowBack className="text-2xl"  />
        </button>
        <h1 className="text-xl font-bold dark:text-white"> Job Applicants</h1>
      </div>
        <div className="text-center text-red-600 dark:text-red-400 py-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center"
          aria-label="Back to jobs"
        >
          <IoIosArrowBack className="text-2xl"  />
        </button>
        <h1 className="text-xl font-bold dark:text-white"> Job Applicants</h1>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No applications have been received yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applicants.map((applicant) => (
            <div 
              key={applicant._id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Applicant photo */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                  <img 
                    src={applicant.user_id?.profile_photo || "/api/placeholder/64/64"} 
                    alt={`${applicant.first_name} ${applicant.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/64/64";
                    }}
                  />
                </div>
                
                {/* Applicant details */}
                <div className="flex-1">
                  <h3 className="font-medium text-lg dark:text-white">
                    {applicant.first_name} {applicant.last_name}
                  </h3>
                  
                  {applicant.user_id?.bio?.headline && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {applicant.user_id.bio.headline}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Email: {applicant.email}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Phone: {applicant.country_code} {applicant.phone_number}
                    </span>
                  </div>
                  
                  {/* Resume link */}
                  {applicant.resume && (
                    <a 
                      href={applicant.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-sm hover:underline mb-3 inline-block"
                    >
                      View Resume
                    </a>
                  )}
                </div>
                
                {/* Status and actions */}
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 text-xs rounded-full self-end ${getStatusColor(applicant.application_status)}`}>
                    {applicant.application_status}
                  </span>
                  
                  <select 
                    className="mt-2 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                    value={applicant.application_status}
                    onChange={(e) => handleStatusChange(applicant._id, e.target.value as JobApplicant['application_status'])}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Viewed">Viewed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicantsComponent;