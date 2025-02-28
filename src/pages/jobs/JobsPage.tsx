import React, { useState } from 'react';
import { X, Check, ChevronRight, Briefcase, BarChart2 } from 'lucide-react';
import { WithNavBar } from '../../components'

// Type definitions remain the same
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  isSaved: boolean;
  logo: string;
  isPromoted: boolean;
  hasEasyApply: boolean;
  timePosted?: string;
  reviewTime?: string;
  alumniCount?: number;
  applied?: boolean;
  connections?: number;
  verified?: boolean;
  responseTime?: string;
  postedTime?: string;
  workMode?: string;
}

interface JobCollectionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const JobsPage: React.FC = () => {
  // Sample job data with additional jobs to match the screenshots
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Project Manager (Remote)',
      company: 'Virtual Worker Now',
      location: 'Egypt (Remote)',
      isRemote: true,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: true,
      hasEasyApply: true,
      reviewTime: '4 days',
    },
    {
      id: '2',
      title: 'Business Analyst',
      company: 'PSA BDP',
      location: 'Cairo, Cairo, Egypt (On-site)',
      isRemote: false,
      isSaved: true,
      logo: '/api/placeholder/60/60',
      isPromoted: true,
      hasEasyApply: true,
      alumniCount: 2,
    },
    {
      id: '3',
      title: 'Digital Product Manager',
      company: 'Vezeeta',
      location: 'Cairo, Egypt (On-site)',
      isRemote: false,
      isSaved: true,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: false,
      alumniCount: 21,
      applied: true,
    },
    {
      id: '4',
      title: 'Project Manager',
      company: 'Tahaluf',
      location: 'Riyadh, Riyadh, Saudi Arabia (On-site)',
      isRemote: false,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: true,
      timePosted: '2 hours ago',
      alumniCount: 2,
    },
    {
      id: '5',
      title: 'Project Manager Officer',
      company: 'DXC Technology',
      location: 'Egypt (Remote)',
      isRemote: true,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: false,
      connections: 4,
      applied: true,
      verified: true,
    },
  ]);

  // Additional jobs for the "More jobs for you" section based on the screenshot
  const [moreJobs, setMoreJobs] = useState<Job[]>([
    {
      id: '6',
      title: 'Mid Level Software Project Manager',
      company: 'Arcsen',
      location: 'Cairo, Cairo, Egypt (On-site)',
      isRemote: false,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: true,
      alumniCount: 5,
      postedTime: '5 months ago',
    },
    {
      id: '7',
      title: 'Product Manager',
      company: 'Clay',
      location: 'Egypt (Remote)',
      isRemote: true,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: true,
      hasEasyApply: true,
    },
    {
      id: '8',
      title: 'Senior Software Product Owner (Fintech)',
      company: 'Arib',
      location: 'Qesm 1st Nasser City, Cairo, Egypt (On-site)',
      isRemote: false,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: true,
      hasEasyApply: true,
      responseTime: '1-2 weeks',
    },
    {
      id: '9',
      title: 'Product Owner',
      company: 'Mondia Group',
      location: 'Cairo, Cairo, Egypt (Hybrid)',
      isRemote: false,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: true,
      alumniCount: 14,
      postedTime: '1 month ago',
      workMode: 'Hybrid',
    },
    {
      id: '10',
      title: 'SAP Agile Master',
      company: 'Luxoft',
      location: 'Cairo, Egypt (Hybrid)',
      isRemote: false,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: false,
      applied: true,
      responseTime: '4 days',
      workMode: 'Hybrid',
      verified: true,
    },
    {
      id: '11',
      title: 'Product Manager',
      company: 'Azentio',
      location: 'Cairo, Egypt (Hybrid)',
      isRemote: false,
      isSaved: false,
      logo: '/api/placeholder/60/60',
      isPromoted: false,
      hasEasyApply: false,
      alumniCount: 6,
      workMode: 'Hybrid',
    },
  ]);

  // Recent searches data
  const recentSearches = [
    { query: 'project manager', location: 'Cairo, Egypt', applyOn: true },
    { query: 'project manager', location: 'Riyadh, Saudi Arabia', applyOn: true, alert: true },
    { query: 'agile', location: 'Cairo, Egypt', applyOn: false },
  ];

  // Job collections data
  const jobCollections: JobCollectionItem[] = [
    { id: 'easy', title: 'Easy Apply', icon: <div className="text-center p-2 bg-blue-50 rounded-full"><span className="text-blue-600 text-xl">📝</span></div> },
    { id: 'remote', title: 'Remote', icon: <div className="text-center p-2 bg-blue-50 rounded-full"><span className="text-blue-600 text-xl">💻</span></div> },
    { id: 'part-time', title: 'Part-time', icon: <div className="text-center p-2 bg-blue-50 rounded-full"><span className="text-blue-600 text-xl">⏱️</span></div> },
    { id: 'more', title: 'More', icon: <div className="text-center p-2 bg-blue-50 rounded-full"><span className="text-blue-600 text-xl">📄</span></div> },
  ];

  // Handle job dismissal
  const dismissJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  // Handle more job dismissal
  const dismissMoreJob = (jobId: string) => {
    setMoreJobs(moreJobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left sidebar - Fixed position on scroll */}
        <div className="w-full md:w-1/4 md:sticky md:top-20 md:self-start">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-gray-600">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              </span>
              <span className="font-medium">Preferences</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="font-medium">My jobs</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <BarChart2 size={20} className="text-gray-600" />
              <span className="font-medium">My Career Insights</span>
            </div>
            
            <div className="border-t my-4"></div>
            
            <div className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
              <Briefcase size={20} />
              <span className="font-medium">Post a free job</span>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="mt-6 text-xs text-gray-600">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <span className="cursor-pointer hover:underline">About</span>
              <span className="cursor-pointer hover:underline">Accessibility</span>
              <span className="cursor-pointer hover:underline">Help Center</span>
              <span className="cursor-pointer hover:underline flex items-center">
                Privacy & Terms <ChevronRight size={12} />
              </span>
              <span className="cursor-pointer hover:underline">Ad Choices</span>
              <span className="cursor-pointer hover:underline flex items-center">
                Advertising <ChevronRight size={12} />
              </span>
              <span className="cursor-pointer hover:underline flex items-center">
                Business Services <ChevronRight size={12} />
              </span>
              <span className="cursor-pointer hover:underline">Get the LinkedIn app</span>
              <span className="cursor-pointer hover:underline">More</span>
            </div>
            
            <div className="mt-4 flex items-center">
              <span className="text-blue-600 font-bold">LinkedIn</span>
              <span className="ml-1">LinkedIn Corporation © 2025</span>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Top job picks section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <h2 className="text-xl font-bold">Top job picks for you</h2>
              <p className="text-sm text-gray-600">Based on your profile, preferences, and activity like applies, searches, and saves</p>
            </div>
            
            <div className="divide-y">
              {jobs.slice(0, 3).map(job => (
                <div key={job.id} className="p-4 flex items-start gap-4 relative">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <a href="#" className="text-blue-600 font-medium hover:underline">{job.title}</a>
                      <button 
                        onClick={() => dismissJob(job.id)}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                      >
                        <X size={20} />
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
                          <Check size={16} />
                        </span>
                        Applicant review time is typically {job.reviewTime}
                      </div>
                    )}
                    
                    <div className="mt-2">
                      {job.applied && (
                        <span className="text-sm text-gray-600">Applied</span>
                      )}
                      
                      {job.isPromoted && !job.applied && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600 mr-2">Promoted</span>
                          {job.hasEasyApply && (
                            <div className="flex items-center gap-1">
                              <span className="text-blue-600 font-bold text-sm">In</span>
                              <span className="text-sm text-blue-600">Easy Apply</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!job.isPromoted && !job.applied && job.timePosted && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600 mr-2">{job.timePosted}</span>
                          {job.hasEasyApply && (
                            <div className="flex items-center gap-1">
                              <span className="text-blue-600 font-bold text-sm">In</span>
                              <span className="text-sm text-blue-600">Easy Apply</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 flex justify-center">
              <button className="flex items-center text-gray-600 hover:text-blue-600">
                Show all <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Job collections section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <h2 className="text-xl font-bold">Explore with job collections</h2>
            </div>
            
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-4">
                {jobCollections.map(collection => (
                  <div key={collection.id} className="flex items-center gap-2 border rounded-full px-4 py-2 cursor-pointer hover:bg-gray-50">
                    {collection.icon}
                    <span className="font-medium">{collection.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="divide-y">
              {[jobs[3], jobs[4]].map(job => (
                <div key={job.id} className="p-4 flex items-start gap-4 relative">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <a href="#" className="text-blue-600 font-medium hover:underline">
                        {job.title} {job.verified && <span className="inline-block ml-1">✓</span>}
                      </a>
                      <button 
                        onClick={() => dismissJob(job.id)}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                      >
                        <X size={20} />
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
                    
                    <div className="mt-2 flex items-center">
                      {job.applied && (
                        <span className="text-sm text-gray-600">Applied</span>
                      )}
                      
                      {!job.applied && job.timePosted && (
                        <span className="text-sm text-gray-600 mr-2">{job.timePosted}</span>
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
              ))}
            </div>
            
            <div className="p-4 flex justify-center">
              <button className="flex items-center text-gray-600 hover:text-blue-600">
                Show all <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Recent job searches section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent job searches</h2>
              <button className="text-gray-600 hover:text-blue-600 text-sm">Clear</button>
            </div>
            
            <div className="divide-y">
              {recentSearches.map((search, index) => (
                <div key={index} className="p-4">
                  <div className="text-blue-600 font-medium">{search.query}</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm text-gray-600">
                      {search.alert ? 'Alert On · ' : ''}{search.location} · {search.applyOn ? 'Apply on LinkedIn' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* More jobs for you section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <h2 className="text-xl font-bold">More jobs for you</h2>
              <p className="text-sm text-gray-600">Based on your profile, preferences, and activity like applies, searches, and saves</p>
            </div>
            
            <div className="divide-y">
              {moreJobs.map(job => (
                <div key={job.id} className="p-4 flex items-start gap-4 relative">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <a href="#" className="text-blue-600 font-medium hover:underline">
                        {job.title} {job.verified && <span className="inline-block ml-1">✓</span>}
                      </a>
                      <button 
                        onClick={() => dismissMoreJob(job.id)}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                      >
                        <X size={20} />
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
                    
                    {job.responseTime && (
                      <div className="mt-1 text-xs text-gray-600 flex items-center gap-1">
                        <span className="text-green-600">
                          <Check size={16} />
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
                      
                      {!job.isPromoted && !job.applied && job.postedTime && (
                        <span className="text-sm text-gray-600 mr-2">{job.postedTime}</span>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithNavBar(JobsPage);