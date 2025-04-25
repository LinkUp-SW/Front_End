import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Job, Company } from '../../pages/jobs/types';
import { createJobFromCompany, getCompanyAdminView } from "@/endpoints/company";

type WorkMode = 'On-site' | 'Remote' | 'Hybrid';
type ExperienceLevel = 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director' | 'Executive';
type ArrayField = 'responsibilities' | 'qualifications' | 'benefits';

interface JobFormData extends Partial<Job> {
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

const CreateJobPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Fetch company data
  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        const response = await getCompanyAdminView(companyId);
        
        if (response?.company) {
          setCompanyData(response.company);
          setJobData(prev => ({
            ...prev,
            company: response.company.name || '',
            logo: response.company.logo || '/src/assets/company.png'
          }));
        } else {
          console.error('Company data is missing or malformed:', response);
          toast.error('Failed to load company data properly');
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
    if (!companyId) {
      toast.error('Company ID is missing');
      return;
    }
    
    try {
      setIsLoading(true);
      const jobDataToSubmit = {
        ...jobData,
        organization_id: companyId,
        job_title: jobData.title,
        workplace_type: jobData.workMode,
        job_type: "Full-time",
        receive_applicants_by: "Email",
        receiving_method: "jobs@company.com",
        targettted_skills: []
      };
      
      await createJobFromCompany(companyId, jobDataToSubmit);
      toast.success('Job posted successfully!');
      navigate(`/company-manage/${companyId}`);
    } catch (err) {
      console.error('Failed to create job:', err);
      toast.error('Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">
        {currentStep} of {totalSteps}: {
          currentStep === 1 ? 'Job details' :
          currentStep === 2 ? 'Requirements & benefits' :
          'Review and publish'
        }
      </h1>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStepOne = () => (
    <>
      <div className="text-sm text-gray-500 mb-2">* Indicates required</div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Job details*</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job title*</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleInputChange}
              placeholder="Frontend Developer"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleInputChange}
              placeholder="Your Company"
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Work mode*</label>
          <div className="flex space-x-4 mb-4">
            {(['On-site', 'Remote', 'Hybrid'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleWorkModeChange(mode)}
                className={`py-2 px-4 rounded ${
                  jobData.workMode === mode 
                    ? 'bg-blue-100 border border-blue-500 text-blue-700' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job location*</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleInputChange}
              placeholder="Cairo, Egypt"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience level*</label>
            <div className="relative">
              <select
                name="experience_level"
                value={jobData.experience_level}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
              >
                <option value="Internship">Internship</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Associate">Associate</option>
                <option value="Mid-Senior">Mid-Senior</option>
                <option value="Director">Director</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary range*</label>
          <input
            type="text"
            name="salary"
            value={jobData.salary}
            onChange={handleInputChange}
            placeholder="50000"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            name="hasEasyApply"
            id="hasEasyApply"
            checked={jobData.hasEasyApply}
            onChange={(e) => setJobData(prev => ({...prev, hasEasyApply: e.target.checked}))}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="hasEasyApply" className="ml-2 text-sm text-gray-700">
            Enable easy apply
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-4">Description*</label>
        <div className="border border-gray-300 rounded p-2 mb-2">
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleInputChange}
            placeholder="The ideal candidate will be responsible for designing, developing, testing, and debugging responsive web and mobile applications..."
            className="w-full border-none focus:ring-0 min-h-32"
            rows={10}
          />
        </div>
      </div>
    </>
  );

  const renderStepTwo = () => {
    const textareaFields: Array<{label: string, field: ArrayField, placeholder: string}> = [
      {
        label: "Responsibilities*", 
        field: "responsibilities",
        placeholder: "• Lead the development of front-end applications\n• Collaborate with design teams to implement user interface components\n• Ensure the technical feasibility of UI/UX designs\n• Optimize applications for maximum speed and scalability"
      },
      {
        label: "Qualifications*", 
        field: "qualifications",
        placeholder: "• Bachelor's degree or equivalent in Computer Science\n• 2+ years' experience in frontend development\n• Familiarity using Scrum/Agile development methodologies\n• Experience building object oriented web applications in JavaScript, HTML5, and CSS3"
      },
      {
        label: "Benefits", 
        field: "benefits",
        placeholder: "• Competitive salary and bonus structure\n• Health, dental, and vision insurance\n• 401(k) retirement plan with company match\n• Flexible work schedule and remote work options"
      }
    ];

    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Requirements & Benefits</h2>
        
        {textareaFields.map(({ label, field, placeholder }) => (
          <div className="mb-6" key={field}>
            <label className="block text-md font-medium mb-2">{label}</label>
            <textarea
              name={field}
              value={textareaValues[field]}
              onChange={(e) => handleArrayFieldChange(e, field)}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded px-3 py-2 min-h-32"
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">Enter each item on a new line</p>
          </div>
        ))}
      </div>
    );
  };

  const renderStepThree = () => (
    <div>
      <h2 className="text-lg font-semibold mb-4">Review and Publish</h2>
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-medium text-xl mb-2">{jobData.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span>{jobData.location}</span>
          <span className="mx-2">•</span>
          <span>{jobData.workMode}</span>
          <span className="mx-2">•</span>
          <span>{jobData.experience_level}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Salary: {jobData.salary}</p>
        
        <h4 className="font-medium mb-2">Description</h4>
        <p className="text-sm mb-4">{jobData.description || "No description provided."}</p>
        
        {[
          { title: "Responsibilities", items: jobData.responsibilities },
          { title: "Qualifications", items: jobData.qualifications },
          { title: "Benefits", items: jobData.benefits }
        ].map(section => (
          <div key={section.title}>
            <h4 className="font-medium mb-2">{section.title}</h4>
            <ul className="list-disc pl-5 mb-4">
              {section.items?.length > 0 
                ? section.items.map((item, index) => (
                    <li key={index} className="text-sm mb-1">{item}</li>
                  ))
                : <li className="text-sm">No {section.title.toLowerCase()} provided.</li>
              }
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNavigationButtons = () => (
    <div className="flex justify-between mt-8">
      <div>
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            disabled={isLoading}
          >
            Back
          </button>
        )}
      </div>
      
      <button
        onClick={handleNext}
        className={`px-6 py-2 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded`}
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

  if (isLoading && !companyData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading job form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {renderProgressBar()}

      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
        {renderNavigationButtons()}
      </div>
    </div>
  );
};

export default CreateJobPage;