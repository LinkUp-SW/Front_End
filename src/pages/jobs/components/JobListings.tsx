import React, { useState } from "react";

const JobListingPage: React.FC = () => {
  // Sample job data with enhanced details
  const jobs = [
    {
      id: 1,
      title: "Senior Software Product Owner (Fintech)",
      company: "Arib",
      location: "Qesm 1st Nasser City, Cairo, Egypt",
      type: "On-site",
      employment: "Full-time",
      description: "Managing the Product Backlog: Keep the product backlog organized...",
      postedDate: "1 week ago",
      applicants: 95,
      responseTime: "typically 6 days",
      skillMatch: 0,
      promoted: true,
      viewed: true
    },
    {
      id: 2,
      title: "Corporate (Senior) Product Owner",
      company: "EFG Holding",
      location: "Cairo, Egypt",
      type: "On-site",
      employment: "Full-time",
      description: "Leading product strategy for corporate solutions...",
      connections: 2,
      promoted: true
    },
    {
      id: 3,
      title: "Product Development Team Leader",
      company: "e& Egypt",
      location: "Cairo, Egypt",
      type: "Hybrid",
      employment: "Full-time",
      description: "Leading the product development team...",
      connections: 7,
      promoted: true
    },
    {
      id: 4,
      title: "Senior Technology Project Manager",
      company: "Cleopatra Hospitals Group",
      location: "Cairo, Egypt",
      type: "On-site",
      employment: "Full-time",
      description: "Managing technology projects in healthcare...",
      connections: 1
    }
  ];

  const [selectedJob, setSelectedJob] = useState(jobs[0]); // Default selected job

  return (
    <div className="min-h-screen pt-12 overflow-hidden">
      {/* Container with max width and centered */}
      <div className="max-w-6xl mx-auto bg-white flex">
        {/* Left Side - Job List */}
        <div className="w-1/3 overflow-y-auto" style={{ maxHeight: "100vh" }}>
          {/* Top Job Recommendations Header - Fixed */}
          <div className="bg-white p-4 border-b sticky top-0 z-10">
            <h2 className="text-xl font-bold">Top job picks for you</h2>
            <p className="text-sm text-gray-600">Based on your profile, preferences, and activity like applies, searches, and saves</p>
            <p className="text-sm text-gray-500 mt-1">570 results</p>
          </div>
          
          {/* Scrollable Job List */}
          <div>
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedJob.id === job.id ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex">
                  <div className="mr-3">
                    {job.company === "Arib" && (
                      <div className="w-12 h-12 bg-blue-100 flex items-center justify-center text-blue-500 rounded">
                        <span className="text-lg font-semibold">A</span>
                      </div>
                    )}
                    {job.company === "EFG Holding" && (
                      <div className="w-12 h-12 bg-green-800 flex items-center justify-center rounded">
                        <span className="text-white text-lg font-semibold">E</span>
                      </div>
                    )}
                    {job.company === "e& Egypt" && (
                      <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded">
                        <span className="text-red-500 text-lg">e&</span>
                      </div>
                    )}
                    {job.company === "Cleopatra Hospitals Group" && (
                      <div className="w-12 h-12 bg-teal-100 flex items-center justify-center text-teal-600 rounded">
                        <span className="text-xs font-semibold">CHG</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-blue-600 font-semibold">{job.title}</h3>
                      <button className="text-gray-400 text-xl">×</button>
                    </div>
                    <p className="text-sm text-gray-800">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.location} {job.type && `(${job.type})`}</p>
                    
                    {job.responseTime && (
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <span>Response time is {job.responseTime}</span>
                      </div>
                    )}
                    
                    {job.connections && (
                      <div className="flex items-center mt-1">
                        <div className="flex -space-x-2 mr-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                          {job.connections > 1 && <div className="w-6 h-6 rounded-full bg-gray-400 border border-white"></div>}
                        </div>
                        <span className="text-sm text-gray-500">{job.connections} connections work here</span>
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center">
                      {job.viewed && <span className="text-xs text-gray-500 mr-2">Viewed</span>}
                      {job.promoted && <span className="text-xs text-gray-500 mr-2">• Promoted</span>}
                      <span className="text-xs flex items-center">
                        <span className="bg-blue-600 text-white rounded px-1 mr-1 text-xs">in</span> 
                        <span className="text-blue-600">Easy Apply</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side - Job Details */}
        <div className="w-2/3 overflow-y-auto" style={{ maxHeight: "100vh" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs text-gray-400">Arib</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 3h2v10h-2V3zm0 12h2v2h-2v-2z"/>
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-1">{selectedJob.title}</h1>
            <p className="text-gray-600 mb-1">{selectedJob.location} · {selectedJob.postedDate} · {selectedJob.applicants} applicants</p>
            
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-md text-sm">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>On-site</span>
              </div>
              <div className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-md text-sm">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Full-time</span>
              </div>
              <div className="text-sm text-gray-600">0 of 10 skills match</div>
            </div>
            
            <div className="flex space-x-2 mb-6">
              <button className="bg-blue-600 text-white py-2 px-6 rounded-full flex items-center text-sm font-medium">
                <span className="bg-white text-blue-600 rounded px-1 mr-2 text-xs">in</span>
                <span>Easy Apply</span>
              </button>
              <button className="border border-gray-300 text-gray-700 py-2 px-6 rounded-full text-sm font-medium">
                Save
              </button>
            </div>
            
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
              <p className="text-sm text-gray-700">{selectedJob.description}</p>
              {/* Add more content to make scrolling necessary */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingPage;