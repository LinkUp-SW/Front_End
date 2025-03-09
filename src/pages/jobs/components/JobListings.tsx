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
        
     
     
      </div>
    </div>
  );
};

export default JobListingPage;