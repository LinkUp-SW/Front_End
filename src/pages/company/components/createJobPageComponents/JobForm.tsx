import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createJobFromCompany, getCompanyAdminView, searchCompanies as searchCompaniesAPI } from "@/endpoints/company";
import JobDetailsStep from './JobDetailsStep';
import RequirementsStep from './RequirementsStep';
import ReviewStep from './ReviewStep';
import ProgressBar from './ProgressBar';
import { Company } from '../../../jobs/types';

export type WorkMode = 'On-site' | 'Remote' | 'Hybrid';
export type ExperienceLevel = 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director' | 'Executive';
export type ArrayField = 'responsibilities' | 'qualifications' | 'benefits';

export interface Job {
  job_title?: string;
  title: string;
  company: string;
  organization_id?: string;
  location: string;
  workMode: WorkMode;
  workplace_type?: string;
  experience_level: ExperienceLevel;
  isRemote: boolean;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  salary: string;
  isSaved?: boolean;
  logo?: string;
  isPromoted?: boolean;
  hasEasyApply: boolean;
  verified?: boolean;
  job_type?: string;
  job_status?: string;
  receive_applicants_by?: string;
  receiving_method?: string;
  targettted_skills?: string[];
}

export interface CompanySearchResult {
  _id: string;
  name: string;
  logo?: string;
}

export interface JobFormData extends Partial<Job> {
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  experience_level: ExperienceLevel;
  isRemote: boolean;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  salary: string;
  hasEasyApply: boolean;
}

// Interface for company API result, making sure it has the required fields
interface CompanyAPIResult {
  _id: string;
  name: string;
  logo?: string;
}


