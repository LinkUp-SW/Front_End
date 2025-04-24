import { useState, FormEvent, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';
import { toast } from 'sonner';

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
    location?: {
      country?: string;
      address?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      location_name?: string;
    };
  };
  onSubmit: (data: any) => void;
}

const EditPageDialog = ({ open, onOpenChange, companyData, onSubmit }: EditPageDialogProps) => {
  const [activeSection, setActiveSection] = useState<string>('Page info');
  const [formData, setFormData] = useState(companyData || {});
  const [hasWebsite, setHasWebsite] = useState(!formData.website?.includes('no-website'));
  const [logoUrl, setLogoUrl] = useState('/src/assets/buildings.jpeg');
  const [hasLocation, setHasLocation] = useState(!!formData.location);
  const [hasStreetAddress, setHasStreetAddress] = useState(!!formData.location?.address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update form data when companyData changes
  useEffect(() => {
    if (companyData) {
      setFormData(companyData);
      setHasWebsite(!companyData.website?.includes('no-website'));
      setHasLocation(!!companyData.location);
      setHasStreetAddress(!!companyData.location?.address);
    }
  }, [companyData]);
  
  // Determine if this is an educational institution or company based on type
  const isEducationalInstitution = formData.type === 'University' || 
                                  formData.type === 'College' || 
                                  formData.type === 'High School' ||
                                  formData.type === 'Middle School' ||
                                  formData.type === 'Elementary School';

  // Initialize location data
  const [locationData, setLocationData] = useState({
    country: formData.location?.country || '',
    address: formData.location?.address || '',
    city: formData.location?.city || '',
    state: formData.location?.state || '',
    postal_code: formData.location?.postal_code || '',
    location_name: formData.location?.location_name || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocationData({ ...locationData, [name]: value });
  };

  const validateForm = () => {
    // Required fields validation
    const requiredFields = {
      'name': 'Name',
      'industry': 'Industry',
      'size': 'Size',
      'type': 'Type'
    };
    
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`${label} is required`);
        return false;
      }
    }
    
    // Description validation
    if (!formData.description) {
      toast.error('Description is required');
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
      
      if (hasStreetAddress && !locationData.address) {
        toast.error('Street address is required');
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
        // Create a promise that resolves with the onSubmit result
        new Promise(async (resolve, reject) => {
          try {
            await onSubmit(submitData);
            resolve(true);
            // Close dialog after successful submission
            setTimeout(() => onOpenChange(false), 500);
          } catch (error) {
            reject(error);
          }
        }),
        {
          loading: 'Saving changes...',
          success: 'Company information updated successfully!',
          error: 'Failed to save changes. Please try again.'
        }
      );
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of component code remains unchanged
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
            <h3 className="text-lg font-medium mb-4">Page info</h3>
            <p className="text-sm text-gray-500 mb-4">* indicates required</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Logo</label>
              <div className="flex items-center mb-2">
                <div className="w-24 h-24 bg-gray-100 mr-4 border rounded overflow-hidden">
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
                  className="p-2 bg-white rounded-full border shadow hover:bg-gray-50"
                  onClick={() => toast.info('Logo upload functionality coming soon!')}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Enter institution name" : "Enter company name"}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500">{formData.name?.length || 0}/100</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Tagline</label>
              <textarea
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Add your motto or mission statement" : "Add your slogan or mission statement"}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500">{formData.tagline?.length || 0}/120</span>
              </div>
            </div>
          </div>
        );
        
      case 'Details':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">Provide details to display on your page</h3>
            <p className="text-sm text-gray-500 mb-4">* indicates required</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Description*</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Add an About Us with a brief overview of your institution" : "Add an About Us with a brief overview of your products and services"}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
                required
              />
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500">{formData.description?.length || 0}/500</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Website URL</label>
              <input
                type="text"
                name="website"
                value={hasWebsite ? (formData.website || '') : ''}
                onChange={handleInputChange}
                placeholder="Add your website homepage (www.example.com)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={!hasWebsite}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Industry*</label>
              <input
                type="text"
                name="industry"
                value={formData.industry || (isEducationalInstitution ? 'Education' : '')}
                onChange={handleInputChange}
                placeholder={isEducationalInstitution ? "Education" : "Software Development"}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Size*</label>
              <div className="relative">
                <select
                  name="size"
                  value={formData.size || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5001-10000">5001-10000 employees</option>
                  <option value="10001+">10001+ employees</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Type*</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  {isEducationalInstitution ? (
                    <>
                      <option value="University">University</option>
                      <option value="College">College</option>
                      <option value="High School">High School</option>
                      <option value="Middle School">Middle School</option>
                      <option value="Elementary School">Elementary School</option>
                    </>
                  ) : (
                    <>
                      <option value="Public Company">Public Company</option>
                      <option value="Private Company">Private Company</option>
                      <option value="Nonprofit">Nonprofit</option>
                      <option value="Government Agency">Government Agency</option>
                      <option value="Partnership">Partnership</option>
                    </>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter a phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      
      case 'Location':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">Update location to let members know where you're based</h3>
            <p className="text-gray-500 mb-4">If you don't have a street address, you can exclude it.</p>
            
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={hasLocation}
                  onChange={() => setHasLocation(!hasLocation)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">My {isEducationalInstitution ? 'institution' : 'organization'} has a physical location</span>
              </label>
            </div>
            
            {hasLocation && (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Country/Region*</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={locationData.country}
                      onChange={handleLocationInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
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
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">My {isEducationalInstitution ? 'institution' : 'organization'} doesn't have a street address</span>
                  </label>
                </div>
                
                {hasStreetAddress && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Street address*</label>
                    <input
                      type="text"
                      name="address"
                      value={locationData.address}
                      onChange={handleLocationInputChange}
                      placeholder="Enter street address"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required={hasLocation && hasStreetAddress}
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={locationData.city}
                    onChange={handleLocationInputChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required={hasLocation}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={locationData.state}
                      onChange={handleLocationInputChange}
                      placeholder="Enter state"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Postal code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={locationData.postal_code}
                      onChange={handleLocationInputChange}
                      placeholder="Enter postal code"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Location name</label>
                  <input
                    type="text"
                    name="location_name"
                    value={locationData.location_name}
                    onChange={handleLocationInputChange}
                    placeholder={isEducationalInstitution ? "Optional (e.g. Main Campus, West Wing)" : "Optional (e.g. Headquarters, Branch Office)"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      <DialogContent className="w-full max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle>Edit {isEducationalInstitution ? 'Institution' : 'Company'} Page</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation sidebar with section groups */}
          <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
            <nav>
              {navigationStructure.map((group) => (
                <div key={group.header} className="mb-4">
                  {/* Header - non-clickable title */}
                  <div className="px-6 py-2 font-medium text-gray-900 bg-gray-100">
                    {group.header}
                  </div>
                  
                  {/* Subsections - clickable */}
                  <ul>
                    {group.sections.map((section) => (
                      <li key={section}>
                        <button
                          className={`w-full text-left px-8 py-2 hover:bg-gray-50 ${
                            activeSection === section ? 'text-blue-600 font-medium' : 'text-gray-700'
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
            <div className="bg-white py-4 border-t border-gray-200 px-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    toast.info('Changes discarded');
                  }}
                  className="px-4 py-2 text-gray-700 mr-2 hover:bg-gray-100 rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="editPageForm"
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
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