import { useState, FormEvent, useEffect, useRef, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';
import { toast } from 'sonner';
import buildingsImg from '@/assets/buildings.jpeg'

interface CompanyFormData {
  name: string;
  website: string;
  industry: string;
  size: string;
  type: string;
  phone: string;
  founded: string;
  description: string;
  tagline: string;
  category_type: string;
  logo: string;
  location?: {
    country: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    location_name: string;
  } | null;
}

interface EditPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyData?: {
    name?: string;
    website?: string;
    industry?: string;
    size?: string;
    type?: string;
    phone?: string;
    founded?: string;
    description?: string;
    tagline?: string;
    category_type?: string;
    logo?: string; 
    location?: {
      country?: string;
      address?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      location_name?: string;
    };
  };
  onSubmit: (data: CompanyFormData) => void | Promise<void>;
}

const EditPageDialog = ({ open, onOpenChange, companyData, onSubmit }: EditPageDialogProps) => {
  const [activeSection, setActiveSection] = useState<string>('Page info');
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    type: '',
    phone: '',
    founded: '',
    description: '',
    tagline: '',
    category_type: '',
    logo: '', 
  });
  const [logoUrl, setLogoUrl] = useState(buildingsImg);
  const [hasLocation, setHasLocation] = useState(false);
  const [hasStreetAddress, setHasStreetAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationData, setLocationData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    location_name: ''
  });
  
  // Add a file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Determine if this is an educational institution based on category_type
  const isEducationalInstitution = formData.category_type === 'education';
  
  // Size options mapping - exactly match the values from backend
  const sizeOptions = [
    { value: "", label: "Select size" },
    { value: "1-10 employees", label: "1-10 employees" },
    { value: "11-50 employees", label: "11-50 employees" },
    { value: "51-200 employees", label: "51-200 employees" },
    { value: "201-500 employees", label: "201-500 employees" },
    { value: "501-1000 employees", label: "501-1000 employees" },
    { value: "1001-5000 employees", label: "1001-5000 employees" },
    { value: "5001-10000 employees", label: "5001-10000 employees" },
    { value: "10001+ employees", label: "10001+ employees" }
  ];
  
  // Define type options based on category
  const educationalTypes = ['University', 'College', 'High school', 'Middle school', 'Elementary school'];
  const companyTypes = ['Public company', 'Private company', 'Nonprofit', 'Government agency', 'Partnership'];
  
  // Update form data when companyData changes or dialog opens
  useEffect(() => {
    if (companyData && open) {
      
      // Set the main form data
      setFormData({
        name: companyData.name || '',
        website: companyData.website || '',
        industry: companyData.industry || '',
        size: companyData.size || '',
        type: companyData.type || '',
        phone: companyData.phone || '',
        founded: companyData.founded || '',
        description: companyData.description || '',
        tagline: companyData.tagline || '',
        category_type: companyData.category_type || '',
        logo: companyData.logo || '',
      });
      
      // Set logo URL if it exists
      if (companyData.logo) {
        setLogoUrl(companyData.logo);
      }
      
      // Update location data and checkboxes
      const hasLoc = !!companyData.location;
      setHasLocation(hasLoc);
      
      if (hasLoc && companyData.location) {
        setLocationData({
          country: companyData.location.country || '',
          address: companyData.location.address || '',
          city: companyData.location.city || '',
          state: companyData.location.state || '',
          postal_code: companyData.location.postal_code || '',
          location_name: companyData.location.location_name || ''
        });
        
        setHasStreetAddress(!!companyData.location.address);
      }
    }
  }, [companyData, open]);

  // Handle file selection for logo upload
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size exceeds 2MB limit");
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or SVG)");
      return;
    }
    
    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      
      // Update form data with base64 string
      setFormData(prev => ({
        ...prev,
        logo: base64String
      }));
      
      // Also update the display URL
      setLogoUrl(base64String);
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the file");
    };
    
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocationData({ ...locationData, [name]: value });
  };

  const validateName = (name: string) => {
    if (!name) return 'Name is required';
    if (name.length > 50) return 'Name must be 50 characters or less';
    return null;
  };
  
  const validateWebsite = (website: string) => {
    if (!website) return null; // Website is optional
    if (!/^(https?:\/\/|www\.)/i.test(website)) {
      return 'Website must start with http://, https://, or www.';
    }
    return null;
  };
  
  const validateIndustry = (industry: string) => {
    if (!industry) return 'Industry is required';
    if (industry.length > 50) return 'Industry must be 50 characters or less';
    return null;
  };
  
  const validatePostalCode = (postalCode: string, country: string) => {
    if (!postalCode) return null; // Postal code is optional
    
    // Basic postal code validation based on country
    if (country === 'United States' && !/^\d{5}(-\d{4})?$/.test(postalCode)) {
      return 'US postal code must be in format: 12345 or 12345-6789';
    }
    
    if (country === 'Canada' && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode)) {
      return 'Canadian postal code must be in format: A1A 1A1';
    }
    
    return null;
  };
  
  const validatePhone = (phone: string) => {
    if (!phone) return null; // Phone is optional
    // Basic international phone format
    if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(phone)) {
      return 'Please enter a valid phone number';
    }
    return null;
  };
  
  const validateForm = () => {
    // Field validation
    const nameError = validateName(formData.name);
    if (nameError) {
      toast.error(nameError);
      setActiveSection('Page info');
      return false;
    }
    
    const websiteError = validateWebsite(formData.website);
    if (websiteError) {
      toast.error(websiteError);
      setActiveSection('Details');
      return false;
    }
    
    const industryError = validateIndustry(formData.industry);
    if (industryError) {
      toast.error(industryError);
      setActiveSection('Details');
      return false;
    }
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      toast.error(phoneError);
      setActiveSection('Details');
      return false;
    }
    
    if (!formData.size) {
      toast.error('Size is required');
      setActiveSection('Details');
      return false;
    }
    
    if (!formData.type) {
      toast.error('Type is required');
      setActiveSection('Details');
      return false;
    }
    
    // Location validation
    if (hasLocation) {
      if (!locationData.country) {
        toast.error('Country is required');
        setActiveSection('Location');
        return false;
      }
      
      if (!locationData.city) {
        toast.error('City is required');
        setActiveSection('Location');
        return false;
      }
      
      if (locationData.city.length > 50) {
        toast.error('City name must be 50 characters or less');
        setActiveSection('Location');
        return false;
      }
      
      if (hasStreetAddress && !locationData.address) {
        toast.error('Street address is required');
        setActiveSection('Location');
        return false;
      }
      
      if (locationData.address && locationData.address.length > 100) {
        toast.error('Street address must be 100 characters or less');
        setActiveSection('Location');
        return false;
      }
      
      if (locationData.state && locationData.state.length > 50) {
        toast.error('State/Province must be 50 characters or less');
        setActiveSection('Location');
        return false;
      }
      
      const postalCodeError = validatePostalCode(locationData.postal_code, locationData.country);
      if (postalCodeError) {
        toast.error(postalCodeError);
        setActiveSection('Location');
        return false;
      }
      
      if (locationData.location_name && locationData.location_name.length > 50) {
        toast.error('Location name must be 50 characters or less');
        setActiveSection('Location');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data to match the schema structure
      const submitData = {
        ...formData,
        location: hasLocation ? locationData : null
      };
      
      // Use toast for notification and don't show additional modal
      toast.promise(
        (async () => {
            await onSubmit(submitData);
            // Close dialog after successful submission
            setTimeout(() => onOpenChange(false), 500);
            return true;
        })(),
        {
          loading: 'Saving changes...',
          success: 'Company information updated successfully!',
          error: 'Failed to save changes. Please try again.'
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const navigationStructure = [
    {
      header: 'Header',
      sections: ['Page info']
    },
    {
      header: 'About',
      sections: ['Details', 'Location']
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'Page info':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Page info</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">* indicates required</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Logo</label>
              <div className="flex items-center mb-2">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 mr-4 border dark:border-gray-600 rounded overflow-hidden">
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={() => {
                      setLogoUrl('/api/placeholder/96/96');
                      toast.error('Failed to load logo image');
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="p-2 bg-white dark:bg-gray-700 rounded-full border dark:border-gray-600 shadow hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload JPG, PNG, GIF, or SVG (max 2MB)
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Enter institution name" : "Enter company name"}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                maxLength={50}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Tagline</label>
              <textarea
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="Add your slogan or mission statement"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                maxLength={150}
              />
            </div>
          </div>
        );
        
      // Rest of the cases (Details and Location) remain unchanged
      case 'Details':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Provide details to display on your page</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">* indicates required</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Add an About Us with a brief overview of your institution" : "Add an About Us with a brief overview of your products and services"}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                maxLength={200}
                required
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">*Required</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formData.description.length}/200 characters</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Website URL</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Add your website homepage (www.example.com)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must start with http://, https://, or www.</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Industry*</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Education" : "Software Development"}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                maxLength={50}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Size*</label>
              <div className="relative">
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {sizeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Type*</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select type</option>
                  {isEducationalInstitution ? (
                    educationalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  ) : (
                    companyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter a phone number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                maxLength={50}  
              />
            </div>
          </div>
        );
      
      case 'Location':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Update location to let members know where you're based</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">If you don't have a street address, you can exclude it.</p>
            
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={hasLocation}
                  onChange={() => setHasLocation(!hasLocation)}
                  className="mr-2 text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">My {isEducationalInstitution ? 'institution' : 'organization'} has a physical location</span>
              </label>
            </div>
            
            {hasLocation && (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Country/Region*</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={locationData.country}
                      onChange={handleLocationInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={hasLocation}
                    >
                      <option value="">Select a country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 10l5 5 5-5H7z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={!hasStreetAddress}
                      onChange={() => setHasStreetAddress(!hasStreetAddress)}
                      className="mr-2 text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">My {isEducationalInstitution ? 'institution' : 'organization'} doesn't have a street address</span>
                  </label>
                </div>
                
                {hasStreetAddress && (
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Street address*</label>
                    <input
                      type="text"
                      name="address"
                      value={locationData.address}
                      onChange={handleLocationInputChange}
                      placeholder="Enter street address"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={hasLocation && hasStreetAddress}
                      maxLength={100}
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={locationData.city}
                    onChange={handleLocationInputChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required={hasLocation}
                    maxLength={50}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={locationData.state}
                      onChange={handleLocationInputChange}
                      placeholder="Enter state"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Postal code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={locationData.postal_code}
                      onChange={handleLocationInputChange}
                      placeholder="Enter postal code"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      maxLength={50}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Location name</label>
                  <input
                    type="text"
                    name="location_name"
                    value={locationData.location_name}
                    onChange={handleLocationInputChange}
                    placeholder={isEducationalInstitution ? "Optional (e.g. Main Campus, West Wing)" : "Optional (e.g. Headquarters, Branch Office)"}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    maxLength={50}
                  />
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen || !isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="w-full max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl p-0 flex flex-col max-h-[90vh] bg-white dark:bg-gray-800 border dark:border-gray-700">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-gray-900 dark:text-white">Edit {isEducationalInstitution ? 'Institution' : 'Company'} Page</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation sidebar with section groups */}
          <div className="w-1/4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <nav>
              {navigationStructure.map((group) => (
                <div key={group.header} className="mb-4">
                  {/* Header - non-clickable title */}
                  <div className="px-6 py-2 font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700">
                    {group.header}
                  </div>
                  
                  {/* Subsections - clickable */}
                  <ul>
                    {group.sections.map((section) => (
                      <li key={section}>
                        <button
                          className={`w-full text-left px-8 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            activeSection === section 
                              ? 'text-blue-600 dark:text-blue-400 font-medium' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                          onClick={() => setActiveSection(section)}
                          disabled={isSubmitting}
                        >
                          {section}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          
          {/* Content area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6">
              <form id="editPageForm" onSubmit={handleSubmit}>
                {renderSectionContent()}
              </form>
            </div>
            
            {/* Fixed footer with buttons - always visible */}
            <div className="bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700 px-6">
              <div className="flex justify-end">
                <button
                  id="cancel-changes-button"
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    toast.info('Changes discarded');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  id="save-changes-button"
                  type="submit"
                  form="editPageForm"
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPageDialog;