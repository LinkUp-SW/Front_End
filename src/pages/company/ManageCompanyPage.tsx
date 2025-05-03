import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WithNavBar } from "../../components";
import { FaEye } from "react-icons/fa";
import EditPageDialog from "./components/manageCompanyPageComponents/EditPageDialog";
import SettingsComponent from "./components/manageCompanyPageComponents/SettingsPage";
import CompanyJobsComponent from "./components/manageCompanyPageComponents/CompanyJobs";
import AnalyticsComponent from "./components/manageCompanyPageComponents/CompanyAnalyticsComponent";
import {
  getCompanyAdminView,
  getCompanyAllView,
  updateCompanyProfile,
} from "@/endpoints/company";
import { toast } from "sonner";
import CreatePostButton from "../feed/components/CreatePostButton";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import PostList from "../feed/components/PostList";

// Define a type for the navigation tabs
type NavigationTab =
  | "analytics"
  | "page-posts"
  | "edit-page"
  | "jobs"
  | "settings";

// Define types for company data
export interface BasicCompanyData {
  _id: string;
  name: string;
  logo: string;
  website: string;
  industry: string;
  size: string;
  type: string;
  phone: string;
  founded: string;
  overview: string;
  followerCount: number;
}

// Extended company data including all fields needed for editing
interface FullCompanyData extends BasicCompanyData {
  tagline?: string;
  email?: string;
  location?: {
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    location_name?: string;
  } | null;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  specialties?: string[];
  description?: string;
  mission?: string;
  values?: string[];
  benefits?: string[];
  culture?: string;
}

// Define type for form submission data
interface CompanyUpdateData {
  name?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  type?: string;
  phone?: string;
  founded?: string;
  overview?: string;
  tagline?: string;
  email?: string;
  location?: {
    country: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    location_name: string;
  } | null;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  specialties?: string[];
  description?: string;
  mission?: string;
  values?: string[];
  benefits?: string[];
  culture?: string;
}

const ManageCompanyPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NavigationTab>("jobs");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullCompanyData, setFullCompanyData] =
    useState<FullCompanyData | null>(null);

  // Company data state
  const [companyData, setCompanyData] = useState<BasicCompanyData>({
    _id: "",
    name: "",
    logo: "",
    website: "",
    industry: "",
    size: "",
    type: "",
    phone: "",
    founded: "",
    overview: "",
    followerCount: 0,
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

  const handleViewAsMember = () => {
    if (companyId) {
      navigate(`/company/${companyId}`);
    } else {
      toast.error("Company ID not found");
    }
  };

  const handleFollowerCountChange = (newCount: number) => {
    setCompanyData((prevData) => ({
      ...prevData,
      followerCount: newCount,
    }));
  };

  // Fetch company data on component mount or when companyId changes
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        const response = await getCompanyAdminView(companyId);
        console.log("API Response:", response);

        if (response && response.company) {
          const company = response.company;
          setCompanyData({
            _id: company._id,
            name: company.name,
            logo: company.logo || "",
            website: company.website || "",
            industry: company.industry || "",
            size: company.size || "",
            type: company.type || "",
            phone: company.phone || "",
            founded: company.founded || "",
            overview: company.overview || "",
            followerCount: company.followerCount || 0,
          });
          setError(null);
        } else {
          setError("Company data not available");
        }
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setError("Failed to load company data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  useEffect(() => {}, []);

  // Function to fetch full company data for editing
  const fetchFullCompanyData = async (): Promise<FullCompanyData | null> => {
    if (!companyId) {
      console.error("Company ID is missing");
      return null;
    }

    try {
      console.log(`Fetching full company data for ID: ${companyId}`);
      const response = await getCompanyAllView(companyId);
      console.log("API Response:", response);

      if (response && response.companyProfile) {
        // Map API Company response to our FullCompanyData type
        const company = response.companyProfile;
        const fullData: FullCompanyData = {
          _id: company._id,
          name: company.name,
          logo: company.logo || "",
          website: company.website || "",
          industry: company.industry || "",
          size: company.size || "",
          type: company.type || "",
          phone: company.phone || "",
          founded: company.founded || "",
          overview: company.overview || "",
          followerCount: company.followers_count || company.followerCount || 0,
          email: company.email,
          tagline: company.tagline,
          location: company.location,
          socialLinks: company.socialLinks,
          specialties: company.specialties,
          description: company.description,
          mission: company.mission,
          values: company.values,
          benefits: company.benefits,
          culture: company.culture,
        };

        setFullCompanyData(fullData);
        console.log("Company type:", fullData.type);

        return fullData;
      } else {
        console.error("Invalid response format:", response);
        toast.error("Unable to load company data");
        return null;
      }
    } catch (err) {
      console.error("Failed to fetch full company data:", err);
      toast.error("Error loading company data");
      return null;
    }
  };

  const handleNavClick = async (tab: NavigationTab) => {
    if (tab === "edit-page") {
      try {
        setIsLoading(true);
        // Fetch complete company data before opening dialog
        const data = await fetchFullCompanyData();
        if (data) {
          setEditDialogOpen(true);
        } else {
          // Show error with toast instead of console.error
          toast.error("Failed to load company data for editing");
        }
      } catch (error) {
        console.error("Error loading company data for editing:", error);
        toast.error("Error loading company data for editing");
      } finally {
        setIsLoading(false);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleEditSubmit = async (data: CompanyUpdateData) => {
    if (!companyId) return;

    try {
      const response = await updateCompanyProfile(companyId, data);

      if (response && (response.success || response.message)) {
        console.log("Company profile updated successfully");
        setEditDialogOpen(false);
        toast.success("Company information updated successfully!");

        // Refresh data
        setIsLoading(true);

        try {
          // 1. Refresh basic company data
          const basicDataResponse = await getCompanyAdminView(companyId);
          if (basicDataResponse && basicDataResponse.company) {
            // fix here
            const company = basicDataResponse.company;
            setCompanyData({
              _id: company._id,
              name: company.name,
              logo: company.logo
                ? `${company.logo}?t=${new Date().getTime()}`
                : "",
              website: company.website || "",
              industry: company.industry || "",
              size: company.size || "",
              type: company.type || "",
              phone: company.phone || "",
              founded: company.founded || "",
              overview: company.overview || "",
              followerCount: company.followerCount || 0,
            });
          }

          // 2. Refresh full company data (for edit dialog next time)
          const fullDataResponse = await getCompanyAllView(companyId);
          if (fullDataResponse && fullDataResponse.companyProfile) {
            const company = fullDataResponse.companyProfile;
            const fullData: FullCompanyData = {
              _id: company._id,
              name: company.name,
              logo: company.logo || "",
              website: company.website || "",
              industry: company.industry || "",
              size: company.size || "",
              type: company.type || "",
              phone: company.phone || "",
              founded: company.founded || "",
              overview: company.overview || "",
              followerCount:
                company.followers_count || company.followerCount || 0,
              email: company.email,
              location: company.location,
              socialLinks: company.socialLinks,
              specialties: company.specialties,
              description: company.description,
              mission: company.mission,
              values: company.values,
              benefits: company.benefits,
              culture: company.culture,
            };
            setFullCompanyData(fullData);
          }
        } catch (refreshError) {
          console.error("Error refreshing data after update:", refreshError);
          toast.error(
            "Updated successfully, but couldn't refresh display. Please reload the page."
          );
        }

        setIsLoading(false);
      }
    } catch (err) {
      console.error("Failed to update company profile:", err);
      toast.error(`Failed to update company profile`);
    }
  };

  // Shows loading state while fetching company data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Loading company data...
        </div>
      </div>
    );
  }

  // Shows error state if fetching failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Profile header section */}
            <div className="relative">
              {/* Company banner */}
              <div className="h-24 bg-gradient-to-r from-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-800 relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
              </div>

              {/* Company logo */}
              <div className="absolute bottom-0 left-4 transform translate-y-1/2 bg-white dark:bg-gray-700 p-1 rounded-lg shadow">
                <div className="w-16 h-16 flex overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-600">
                  <img
                    src={companyData.logo || "/src/assets/buildings.jpeg"}
                    alt={`${companyData.name} logo`}
                    className="w-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", companyData.logo);
                      (e.target as HTMLImageElement).src =
                        "/api/placeholder/50/50";
                    }}
                    key={companyData.logo} // Add a key to force re-render when logo changes
                  />
                </div>
              </div>
            </div>

            <div className="p-4 pb-3 mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {companyData.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {companyData.followerCount} followers
              </p>

              <button
                className="mt-4 w-full border border-gray-300 dark:border-gray-600 rounded-full py-2 text-sm flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={handleViewAsMember}
              >
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
                    id="nav-link-page-posts"
                    className={`block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 
                      ${
                        activeTab === "page-posts"
                          ? "text-green-700 dark:text-green-400 font-medium bg-gray-100 dark:bg-gray-700 border-l-4 border-green-700 dark:border-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    onClick={() => handleNavClick("page-posts")}
                  >
                    Page posts
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    id="nav-link-analytics"
                    className={`block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 
                      ${
                        activeTab === "analytics"
                          ? "text-green-700 dark:text-green-400 font-medium bg-gray-100 dark:bg-gray-700 border-l-4 border-green-700 dark:border-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    onClick={() => handleNavClick("analytics")}
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    id="nav-link-edit-page"
                    className={`block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 
                      ${
                        activeTab === "edit-page"
                          ? "text-green-700 dark:text-green-400 font-medium bg-gray-100 dark:bg-gray-700 border-l-4 border-green-700 dark:border-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    onClick={() => handleNavClick("edit-page")}
                  >
                    Edit page
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    id="nav-link-jobs"
                    className={`block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 
                      ${
                        activeTab === "jobs"
                          ? "text-green-700 dark:text-green-400 font-medium bg-gray-100 dark:bg-gray-700 border-l-4 border-green-700 dark:border-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    onClick={() => handleNavClick("jobs")}
                  >
                    Jobs
                  </a>
                </li>

                <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

                <li>
                  <a
                    href="#"
                    id="nav-link-settings"
                    className={`block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 
                      ${
                        activeTab === "settings"
                          ? "text-green-700 dark:text-green-400 font-medium bg-gray-100 dark:bg-gray-700 border-l-4 border-green-700 dark:border-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    onClick={() => handleNavClick("settings")}
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
          {activeTab === "settings" ? (
            <SettingsComponent
              companyName={companyData.name}
              companyId={companyId}
              followerCount={companyData.followerCount}
              onFollowerCountChange={handleFollowerCountChange}
            />
          ) : activeTab === "jobs" ? (
            <CompanyJobsComponent companyId={companyId} />
          ) : activeTab === "analytics" ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <AnalyticsComponent companyId={companyId} />
            </div>
          ) : (
            <div className=" dark:bg-gray-800 rounded-lg shadow p-6 dark:border-gray-700">
              {activeTab === "page-posts" && (
                <div className="text-gray-700 dark:text-gray-300 w-full">
                  <CreatePostButton company={companyData} />
                  <main className="flex flex-col w-full ">
                    <div className="mt-4" />
                    <PostList
                      posts={posts}
                      viewMore={viewMore}
                      isLoading={postsLoading}
                      initialLoading={initialLoading}
                      observerRef={observerRef}
                    />
                  </main>{" "}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <EditPageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        companyData={fullCompanyData || companyData}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default WithNavBar(ManageCompanyPage);
