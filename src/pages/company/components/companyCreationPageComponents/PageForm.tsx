import { FormEvent, useState, useEffect, ChangeEvent } from 'react';
import { createCompanyProfile } from '@/endpoints/company';
import { CompanyProfileData } from "../../../jobs/types";
import { toast } from 'sonner';

interface PageFormProps {
  type: 'company' | 'education';
  onSubmit: (e: FormEvent) => void;
  setPreviewData?: (data: {
    logoPreview: string | null;
    name: string;
    description: string;
  }) => void;
}

export const PageForm: React.FC<PageFormProps> = ({ type, onSubmit, setPreviewData }) => {
  const [formData, setFormData] = useState<CompanyProfileData>({
    name: '',
    category_type: type,
    unique_url: '',
    website: '',
    logo: '',
    description: '',
    industry: '',
    location: '',
    size: '',
    type: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Update preview when relevant form data changes
  useEffect(() => {
    if (setPreviewData) {
      setPreviewData({
        logoPreview,
        name: formData.name,
        description: formData.description || ''
      });
    }
  }, [formData.name, formData.description, logoPreview, setPreviewData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: CompanyProfileData) => ({ ...prevData, [name]: value }));
    
    if (name === 'description') {
      setCharCount(value.length);
    }
  };
  
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG, JPEG, or PNG file only.');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image must be less than 2MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setLogoPreview(base64String);
      setFormData(prevData => ({
        ...prevData,
        logo: base64String
      }));
    };
    reader.onerror = () => {
      toast.error('Error reading file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };
  
  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Name is required.');
      return false;
    }
    
    if (!formData.industry.trim()) {
      toast.error('Industry is required.');
      return false;
    }
    
    if (!formData.size) {
      toast.error('Organization size is required.');
      return false;
    }
    
    if (!formData.type) {
      toast.error('Organization type is required.');
      return false;
    }
    
    return true;
  };
  
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      // Format data for API
      const apiData: CompanyProfileData = {
        ...formData,
        // Make sure category_type matches what the API expects
        category_type: type,
      };
      
      // Log the API request for debugging
      console.log('Sending API request with data:', apiData);
      
      const response = await createCompanyProfile(apiData);
      console.log('API response:', response);
      
      // Show success toast notification
      toast.success(`${type === 'company' ? 'Company' : 'Education'} profile created successfully!`);
      
      onSubmit(e);
    } catch (err: any) {
      console.error('Error creating company profile:', err);
      
      // More user-friendly error message with toast
      if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Failed to create profile. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <p className="text-xs text-gray-500 mb-4">* indicates required</p>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Name*</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Add your organization's name" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Website</label>
        <input 
          type="text" 
          name="website"
          value={formData.website || ''}
          onChange={handleChange}
          placeholder="Begin with http://, https:// or www." 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Industry*</label>
        <input 
          type="text" 
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="ex: Information Services" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Organization size*</label>
        <div className="relative">
          <select 
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select size</option>
            <option value="1-10 employees">1-10 employees</option>
            <option value="11-50 employees">11-50 employees</option>
            <option value="51-200 employees">51-200 employees</option>
            <option value="201-500 employees">201-500 employees</option>
            <option value="501-1000 employees">501-1000 employees</option>
            <option value="1001-5000 employees">1001-5000 employees</option>
            <option value="5001-10000 employees">5001-10000 employees</option>
            <option value="10001+ employees">10001+ employees</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Organization type*</label>
        <div className="relative">
          <select 
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            {type === 'company' ? (
              <>
                <option value="Public company">Public company</option>
                <option value="Private company">Private company</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="Government agency">Government agency</option>
                <option value="Partnership">Partnership</option>
              </>
            ) : (
              <>
                <option value="University">University</option>
                <option value="College">College</option>
                <option value="High school">High school</option>
                <option value="Middle school">Middle school</option>
                <option value="Elementary school">Elementary school</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Logo</label>
        <input 
          type="file" 
          accept=".jpg,.jpeg,.png" 
          onChange={handleLogoUpload}
          className="hidden" 
          id="logo-upload"
        />
        <label htmlFor="logo-upload" className={`border border-dashed border-gray-300 dark:border-gray-600 rounded p-6 flex flex-col items-center justify-center text-center cursor-pointer ${logoPreview ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
          {logoPreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                className="max-w-full max-h-40 mb-2"
              />
              <span className="text-blue-600">Change logo</span>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-blue-600">Choose file</span>
              <span className="text-sm text-gray-500 mt-1">Upload to see preview</span>
            </>
          )}
        </label>
        <p className="text-xs text-gray-500 mt-1">300 x 300px recommended. JPGs, JPEGs, and PNGs supported. Max size 2MB.</p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Description</label>
        <textarea 
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="ex: An information services firm helping small businesses succeed." 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={120}
        ></textarea>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Use your tagline to briefly describe what your organization does. This can be changed later.</span>
          <span>{charCount}/120</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 mr-2"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
            I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.
          </label>
        </div>
        <a href="#" className="text-blue-600 text-sm mt-1 block">Read the LinkUp Pages Terms</a>
      </div>

      <div className="flex justify-center mt-6">
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Creating page...' : 'Create page'}
        </button>
      </div>
    </form>
  );
};

export default PageForm;