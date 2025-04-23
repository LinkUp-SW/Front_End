import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { WithNavBar } from '../../components';
import { FaEye, FaChartLine, FaInfoCircle } from "react-icons/fa";
import EditPageDialog from './components/manageCompanyPageComponents/EditPageDialog';
import { getCompanyAdminView } from '@/endpoints/company';

// Define a type for the navigation tabs
type NavigationTab = 'analytics' | 'page-posts' | 'edit-page' | 'jobs' | 'settings';
type AnalyticsTab = 'content' | 'visitors' | 'followers' | 'leads' | 'competitors';

const ManageCompanyPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [activeTab, setActiveTab] = useState<NavigationTab>('analytics');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<AnalyticsTab>('content');
  const [dateRange, setDateRange] = useState('Mar 21, 2025 - Apr 19, 2025');
  const [impressionsSelected, setImpressionsSelected] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Company data state
  const [companyData, setCompanyData] = useState({
    _id: "",
    name: "",
    logo: "",
    url: "",
    industry: "",
    size: "",
    type: "",
    phone: "",
    founded: "",
    overview: "",
    followerCount: 0
  });

  // Fetch company data on component mount or when companyId changes
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;
      
      try {
        setIsLoading(true);
        const response = await getCompanyAdminView(companyId);
        
        if (response && response.company) {
          setCompanyData(response.company);
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch company data:', err);
        setError(err.message || 'Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const handleNavClick = (tab: NavigationTab) => {
    if (tab === 'edit-page') {
      setEditDialogOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleEditSubmit = (data: any) => {
    setCompanyData({...companyData, ...data});
    console.log("Saved company data:", data);
  };

  // Shows loading state while fetching company data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading company data...</div>
      </div>
    );
  }

  // Shows error state if fetching failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile header section */}
            <div className="relative">
              {/* Company banner */}
              <div className="h-24 bg-gradient-to-r from-blue-300 to-blue-500 relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
              </div>
              
              {/* Company logo */}
              <div className="absolute bottom-0 left-4 transform translate-y-1/2 bg-white p-1 rounded-lg shadow">
                <div className="w-16 h-16 flex overflow-hidden rounded-lg bg-gray-200">
                  <img 
                    src={companyData.logo || "/src/assets/buildings.jpeg"} 
                    alt={`${companyData.name} logo`} 
                    className="w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/50/50";
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 pb-3 mt-8">
              <h2 className="text-lg font-medium">{companyData.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{companyData.followerCount} followers</p>
             
              <button className="mt-4 w-full border border-gray-300 rounded-full py-2 text-sm flex justify-center items-center text-gray-600 hover:bg-gray-50 transition-colors">
                <FaEye className="mr-2" size={16} />
                View as member
              </button>
            </div>
            
            {/* Navigation menu */}
            <nav className="mb-4">
              <ul className="py-1">
                <li>
                  <a 
                    href="#" 
                    className={`block px-4 py-2.5 text-gray-700 hover:bg-gray-50 ${activeTab === 'page-posts' ? 'text-green-700 font-medium bg-gray-100 border-l-4 border-green-700' : ''}`}
                    onClick={() => handleNavClick('page-posts')}
                  >
                    Page posts
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`block px-4 py-2.5 text-gray-700 hover:bg-gray-50 ${activeTab === 'analytics' ? 'text-green-700 font-medium bg-gray-100 border-l-4 border-green-700' : ''}`}
                    onClick={() => handleNavClick('analytics')}
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`block px-4 py-2.5 text-gray-700 hover:bg-gray-50 ${activeTab === 'edit-page' ? 'text-green-700 font-medium bg-gray-100 border-l-4 border-green-700' : ''}`}
                    onClick={() => handleNavClick('edit-page')}
                  >
                    Edit page
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`block px-4 py-2.5 text-gray-700 hover:bg-gray-50 ${activeTab === 'jobs' ? 'text-green-700 font-medium bg-gray-100 border-l-4 border-green-700' : ''}`}
                    onClick={() => handleNavClick('jobs')}
                  >
                    Jobs
                  </a>
                </li>
                
                <div className="my-1 border-t border-gray-200"></div>
                
                <li>
                  <a 
                    href="#" 
                    className={`block px-4 py-2.5 text-gray-700 hover:bg-gray-50 ${activeTab === 'settings' ? 'text-green-700 font-medium bg-gray-100 border-l-4 border-green-700' : ''}`}
                    onClick={() => handleNavClick('settings')}
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">
              {activeTab === 'analytics' ? 'Analytics' : 
               activeTab === 'page-posts' ? 'Page Posts' : 
               activeTab === 'jobs' ? 'Jobs' : 
               activeTab === 'settings' ? 'Settings' : 'Dashboard'}
            </h1>
            
            {/* Content based on active tab would go here */}
            {activeTab === 'analytics' && (
              <div>
                <p>Analytics dashboard for {companyData.name}</p>
                {/* Add your analytics components here */}
              </div>
            )}
            
            {activeTab === 'page-posts' && (
              <div>
                <p>Posts for {companyData.name}</p>
                {/* Add your posts components here */}
              </div>
            )}
            
            {activeTab === 'jobs' && (
              <div>
                <p>Jobs for {companyData.name}</p>
                {/* Add your jobs components here */}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <p>Settings for {companyData.name}</p>
                {/* Add your settings components here */}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <EditPageDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        companyData={companyData}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default WithNavBar(ManageCompanyPage);