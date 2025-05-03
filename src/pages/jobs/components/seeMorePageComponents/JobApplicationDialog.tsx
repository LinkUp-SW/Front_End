import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { IoMdDownload } from 'react-icons/io';
import { Job } from '@/pages/jobs/types';
import { 
  UserInfo, 
  JobApplicationData, 
  fetchUserJobApplicationInfo, 
  submitJobApplication 
} from '@/endpoints/jobs';
import { COUNTRY_PHONE_CODE_MAP } from "@/constants/index"; 

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

  // Validation state
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Fetch user info on dialog open
  useEffect(() => {
    if (open) {
      fetchUserInfo();
    } else {
      // Reset state when dialog closes
      resetForm();
    }
  }, [open]);

  // Reset form state
  const resetForm = () => {
    setCurrentStep('info');
    setProgress(0);
    setIsResumeUploaded(false);
    setResumeBase64(null);
    setPhoneNumberError('');
    setEmailError('');
  };

  // Update progress based on current step
  useEffect(() => {
    if (currentStep === 'info') setProgress(40);
    else if (currentStep === 'resume') setProgress(70);
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

  // Validation functions
  const validateEmail = (email: string): boolean => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Regular expression to allow only digits
    const phoneRegex = /^\d+$/;
    if (!phone.trim()) {
      setPhoneNumberError('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneNumberError('Phone number should contain digits only');
      return false;
    } else if (phone.length < 5 || phone.length > 15) {
      setPhoneNumberError('Phone number should be between 5-15 digits');
      return false;
    }
    setPhoneNumberError('');
    return true;
  };

  // Handle phone number input changes with real-time validation
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    if (value === '' || /^\d*$/.test(value)) {
      setPhoneNumber(value);
      if (phoneNumberError) validatePhoneNumber(value);
    }
  };

  // Handle email input changes with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  // Function to handle application submission
  const handleSubmitApplication = async () => {
    if (!job || !job._id) {
      toast.error('Job information is missing');
      return;
    }

    // Validate before submitting
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    
    if (!isEmailValid || !isPhoneValid) {
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
      // Validate all fields in the info step
      const isEmailValid = validateEmail(email);
      const isPhoneValid = validatePhoneNumber(phoneNumber);
      
      if (!firstName.trim()) {
        toast.error('First name is required');
        return;
      }
      
      if (!lastName.trim()) {
        toast.error('Last name is required');
        return;
      }
      
      if (!countryCode) {
        toast.error('Country code is required');
        return; 
      }
      
      if (!isEmailValid || !isPhoneValid) {
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
    // Create a reverse mapping from phone code to country name
    const reverseMap: {[key: string]: string} = {};
    
    for (const [country, phoneCode] of Object.entries(COUNTRY_PHONE_CODE_MAP)) {
      reverseMap[phoneCode] = country;
    }
    
    return reverseMap[code] || '';
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen || !isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="w-full max-w-2xl sm:w-11/12 md:w-4/5 lg:max-w-2xl p-0 bg-white dark:bg-gray-900 dark:text-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white truncate">Apply to {job?.title || ''}</h2>
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
          <div className="text-right text-xs sm:text-sm text-gray-600 dark:text-gray-300 pr-4 pt-1">{progress}%</div>
        </div>
        
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-600 dark:border-gray-300"></div>
            </div>
          ) : (
            <>
              {/* Contact Info Step */}
              {currentStep === 'info' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-white">Contact info</h2>
                  
                  {/* Profile Header */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mr-3">
                        {getInitials()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-base sm:text-lg dark:text-gray-100">{firstName} {lastName}</h3>
                      {userInfo?.bio?.headline && (
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{userInfo.bio.headline}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First name*
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                        required
                        maxLength={50}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last name*
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                        required
                        maxLength={50}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone country code*
                        </label>
                        <div className="relative">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 appearance-none pr-10 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                            required
                          >
                            <option value="">Select a country code</option>
                            {Object.entries(COUNTRY_PHONE_CODE_MAP).map(([country, code]) => (
                              <option key={code} value={code}>
                                {country} ({code})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mobile phone number*
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          className={`w-full px-3 py-2 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded focus:outline-none focus:ring-1 ${phoneNumberError ? 'focus:ring-red-500' : 'focus:ring-gray-400 dark:focus:ring-gray-500'} dark:bg-gray-800 dark:text-white text-sm sm:text-base`}
                          required
                          maxLength={15}
                          onBlur={() => validatePhoneNumber(phoneNumber)}
                        />
                        {phoneNumberError && (
                          <p className="text-xs text-red-500 mt-1">{phoneNumberError}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded focus:outline-none focus:ring-1 ${emailError ? 'focus:ring-red-500' : 'focus:ring-gray-400 dark:focus:ring-gray-500'} dark:bg-gray-800 dark:text-white text-sm sm:text-base`}
                        required
                        maxLength={50}
                        onBlur={() => validateEmail(email)}
                      />
                      {emailError && (
                        <p className="text-xs text-red-500 mt-1">{emailError}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resume Step */}
              {currentStep === 'resume' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 dark:text-white">Resume</h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Be sure to include an updated resume *</p>
                  
                  {resumeUrl && (
                    <div className="border border-gray-300 dark:border-gray-600 rounded-md mb-4 sm:mb-6 flex items-center overflow-hidden">
                      <div className="bg-red-600 p-2 sm:p-4 text-white font-bold text-xs sm:text-base">
                        PDF
                      </div>
                      <div className="px-2 sm:px-4 py-2 flex-1 min-w-0">
                        <div className="font-medium dark:text-gray-100 text-sm sm:text-base truncate">{renderResumeFilename()}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {getFileSize()}
                          {getLastUsedDate() && ` · Last used on ${getLastUsedDate()}`}
                        </div>
                      </div>
                      <div className="flex pr-2 sm:pr-4">
                        <button className="text-gray-700 dark:text-gray-300 p-1 sm:p-2">
                          <IoMdDownload size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button
                    className="flex items-center justify-center border border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 w-full sm:w-auto"
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
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">DOC, DOCX, PDF (2 MB)</p>
                </div>
              )}
              
              {/* Preview Step */}
              {currentStep === 'preview' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 dark:text-white">Review your application</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">The employer will also receive a copy of your profile.</p>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-sm sm:text-base dark:text-white">Contact info</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm"
                        onClick={() => setCurrentStep('info')}
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex items-center mb-3 sm:mb-4">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile" 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-2 sm:mr-3">
                          {getInitials()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-sm sm:text-base dark:text-white">{firstName} {lastName}</h3>
                        {userInfo?.bio?.headline && (
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{userInfo.bio.headline}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 pl-2 sm:pl-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">First name*</p>
                        <p className="text-xs sm:text-sm dark:text-gray-200">{firstName}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last name*</p>
                        <p className="text-xs sm:text-sm dark:text-gray-200">{lastName}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone country code*</p>
                        <p className="text-xs sm:text-sm dark:text-gray-200">{getCountryName(countryCode)} ({countryCode})</p>
                      </div>
                      
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Mobile phone number*</p>
                        <p className="text-xs sm:text-sm dark:text-gray-200">{phoneNumber}</p>
                      </div>
                      
                      {email && (
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email address*</p>
                          <p className="text-xs sm:text-sm dark:text-gray-200">{email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-sm sm:text-base dark:text-white">Resume</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm"
                        onClick={() => setCurrentStep('resume')}
                      >
                        Edit
                      </button>
                    </div>
                    
                    {resumeUrl && (
                      <div className="border border-gray-300 dark:border-gray-600 rounded-md mb-3 sm:mb-4 flex items-center overflow-hidden">
                        <div className="bg-red-600 p-2 sm:p-4 text-white font-bold text-xs sm:text-base">
                          PDF
                        </div>
                        <div className="px-2 sm:px-4 py-2 flex-1 min-w-0">
                          <div className="font-medium dark:text-gray-100 text-sm sm:text-base truncate">{renderResumeFilename()}</div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {getFileSize()}
                            {getLastUsedDate() && ` · Last used on ${getLastUsedDate()}`}
                          </div>
                        </div>
                        <div className="flex pr-2 sm:pr-4">
                          <button className="text-gray-700 dark:text-gray-300 p-1 sm:p-2">
                            <IoMdDownload size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Button section */}
              <div className={`${currentStep === 'preview' ? 'mt-4 sm:mt-6' : 'mt-8 sm:mt-12'} flex justify-between`}>
                {currentStep !== 'info' ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
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
                    className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit application'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
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