const JobForm: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFreeJob, setIsFreeJob] = useState<boolean>(!companyId);
  
  // Company search state
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [companySearchResults, setCompanySearchResults] = useState<CompanySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCompanyResults, setShowCompanyResults] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
  // State for text area raw inputs
  const [textareaValues, setTextareaValues] = useState({
    responsibilities: '',
    qualifications: '',
    benefits: ''
  });
  
  const [jobData, setJobData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    workMode: 'On-site',
    experience_level: 'Entry Level',
    isRemote: false,
    description: '',
    responsibilities: [],
    qualifications: [],
    benefits: [],
    salary: '',
    isSaved: false,
    logo: '',
    isPromoted: false,
    hasEasyApply: true,
    verified: true
  });

  // Search for companies
  const searchCompanies = async (query: string) => {
    if (!query || query.length < 2) {
      setCompanySearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await searchCompaniesAPI(query);
      
      // Fix: Check for the correct response structure and properly type the response
      if (response && 'companies' in response) {
        // Force type casting since we know the structure
        const companiesData = response.companies as unknown as CompanyAPIResult[];
        
        setCompanySearchResults(companiesData.map((company) => ({
          _id: company._id,
          name: company.name,
          logo: company.logo || '/src/assets/company.png'
        })));
      } else {
        setCompanySearchResults([]);
      }
    } catch (error) {
      console.error('Error searching companies:', error);
      setCompanySearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced company search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (companySearchQuery) {
        searchCompanies(companySearchQuery);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [companySearchQuery]);

  // Handle company selection
  const handleSelectCompany = (company: CompanySearchResult) => {
    // Update the company name in form data
    setJobData(prev => ({
      ...prev,
      company: company.name,
      logo: company.logo || '/src/assets/company.png'
    }));
    
    // Set the company ID
    setSelectedCompanyId(company._id);
    
    // Close the dropdown with a slight delay to ensure state updates
    setTimeout(() => {
      setShowCompanyResults(false);
      // Show feedback to the user
      toast.success(`Selected company: ${company.name}`);
    }, 100);
  };

  // Fetch company data if companyId is provided
  useEffect(() => {
    if (!companyId) {
      setIsFreeJob(true);
      return;
    }

    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        const response = await getCompanyAdminView(companyId);
        
        // Fix: Add proper type checking and null handling
        if (response) {
          // Check for the company property first
          if (response.company) {
            const company = response.company;
            setCompanyData(company);
            setJobData(prev => ({
              ...prev,
              company: company.name ?? '',
              logo: company.logo ?? '/src/assets/company.png'
            }));
          }
          // Then check for companyProfile if company isn't available
          else if (response.companyProfile) {
            setCompanyData(response.companyProfile);
            setJobData(prev => ({
              ...prev,
              company: response.companyProfile.name || '',
              logo: response.companyProfile.logo || '/src/assets/company.png'
            }));
            setSelectedCompanyId(companyId);
          } else {
            console.error('Company data is missing or malformed:', response);
            toast.error('Failed to load company data properly');
          }
        } else {
          console.error('No response received from API');
          toast.error('Failed to load company data');
        }
      } catch (error) {
        console.error('Failed to fetch company data:', error);
        toast.error('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [companyId]);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
    
    // If company name is being changed, show search results
    if (name === 'company' && isFreeJob) {
      setCompanySearchQuery(value);
      setShowCompanyResults(true);
    }
  };

  const handleWorkModeChange = (mode: WorkMode) => {
    setJobData(prev => ({
      ...prev,
      workMode: mode,
      isRemote: mode === 'Remote'
    }));
  };

  const handleArrayFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: ArrayField) => {
    const value = e.target.value;
    
    // Update the raw textarea value
    setTextareaValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Parse the textarea content into an array
    const items = value
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);
    
    setJobData(prev => ({ ...prev, [field]: items }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Check if company is selected
      if (!selectedCompanyId && isFreeJob) {
        toast.error('Please select a company from the search results');
        setIsLoading(false);
        return;
      }
      
      const jobDataToSubmit = {
        ...jobData,
        organization_id: selectedCompanyId || companyId,
        job_title: jobData.title,
        workplace_type: jobData.workMode,
        job_type: "Full-time",
        job_status: "Open",
        receive_applicants_by: "Email",
        receiving_method: "jobs@company.com",
        targettted_skills: []
      };
      
      if (selectedCompanyId || companyId) {
        // Use the company ID we have - either selected or from params
        const orgId = selectedCompanyId || companyId || '';
        await createJobFromCompany(orgId, jobDataToSubmit);
        toast.success('Job posted successfully!');
        navigate(`/company-manage/${orgId}`);
      } else {
        toast.error('No company selected');
      }
    } catch (err) {
      console.error('Failed to create job:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('input[name="company"]') && 
          !target.closest('.company-dropdown') && 
          showCompanyResults) {
        setShowCompanyResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCompanyResults]);

  if (isLoading && companyId && !companyData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center h-48 sm:h-64">
            <p className="text-gray-500 dark:text-gray-400">Loading job form...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderNavigationButtons = () => (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 mt-6 sm:mt-8">
      <div>
        {currentStep > 1 && (
          <button
           id="job-form-back-button"
            onClick={handleBack}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isLoading}
          >
            Back
          </button>
        )}
      </div>
      
      <button
       id={currentStep < totalSteps ? "job-form-next-button" : "job-form-submit-button"}
        onClick={handleNext}
        className={`w-full sm:w-auto px-4 sm:px-6 py-2 ${isLoading ? 'bg-blue-400 dark:bg-blue-600' : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'} text-white rounded`}
        disabled={isLoading}
      >
        {isLoading 
          ? 'Loading...' 
          : currentStep < totalSteps 
            ? 'Next' 
            : 'Post job'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        {currentStep === 1 && (
          <JobDetailsStep 
            jobData={jobData} 
            handleInputChange={handleInputChange}
            handleWorkModeChange={handleWorkModeChange}
            isFreeJob={isFreeJob}
            showCompanyResults={showCompanyResults}
            isSearching={isSearching}
            companySearchResults={companySearchResults}
            companySearchQuery={companySearchQuery}
            handleSelectCompany={handleSelectCompany}
          />
        )}
        {currentStep === 2 && (
          <RequirementsStep 
            textareaValues={textareaValues}
            handleArrayFieldChange={handleArrayFieldChange}
          />
        )}
        {currentStep === 3 && <ReviewStep jobData={jobData} />}
        {renderNavigationButtons()}
      </div>
    </div>
  );
};

export default JobForm;