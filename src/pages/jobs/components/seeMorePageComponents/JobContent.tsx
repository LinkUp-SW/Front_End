import React, { useState } from "react";
import { Job } from "../../types";

interface JobContentProps {
  job: Job;
}

const JobContent: React.FC<JobContentProps> = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeSection, setActiveSection] = useState<'responsibilities' | 'qualifications' | 'benefits'>('responsibilities');
  
  const descriptionText = job.description || "";
  
  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const qualifications = Array.isArray(job.qualifications) ? job.qualifications : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits : [];
  
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">How your profile and resume fit this job</h2>
        <p className="text-sm text-gray-700 dark:text-gray-400">Get AI-powered advice on this job and more exclusive features with Premium. 
          <span className="text-blue-600 dark:text-blue-400 ml-1 font-medium">Retry Premium for EGP0</span>
        </p>
        
        <div className="flex space-x-3 mt-3 overflow-x-auto">
          <button 
            id="btn-tailor-resume" 
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm flex items-center whitespace-nowrap dark:text-gray-300"
          >
            <span className="text-gray-500 dark:text-gray-400 mr-2">★</span>
            <span>Tailor my resume to this job</span>
          </button>
          <button 
            id="btn-job-fit" 
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm flex items-center whitespace-nowrap dark:text-gray-300"
          >
            <span className="text-gray-500 dark:text-gray-400 mr-2">★</span>
            <span>Am I a good fit for this job?</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 dark:text-white">People you can reach out to</h2>
        <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md mr-2">
              <span className="text-gray-500 dark:text-gray-400">🎓</span>
            </div>
            <span className="text-sm dark:text-gray-300">School alumni from Cairo University</span>
          </div>
          <button 
            id="btn-show-connections" 
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-1 text-sm dark:text-gray-300"
          >
            Show all
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2 dark:text-white">About the job</h2>
        {descriptionText && (
          <div className="text-sm text-gray-700 dark:text-gray-400">
            {showFullDescription ? descriptionText : (
              descriptionText.length > 200 ? `${descriptionText.slice(0, 200)}...` : descriptionText
            )}
            {descriptionText.length > 200 && (
              <button 
                id="btn-toggle-description"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 dark:text-blue-400 ml-1 hover:underline"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
        
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 mb-2">
            <button 
              id="tab-responsibilities"
              className={`pb-2 font-medium text-sm ${activeSection === 'responsibilities' ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setActiveSection('responsibilities')}
            >
              Responsibilities
            </button>
            <button 
              id="tab-qualifications"
              className={`pb-2 font-medium text-sm ${activeSection === 'qualifications' ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setActiveSection('qualifications')}
            >
              Qualifications
            </button>
            <button 
              id="tab-benefits"
              className={`pb-2 font-medium text-sm ${activeSection === 'benefits' ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setActiveSection('benefits')}
            >
              Benefits
            </button>
          </div>
        </div>
        
        {activeSection === 'responsibilities' && responsibilities.length > 0 && (
          <div className="mt-4">
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-400 space-y-2">
              {responsibilities.map((item: string, index: number) => (
                <li key={`resp-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {activeSection === 'qualifications' && qualifications.length > 0 && (
          <div className="mt-4">
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-400 space-y-2">
              {qualifications.map((item: string, index: number) => (
                <li key={`qual-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {activeSection === 'benefits' && benefits.length > 0 && (
          <div className="mt-4">
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-400 space-y-2">
              {benefits.map((item: string, index: number) => (
                <li key={`ben-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-8 mb-6">
          <button 
            id="btn-apply-now"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
};

export default JobContent;