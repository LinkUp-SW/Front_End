import React, { useState, useEffect } from 'react';
import { MdArrowDropDown, MdMenu, MdClose } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobFilters } from '../../pages/jobs/types';

interface JobFilterBarProps {
  onFiltersChange: (filters: JobFilters) => void;
}

const JobFilterBar: React.FC<JobFilterBarProps> = ({ onFiltersChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filters, setFilters] = useState<JobFilters>({
    locations: [],
    company: [],
    experienceLevels: [],
    workModes: [],
    salaryRanges: []
  });

  const experienceLevels = [
    'Internship',
    'Entry Level',
    'Associate',
    'Mid-Senior',
    'Director',
    'Executive'
  ];

  const locations = ['Egypt', 'United States', 'Saudi Arabia', 'United Kingdom'];
  const company = ['Fortune 500', 'Orascom', 'Health Insights', 'Vodafone', 'Microsoft'];
  const remoteOptions = ['On-site', 'Remote', 'Hybrid'];
  const salaryRanges = ['1000-5000', '5000-10000', '10000+'];

  // Close menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Close the mobile menu when resizing
      setIsMenuOpen(false);
      // Close any open popovers/dropdowns
      setActivePopover(null);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update filters based on search inputs
  const updateSearchFilters = (type: 'locations' | 'company', searchTerm: string) => {
    const newFilters = {
      ...filters,
      [type]: searchTerm ? [searchTerm] : []
    };
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Update specific filter
  const updateFilter = (filterType: keyof JobFilters, value: string, isChecked: boolean) => {
    const newFilters = {
      ...filters,
      [filterType]: isChecked 
        ? [...filters[filterType], value] 
        : filters[filterType].filter(item => item !== value)
    };
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const filterOptions = [
    {
      label: 'Location',
      component: (
        <div className="w-64 p-2 bg-white dark:bg-gray-800">
          <Input
            id="location-search-input"
            placeholder="Search Location..."
            value={searchLocation}
            onChange={(e) => {
              const value = e.target.value;
              setSearchLocation(value);
              updateSearchFilters('locations', value);
            }}
            className="mb-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Suggestions:
          </div>
          {locations
            .filter((loc) => loc.toLowerCase().includes(searchLocation.toLowerCase()))
            .map((loc) => (
              <Button 
                id={`location-option-${loc.toLowerCase().replace(/\s+/g, '-')}`}
                key={loc} 
                variant="ghost" 
                onClick={() => {
                  setSearchLocation(loc);
                  updateSearchFilters('locations', loc);
                  setActivePopover(null); // Close the popover after selection
                }}
                className="w-full justify-start dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {loc}
              </Button>
            ))}
        </div>
      ),
    },
    {
      label: 'Company',
      component: (
        <div className="w-64 p-2 bg-white dark:bg-gray-800">
          <Input
            id="company-search-input"
            placeholder="Search Company..."
            value={searchCompany}
            onChange={(e) => {
              const value = e.target.value;
              setSearchCompany(value);
              updateSearchFilters('company', value);
            }}
            className="mb-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Suggestions:
          </div>
          {company
            .filter((comp) => comp.toLowerCase().includes(searchCompany.toLowerCase()))
            .map((comp) => (
              <Button 
                id={`company-option-${comp.toLowerCase().replace(/\s+/g, '-')}`}
                key={comp} 
                variant="ghost" 
                onClick={() => {
                  setSearchCompany(comp);
                  updateSearchFilters('company', comp);
                  setActivePopover(null); // Close the popover after selection
                }}
                className="w-full justify-start dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {comp}
              </Button>
            ))}
        </div>
      ),
    },
    {
      label: 'Experience level',
      component: (
        <div className="w-64 bg-white dark:bg-gray-800">
          {experienceLevels.map((level) => (
            <div 
              key={level} 
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input 
                type="checkbox" 
                id={`experience-${level.toLowerCase().replace(/\s+/g, '-')}`}
                checked={filters.experienceLevels.includes(level)}
                onChange={(e) => updateFilter('experienceLevels', level, e.target.checked)}
                className="w-4 h-4 mr-3 accent-green-800 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <label 
                htmlFor={`experience-${level.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm flex-grow cursor-pointer dark:text-gray-200"
              >
                {level}
              </label>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Work Mode',
      component: (
        <div className="w-64 bg-white dark:bg-gray-800">
          {remoteOptions.map((option) => (
            <div 
              key={option} 
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input 
                type="checkbox" 
                id={`workmode-${option.toLowerCase().replace(/\s+/g, '-')}`}
                checked={filters.workModes.includes(option)}
                onChange={(e) => updateFilter('workModes', option, e.target.checked)}
                className="w-4 h-4 mr-3 accent-green-800 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <label 
                htmlFor={`workmode-${option.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm flex-grow cursor-pointer dark:text-gray-200"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Salary range',
      component: (
        <div className="w-64 bg-white dark:bg-gray-800">
          {salaryRanges.map((range) => (
            <div 
              key={range} 
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input 
                type="checkbox" 
                id={`salary-${range.replace(/\+/g, 'plus').replace(/-/g, 'to')}`}
                checked={filters.salaryRanges.includes(range)}
                onChange={(e) => updateFilter('salaryRanges', range, e.target.checked)}
                className="w-4 h-4 mr-3 accent-green-800 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <label 
                htmlFor={`salary-${range.replace(/\+/g, 'plus').replace(/-/g, 'to')}`} 
                className="text-sm flex-grow cursor-pointer dark:text-gray-200"
              >
                {range}
              </label>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full border-y bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex items-center justify-center px-4 py-3 fixed top-14 left-0 z-13">
      <nav className="w-full max-w-7xl px-4 sm:px-6 lg:px-18">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle - Shows hamburger or X based on menu state */}
          <div className="lg:hidden z-30">
            <button 
              id="mobile-menu-toggle"
              onClick={toggleMenu} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <MdClose size={24} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <MdMenu size={24} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Main Filter Content - Backdrop for mobile view */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" />
          )}

          {/* Main Filter Content */}
          <div className={`
            fixed inset-0 bg-white dark:bg-gray-900 z-20 transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:static lg:translate-x-0 lg:bg-transparent lg:dark:bg-transparent
            flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full
          `}>
            {/* Close Button for Mobile */}
            <button 
              id="close-mobile-menu"
              onClick={() => setIsMenuOpen(false)} 
              className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close menu"
            >
              <MdClose size={24} className="text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex flex-col lg:flex-row items-center gap-4 w-full max-w-7xl px-4">
              <div className="flex items-center bg-green-800 text-white px-4 py-2.5 rounded-full text-base">
                <span>Jobs</span>
              </div>
              <div className="hidden lg:block h-6 border-l border-gray-300 dark:border-gray-700 mx-2"></div>
              <div className="flex flex-col lg:flex-row items-center gap-3 w-full overflow-x-auto">
                {filterOptions.map((filter) => (
                  <Popover 
                    key={filter.label} 
                    open={activePopover === filter.label} 
                    onOpenChange={(open) => setActivePopover(open ? filter.label : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button 
                        id={`filter-${filter.label.toLowerCase().replace(/\s+/g, '-')}`}
                        variant="outline" 
                        className="w-full lg:w-auto flex items-center justify-between px-4 py-2.5 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-full text-base hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap dark:text-gray-200"
                      >
                        {filter.label}
                        <MdArrowDropDown size={24} className="ml-2 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0 border-none shadow-lg dark:bg-gray-800">
                      {filter.component}
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default JobFilterBar;