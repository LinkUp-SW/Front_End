import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getCompanyAllView, 
  checkIsFollowing, 
  followOrganization, 
  unfollowOrganization 
} from '@/endpoints/company';
import { toast } from 'sonner';
import { WithNavBar } from '../../components';
import JobViewerComponent from './components/companyProfilePageComponents/JobViewerComponent';
import AdminViewerComponent from './components/companyProfilePageComponents/AdminViewerComponent';
import { useSelector } from "react-redux";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import PostList from "../feed/components/PostList";
import { RootState } from "@/store";
import { 
  BiBuildingHouse, 
  BiGlobe, 
  BiUserPlus, 
  BiCheck, 
  BiGroup, 
  BiMapPin, 
  BiBriefcase, 
} from 'react-icons/bi';

interface CompanyData {
  _id: string;
  name: string;
  logo: string;
  tagline: string;
  website: string;
  industry: string;
  size: string;
  type: string;
  followerCount: number;
  location: {
    country: string;
    city: string;
    state: string;
  };
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  overview: string;
  description: string;
}

const CompanyProfileView = () => {
  const { companyId } = useParams<{ companyId: string }>();
  
  // State for company data
  const [companyData, setCompanyData] = useState<CompanyData>({
    _id: "",
    name: "",
    logo: "",
    tagline: "",
    website: "",
    industry: "",
    size: "",
    type: "",
    followerCount: 0,
    location: {
      country: "",
      city: "",
      state: ""
    },
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: ""
    },
    overview: "",
    description: "",
  });

    const {
      posts,
      observerRef,
      isLoading: postsLoading,
      initialLoading,
    } = useFeedPosts(
      false, // single
      "", // profile
      companyId // company
    );
  
    const screenWidth = useSelector((state: RootState) => state.screen.width);
    const [viewMore, setViewMore] = useState(screenWidth >= 768);
  
    useEffect(() => {
      setViewMore(screenWidth >= 768);
    }, [screenWidth]);
  
  // State for following status
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'posts' | 'people'>('home');
  
  // Fetch company data and follow status
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) {
        setError("Company ID not provided");
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch company data
        const companyResponse = await getCompanyAllView(companyId);
        
        if (companyResponse && companyResponse.companyProfile) {
          const company = companyResponse.companyProfile;
          
          // Use the correct follower count from the API response
          // First check followerCount, then check followers_count, then fallback to the length of followers array
          const followerCount = 
            company.followerCount || 
            company.followers_count || 
            (company.followers ? company.followers.length : 0);
          
          setCompanyData({
            _id: company._id,
            name: company.name,
            logo: company.logo || "/api/placeholder/100/100",
            tagline: company.tagline || "Connecting professionals worldwide",
            website: company.website || "",
            industry: company.industry || "",
            size: company.size || "",
            type: company.type || "",
            followerCount: followerCount,
            location: {
              country: company.location?.country || "",
              city: company.location?.city || "",
              state: company.location?.state || ""
            },
            socialLinks: {
              linkedin: company.socialLinks?.linkedin || "",
              twitter: company.socialLinks?.twitter || "",
              facebook: company.socialLinks?.facebook || ""
            },
            overview: company.overview || "",
            description: company.description || "",
          });
          
          // Check if the user is following this company
          const followResponse = await checkIsFollowing(companyId);
          setIsFollowing(followResponse.isFollower);
        } else {
          setError('Company data not available');
        }
      } catch (err) {
        console.error('Failed to fetch company data:', err);
        setError('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!companyId) return;
    
    setFollowLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow the company
        await unfollowOrganization(companyId);
        setCompanyData({
          ...companyData,
          followerCount: Math.max(0, companyData.followerCount - 1)
        });
        setIsFollowing(false);
        toast.success("You are no longer following this company");
      } else {
        // Follow the company
        await followOrganization(companyId);
        setCompanyData({
          ...companyData,
          followerCount: companyData.followerCount + 1
        });
        setIsFollowing(true);
        toast.success("You are now following this company");
      }
    } catch (err) {
      console.error('Failed to update follow status:', err);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  // Loading state with improved UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-600 dark:border-blue-400 rounded-full animate-spin"></div>
          <div className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading company profile...</div>
        </div>
      </div>
    );
  }

  // Error state with improved UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-300 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Error Loading Profile</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formatted location string
  const formattedLocation = [companyData.location.city, companyData.location.state, companyData.location.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Header Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          {/* Banner */}
          <div className="relative">
            <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800">
              <div className="absolute inset-0 bg-black opacity-10"></div>
            </div>
            
            {/* Logo */}
            <div className="absolute left-6 sm:left-8 -bottom-12 bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 rounded-lg shadow-md">
              <img 
                src={companyData.logo} 
                alt={`${companyData.name} logo`} 
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/src/assets/buildings.jpeg";
                }}
              />
            </div>
            
          </div>
          
          {/* Company title section */}
          <div className="pt-16 pb-4 px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold dark:text-white">{companyData.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">{companyData.tagline}</p>
                <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {companyData.industry && (
                    <span className="flex items-center mr-4 mb-1">
                      <BiBuildingHouse className="w-4 h-4 mr-1" />
                      {companyData.industry}
                    </span>
                  )}
                  {formattedLocation && (
                    <span className="flex items-center mr-4 mb-1">
                      <BiMapPin className="w-4 h-4 mr-1" />
                      {formattedLocation}
                    </span>
                  )}
                  <span className="flex items-center mb-1">
                    <BiGroup className="w-4 h-4 mr-1" />
                    {companyData.followerCount} followers
                  </span>
                </div>
              </div>
              
              {/* Action buttons - Responsive layout */}
              <div className="flex gap-2 mt-4 md:mt-0">
                <button 
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-4 py-2 rounded-full flex items-center justify-center transition-colors ${
                    isFollowing 
                      ? 'bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                  }`}
                >
                  {followLoading ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-1"></span>
                      <span className="hidden sm:inline">{isFollowing ? "Following" : "Follow"}</span>
                    </span>
                  ) : (
                    <>
                      {isFollowing ? (
                        <BiCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <BiUserPlus className="w-4 h-4 mr-1" />
                      )}
                      <span className="hidden sm:inline">{isFollowing ? "Following" : "Follow"}</span>
                    </>
                  )}
                </button>

                {companyData.website && (
                  <a 
                    href={companyData.website.startsWith('http') ? companyData.website : `https://${companyData.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <BiGlobe className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex px-2 sm:px-8">
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-3 sm:px-4 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'home' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`px-3 sm:px-4 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'jobs' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Jobs
              </button>
              <button 
                onClick={() => setActiveTab('posts')}
                className={`px-3 sm:px-4 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'posts' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Posts
              </button>
              <button 
                onClick={() => setActiveTab('people')}
                className={`px-3 sm:px-4 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'people' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              >
                People
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left column */}
          <div className="w-full lg:w-8/12">
            
            {/* Display JobViewerComponent when "Jobs" tab is active */}
            <JobViewerComponent 
              companyId={companyId}
              isVisible={activeTab === 'jobs'}
            />
            
            {/* Display AdminViewerComponent when "People" tab is active */}
            <AdminViewerComponent 
              companyId={companyId}
              isVisible={activeTab === 'people'}
            />
            
            {/* About section - visible when "home" tab is active */}
            {(activeTab === 'home' ) && (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                    <BiBuildingHouse className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    About
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-base font-medium mb-3 dark:text-gray-200">What we do</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {companyData.description || companyData.overview || "No company description available."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {companyData.website && (
                      <div className="mb-4">
                        <h3 className="text-base font-medium mb-2 dark:text-gray-200 flex items-center">
                          <BiGlobe className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Website
                        </h3>
                        <a 
                          href={companyData.website.startsWith('http') ? companyData.website : `https://${companyData.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {companyData.website}
                        </a>
                      </div>
                    )}
                    
                    {companyData.industry && (
                      <div className="mb-4">
                        <h3 className="text-base font-medium mb-2 dark:text-gray-200 flex items-center">
                          <BiBriefcase className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Industry
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">{companyData.industry}</p>
                      </div>
                    )}
                    
                    {companyData.size && (
                      <div className="mb-4">
                        <h3 className="text-base font-medium mb-2 dark:text-gray-200 flex items-center">
                          <BiGroup className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Company size
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">{companyData.size}</p>
                      </div>
                    )}
                    
                    {formattedLocation && (
                      <div className="mb-4">
                        <h3 className="text-base font-medium mb-2 dark:text-gray-200 flex items-center">
                          <BiMapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Location
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">{formattedLocation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Posts section - placeholder for when "posts" tab is active */}
            {activeTab === 'posts' && <main className="flex flex-col w-full ">
                <div className="mt-4" />
                <PostList
                  posts={posts}
                  viewMore={viewMore}
                  isLoading={postsLoading}
                  initialLoading={initialLoading}
                  observerRef={observerRef}
                />
              </main>}
          </div>
          
          {/* Right column */}
          <div className="w-full lg:w-4/12">
            {/* Company Quick Info Card */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Company Information</h3>
              
              <div className="space-y-4 text-sm">
                {companyData.industry && (
                  <div className="flex items-start">
                    <BiBuildingHouse className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Industry</p>
                      <p className="font-medium dark:text-gray-200">{companyData.industry}</p>
                    </div>
                  </div>
                )}
                
                {companyData.size && (
                  <div className="flex items-start">
                    <BiGroup className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Company size</p>
                      <p className="font-medium dark:text-gray-200">{companyData.size}</p>
                    </div>
                  </div>
                )}
                
                {formattedLocation && (
                  <div className="flex items-start">
                    <BiMapPin className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Headquarters</p>
                      <p className="font-medium dark:text-gray-200">{formattedLocation}</p>
                    </div>
                  </div>
                )}
                
                {companyData.website && (
                  <div className="flex items-start">
                    <BiGlobe className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Website</p>
                      <a 
                        href={companyData.website.startsWith('http') ? companyData.website : `https://${companyData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {companyData.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-8 mt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">About</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Professional</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Community Policies</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Privacy & Terms</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Sales Solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">Accessibility</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Ad Choices</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Mobile</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">Talent Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Marketing Solutions</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Advertising</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Small Business</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Account Settings</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Recommended Content</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
            LinkUp Corporation © 2025
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WithNavBar(CompanyProfileView);