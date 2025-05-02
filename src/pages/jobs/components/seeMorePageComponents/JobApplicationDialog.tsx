import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/pages/jobs/types';
import { IoMdDownload } from 'react-icons/io';
import { 
  UserInfo, 
  JobApplicationData, 
  fetchUserJobApplicationInfo, 
  submitJobApplication 
} from '@/endpoints/jobs';

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job;
}

// Define an API error interface to replace 'any'
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const JobApplicationDialog: React.FC<JobApplicationDialogProps> = ({ 
  open, 
  onOpenChange,
  job
}) => {
  const [currentStep, setCurrentStep] = useState<'info' | 'resume' | 'preview'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);

  // Fetch user info on dialog open
  useEffect(() => {
    if (open) {
      fetchUserInfo();
    } else {
      // Reset state when dialog closes
      setCurrentStep('info');
      setProgress(0);
      setIsResumeUploaded(false);
      setResumeBase64(null);
    }
  }, [open]);

  // Update progress based on current step
  useEffect(() => {
    if (currentStep === 'info') setProgress(20);
    else if (currentStep === 'resume') setProgress(50);
    else if (currentStep === 'preview') setProgress(100);
  }, [currentStep]);

  // Fetch user information from API
  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUserJobApplicationInfo();
      setUserInfo(userData);
      
      // Populate form fields with user data
      setFirstName(userData.bio.first_name || '');
      setLastName(userData.bio.last_name || '');
      setPhoneNumber(userData.bio.contact_info.phone_number?.toString() || '');
      setCountryCode(userData.bio.contact_info.country_code || '');
      setResumeUrl(userData.resume || '');
      setProfilePhoto(userData.profile_photo || '');
      setEmail(userData.email || '');
      
      // If user already has a resume, it's not considered "uploaded" in this session
      setIsResumeUploaded(false);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      toast.error('Failed to load your profile information');
      setIsLoading(false);
    }
  };

  // Function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result); // Keep the full data URL format
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Function to handle resume upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Resume file size must be less than 2MB');
        return;
      }
      
      try {
        // Convert file to base64 with data URL format
        const base64Data = await convertFileToBase64(file);
        setResumeBase64(base64Data);
        setResumeFile(file);
        setResumeUrl(URL.createObjectURL(file)); // For preview purposes
        setIsResumeUploaded(true);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast.error('Failed to process resume file');
      }
    }
  };

  // Function to handle application submission
  const handleSubmitApplication = async () => {
    if (!job || !job._id) {
      toast.error('Job information is missing');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create application payload
      const applicationData: JobApplicationData = {
        phone_number: parseInt(phoneNumber),
        country_code: countryCode,
        email: email,
        first_name: firstName,
        last_name: lastName,
        profile_photo: profilePhoto,
        resume: isResumeUploaded ? resumeBase64 || '' : resumeUrl, // Use full base64 string with data URL prefix
        is_uploaded: isResumeUploaded,
      };

      // Submit application using the API function
      const response = await submitJobApplication(job._id, applicationData);

      setIsSubmitting(false);
      onOpenChange(false);

      // Show API response message in toast
      const responseMessage = response.message || `Application submitted successfully to ${job.company}`;
      toast.success(responseMessage);
      
      // Redirect to jobs page after a short delay
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);

    } catch (error: unknown) {
      setIsSubmitting(false);
      console.error('Failed to submit job application:', error);
      
      // Type guard to safely handle the error object
      const apiError = error as ApiError;
      
      // Display error message from API response if available
      const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to submit your application';
      toast.error(errorMessage);
    }
  };

  // Function to go to next step
  const goToNextStep = () => {
    if (currentStep === 'info') {
      if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep('resume');
    } else if (currentStep === 'resume') {
      if (!resumeUrl) {
        toast.error('Please upload your resume');
        return;
      }
      setCurrentStep('preview');
    }
  };

  // Function to go to previous step
  const goToPreviousStep = () => {
    if (currentStep === 'preview') setCurrentStep('resume');
    else if (currentStep === 'resume') setCurrentStep('info');
  };

  // Render resume filename
  const renderResumeFilename = () => {
    if (resumeFile) return resumeFile.name;
    if (resumeUrl) {
      const urlParts = resumeUrl.split('/');
      return urlParts[urlParts.length - 1];
    }
    return '';
  };

  // Get file size for resume
  const getFileSize = () => {
    if (resumeFile) {
      return `${Math.round(resumeFile.size / 1024)} KB`;
    }
    return '';
  };

  // Get last used date for resume
  const getLastUsedDate = () => {
    return resumeFile ? new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '';
  };

  // Generate initials from name for profile display when no photo
  const getInitials = () => {
    if (firstName && lastName) {
      return firstName.charAt(0) + lastName.charAt(0);
    }
    if (firstName) {
      return firstName.charAt(0);
    }
    return '';
  };

  // Get country name from country code
  const getCountryName = (code: string) => {
    const countries: {[key: string]: string} = {
      '+20': 'Egypt',
      '+1': 'United States',
      '+44': 'United Kingdom',
      '+971': 'UAE',
      '+966': 'Saudi Arabia'
    };
    
    return countries[code] || '';
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen || !isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="w-full max-w-2xl p-0 bg-white dark:bg-gray-900 dark:text-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Apply to {job?.title || ''}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
            onClick={() => onOpenChange(false)}
          >
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
          <div 
            className="bg-slate-600 dark:bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
          </div>
          <div className="text-right text-sm text-gray-600 dark:text-gray-300 pr-4 pt-1">{progress}%</div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 dark:border-gray-300"></div>
            </div>
          ) : (
            <>
              {/* Contact Info Step */}
              {currentStep === 'info' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Contact info</h2>
                  
                  {/* Profile Header */}
                  <div className="flex items-center mb-6">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl mr-3">
                        {getInitials()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-lg dark:text-gray-100">{firstName} {lastName}</h3>
                      {userInfo?.bio?.headline && (
                        <p className="text-gray-500 dark:text-gray-400">{userInfo.bio.headline}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First name*
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last name*
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone country code*
                      </label>
                      <div className="relative">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 appearance-none pr-10 dark:bg-gray-800 dark:text-white"
                          required
                        >
                          <option value="">Select a country code</option>
                          <option value="+20">Egypt (+20)</option>
                          <option value="+1">United States (+1)</option>
                          <option value="+44">United Kingdom (+44)</option>
                          <option value="+971">UAE (+971)</option>
                          <option value="+966">Saudi Arabia (+966)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mobile phone number*
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resume Step */}
              {currentStep === 'resume' && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">Resume</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Be sure to include an updated resume *</p>
                  
                  {resumeUrl && (
                    <div className="border border-gray-300 dark:border-gray-600 rounded-md mb-6 flex items-center">
                      <div className="bg-red-600 p-4 text-white font-bold">
                        PDF
                      </div>
                      <div className="px-4 py-2 flex-1">
                        <div className="font-medium dark:text-gray-100">{renderResumeFilename()}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getFileSize()}
                          {getLastUsedDate() && ` · Last used on ${getLastUsedDate()}`}
                        </div>
                      </div>
                      <div className="flex pr-4">
                        <button className="text-gray-700 dark:text-gray-300 p-2">
                          <IoMdDownload size={24} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button
                    className="flex items-center justify-center border border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 rounded-full px-6 py-2 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    Upload resume
                  </button>
                  <input 
                    id="resume-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">DOC, DOCX, PDF (2 MB)</p>
                </div>
              )}
              
              {/* Preview Step */}
              {currentStep === 'preview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">Review your application</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">The employer will also receive a copy of your profile.</p>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium dark:text-white">Contact info</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400 font-medium"
                        onClick={() => setCurrentStep('info')}
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl mr-3">
                          {getInitials()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium dark:text-white">{firstName} {lastName}</h3>
                        {userInfo?.bio?.headline && (
                          <p className="text-gray-500 dark:text-gray-400">{userInfo.bio.headline}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 pl-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">First name*</p>
                        <p className="dark:text-gray-200">{firstName}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Last name*</p>
                        <p className="dark:text-gray-200">{lastName}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Phone country code*</p>
                        <p className="dark:text-gray-200">{getCountryName(countryCode)} ({countryCode})</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Mobile phone number*</p>
                        <p className="dark:text-gray-200">{phoneNumber}</p>
                      </div>
                      
                      {email && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Email address*</p>
                          <p className="dark:text-gray-200">{email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium dark:text-white">Resume</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400 font-medium"
                        onClick={() => setCurrentStep('resume')}
                      >
                        Edit
                      </button>
                    </div>
                    
                    {resumeUrl && (
                      <div className="border border-gray-300 dark:border-gray-600 rounded-md mb-4 flex items-center">
                        <div className="bg-red-600 p-4 text-white font-bold">
                          PDF
                        </div>
                        <div className="px-4 py-2 flex-1">
                          <div className="font-medium dark:text-gray-100">{renderResumeFilename()}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getFileSize()}
                            {getLastUsedDate() && ` · Last used on ${getLastUsedDate()}`}
                          </div>
                        </div>
                        <div className="flex pr-4">
                          <button className="text-gray-700 dark:text-gray-300 p-2">
                            <IoMdDownload size={24} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Button section */}
              <div className={`${currentStep === 'preview' ? 'mt-6' : 'mt-12'} flex justify-between`}>
                {currentStep !== 'info' ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                ) : (
                  <div></div> 
                )}
                
                {currentStep === 'preview' ? (
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit application'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;