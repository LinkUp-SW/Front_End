import React from "react";
import { Job } from "../types";

interface JobContentProps {
  job: Job;
}

const JobContent: React.FC<JobContentProps> = ({ job }) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">How your profile and resume fit this job</h2>
        <p className="text-sm text-gray-700">Get AI-powered advice on this job and more exclusive features with Premium. 
          <span className="text-blue-600 ml-1 font-medium">Retry Premium for EGP0</span>
        </p>
        
        <div className="flex space-x-3 mt-3 overflow-x-auto">
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm flex items-center whitespace-nowrap">
            <span className="text-amber-500 mr-2">★</span>
            <span>Tailor my resume to this job</span>
          </button>
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm flex items-center whitespace-nowrap">
            <span className="text-amber-500 mr-2">★</span>
            <span>Am I a good fit for this job?</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full ml-2">
            <span>›</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">People you can reach out to</h2>
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-amber-100 flex items-center justify-center rounded-md mr-2">
              <span className="text-amber-800">🎓</span>
            </div>
            <span className="text-sm">School alumni from Cairo University</span>
          </div>
          <button className="border border-gray-300 rounded-full px-4 py-1 text-sm">
            Show all
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">About the job</h2>
        <p className="text-sm text-gray-700">
          Managing the Product Backlog: Keep the product backlog organized...
        </p>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li>Develop and maintain the product roadmap</li>
            <li>Collaborate with stakeholders to gather requirements</li>
            <li>Prioritize features and enhancements</li>
            <li>Work closely with development teams</li>
            <li>Monitor market trends and competitor analysis</li>
            <li>Create detailed product specifications</li>
            <li>Conduct user research and testing</li>
            <li>Present product updates to leadership</li>
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Qualifications:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li>5+ years of experience in product management</li>
            <li>Strong understanding of fintech industry</li>
            <li>Experience with agile methodologies</li>
            <li>Excellent communication skills</li>
            <li>Bachelor's degree in business, technology, or related field</li>
            <li>Problem-solving mindset</li>
            <li>Ability to work in a fast-paced environment</li>
          </ul>
        </div>
        <div className="mt-6 mb-12">
          <h3 className="font-semibold mb-2">Benefits:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li>Competitive salary package</li>
            <li>Health insurance</li>
            <li>Annual bonus opportunities</li>
            <li>Professional development budget</li>
            <li>Flexible working arrangements</li>
            <li>Team building activities</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default JobContent;