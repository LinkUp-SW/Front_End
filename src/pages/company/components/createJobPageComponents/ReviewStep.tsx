import React from 'react';
import { JobFormData } from './JobForm';

interface ReviewStepProps {
  jobData: JobFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ jobData }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Review and Publish</h2>
      <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-lg sm:text-xl mb-2 text-gray-900 dark:text-gray-100">{jobData.title}</h3>
        <div className="flex flex-wrap text-sm text-gray-600 dark:text-gray-400 mb-1 gap-2">
          <span>{jobData.company}</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span>{jobData.location}</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span>{jobData.workMode}</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span>{jobData.experience_level}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Salary: {jobData.salary}</p>
        
        <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Description</h4>
        <p className="text-sm mb-4 text-gray-700 dark:text-gray-300 break-words">{jobData.description || "No description provided."}</p>
        
        {[
          { title: "Responsibilities", items: jobData.responsibilities },
          { title: "Qualifications", items: jobData.qualifications },
          { title: "Benefits", items: jobData.benefits }
        ].map(section => (
          <div key={section.title} className="mb-4">
            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">{section.title}</h4>
            <ul className="list-disc pl-5">
              {section.items?.length > 0 
                ? section.items.map((item, index) => (
                    <li key={index} className="text-sm mb-1 text-gray-700 dark:text-gray-300">{item}</li>
                  ))
                : <li className="text-sm text-gray-700 dark:text-gray-300">No {section.title.toLowerCase()} provided.</li>
              }
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewStep;
