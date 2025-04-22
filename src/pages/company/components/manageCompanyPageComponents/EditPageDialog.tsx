import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';

interface EditPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyData?: {
    name?: string;
    url?: string;
    industry?: string;
    size?: string;
    type?: string;
    phone?: string;
    founded?: string;
    overview?: string;
    tagline?: string;
    linkedinUrl?: string;
    locations?: Array<{
      country?: string;
      streetAddress?: string;
      suite?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      name?: string;
      hasStreetAddress?: boolean;
    }>;
  };
  onSubmit: (data: any) => void;
}

const EditPageDialog = ({ open, onOpenChange, companyData, onSubmit }: EditPageDialogProps) => {
  const [activeSection, setActiveSection] = useState<string>('Page info');
  const [formData, setFormData] = useState(companyData || {});
  const [hasWebsite, setHasWebsite] = useState(!formData.url?.includes('no-website'));
  const [logoUrl, setLogoUrl] = useState('/src/assets/buildings.jpeg');
  const [locations, setLocations] = useState(formData.locations || []);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    country: '',
    streetAddress: '',
    suite: '',
    city: '',
    state: '',
    zipCode: '',
    name: '',
    hasStreetAddress: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setNewLocation({ ...newLocation, [name]: checkbox.checked });
    } else {
      setNewLocation({ ...newLocation, [name]: value });
    }
  };

  const handleAddLocation = () => {
    setLocations([...locations, newLocation]);
    setShowAddLocation(false);
    setNewLocation({
      country: '',
      streetAddress: '',
      suite: '',
      city: '',
      state: '',
      zipCode: '',
      name: '',
      hasStreetAddress: true
    });
    setFormData({ ...formData, locations: [...locations, newLocation] });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, locations });
    onOpenChange(false);
  };

  const navigationStructure = [
    {
      header: 'Header',
      sections: ['Page info']
    },
    {
      header: 'About',
      sections: ['Details', 'Locations']
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
                    alt="Company logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="p-2 bg-white rounded-full border shadow hover:bg-gray-50"
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
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500">11/100</span>
              </div>
            </div>
            
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Tagline</label>
              <textarea
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleInputChange}
                placeholder="Add your slogan or mission statement"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500">0/120</span>
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
              <label className="block text-gray-700 mb-1 text-sm font-medium">Overview*</label>
              <textarea
                name="overview"
                value={formData.overview || ''}
                onChange={handleInputChange}
                placeholder="Add an About Us with a brief overview of your products and services"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-between mt-1">
                <a href="#" className="text-blue-600 text-sm">Manage description in another language</a>
                <span className="text-sm text-gray-500">0/2,000</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Website URL*</label>
              <input
                type="text"
                name="url"
                value={hasWebsite ? (formData.url || '') : ''}
                onChange={handleInputChange}
                placeholder="Add your website homepage (www.example.com)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={!hasWebsite}
              />
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={!hasWebsite}
                    onChange={() => setHasWebsite(!hasWebsite)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">My organization doesn't have a website</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Industry*</label>
              <input
                type="text"
                name="industry"
                value={formData.industry || 'Software Development'}
                onChange={handleInputChange}
                placeholder="Software Development"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1 text-sm font-medium">Company size*</label>
              <div className="relative">
                <select
                  name="size"
                  value={formData.size || '0-1 employees'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <label className="block text-gray-700 mb-1 text-sm font-medium">Company type*</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type || 'Non Profit'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Non Profit">Non Profit</option>
                  <option value="Public Company">Public Company</option>
                  <option value="Private Company">Private Company</option>
                  <option value="Government Agency">Government Agency</option>
                  <option value="Educational Institution">Educational Institution</option>
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
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter a phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      
      case 'Locations':
        return (
          <div className="py-4">
            
            {!showAddLocation ? (
              <>
              <h3 className="text-lg font-medium mb-4">Update locations to let members know where you're based</h3>
               <p className="text-gray-500 mb-4">If you don't have a street address, you can exclude it.</p>
            
                {locations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-64 mx-auto mb-4">
                      <img 
                        src="/src/assets/man_on_chair.svg" 
                        alt="Person at desk illustration" 
                        className="w-full"
                      />
                    </div>
                    <p className="mb-8">Get started by adding a location</p>
                    <button
                      type="button"
                      onClick={() => setShowAddLocation(true)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded flex items-center mx-auto"
                    >
                      <span className="mr-2">+</span>
                      Add a location
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Display existing locations here */}
                    <div className="mb-4">
                      {locations.map((loc, index) => (
                        <div key={index} className="p-4 border rounded mb-2">
                          <div className="flex justify-between">
                            <p className="font-medium">{loc.name || `${loc.city}, ${loc.state}`}</p>
                            <button className="text-blue-600">Edit</button>
                          </div>
                          <p className="text-gray-600">{loc.streetAddress}</p>
                          <p className="text-gray-600">{loc.city}, {loc.state} {loc.zipCode}</p>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowAddLocation(true)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded flex items-center"
                    >
                      <span className="mr-2">+</span>
                      Add a location
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h4 className="text-lg font-medium mb-4">Add a location</h4>
                <p className="text-gray-600 mb-4">Let's enter your primary location. You can edit, remove, or add more locations later.</p>
                <p className="text-sm text-gray-500 mb-4">* indicates required</p>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Country/Region*</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={newLocation.country}
                      onChange={handleLocationInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select a country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      {/* Add more countries as needed */}
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
                      name="hasStreetAddress"
                      checked={!newLocation.hasStreetAddress}
                      onChange={(e) => setNewLocation({...newLocation, hasStreetAddress: !e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">My organization doesn't have a street address</span>
                  </label>
                </div>
                
                {newLocation.hasStreetAddress && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Street address*</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={newLocation.streetAddress}
                      onChange={handleLocationInputChange}
                      placeholder="Enter street address"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={newLocation.city}
                    onChange={handleLocationInputChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={newLocation.state}
                      onChange={handleLocationInputChange}
                      placeholder="Enter state"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">ZIP/Postal code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={newLocation.zipCode}
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
                    name="name"
                    value={newLocation.name}
                    onChange={handleLocationInputChange}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddLocation(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add Location
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-screen-xl p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle>Edit</DialogTitle>
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
                            activeSection === section ? 'text-green-600 font-medium' : 'text-gray-700'
                          }`}
                          onClick={() => setActiveSection(section)}
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
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-gray-700 mr-2 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="editPageForm"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
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