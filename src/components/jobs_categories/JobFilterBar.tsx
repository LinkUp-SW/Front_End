import React, { useState } from 'react';
import { MdArrowDropDown, MdMenu, MdClose } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Type for filter options to improve type safety
interface FilterOption {
  label: string;
  component?: React.ReactNode;
  options?: string[];
}

const JobFilterBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);

  const experienceLevels = [
    'Internship',
    'Entry level',
    'Associate',
    'Mid-Senior level',
    'Director',
    'Executive'
  ];

  const locations = ['Egypt', 'United States', 'Saudi Arabia', 'United Kingdom'];
  const companyTypes = ['Fortune 500', 'Startup', 'Public', 'Private', 'Non-profit'];
  const remoteOptions = ['On-site', 'Remote', 'Hybrid'];
  const salaryRanges = ['1000-5000', '5000-10000', '10000+'];

  const filterOptions: FilterOption[] = [
    {
      label: 'Location',
      component: (
        <div className="w-64 p-2 bg-white dark:bg-gray-800">
          <Input
            placeholder="Search Location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="mb-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          {locations
            .filter((loc) => loc.toLowerCase().includes(searchLocation.toLowerCase()))
            .map((loc) => (
              <Button 
                key={loc} 
                variant="ghost" 
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
            placeholder="Search Company..."
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="mb-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          {companyTypes
            .filter((comp) => comp.toLowerCase().includes(searchCompany.toLowerCase()))
            .map((comp) => (
              <Button 
                key={comp} 
                variant="ghost" 
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
                id={level}
                checked={selectedExperienceLevels.includes(level)}
                onChange={(e) => {
                  setSelectedExperienceLevels(prev => 
                    e.target.checked 
                      ? [...prev, level] 
                      : prev.filter(l => l !== level)
                  );
                }}
                className="w-4 h-4 mr-3 accent-green-800 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <label 
                htmlFor={level} 
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
      label: 'Remote',
      options: remoteOptions,
    },
    {
      label: 'Salary range',
      options: salaryRanges,
    },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full border-y bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex items-center justify-center px-4 py-3 fixed top-14 left-0 z-10">
      <nav className="w-full max-w-7xl px-4 sm:px-6 lg:px-18">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
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

          {/* Main Filter Content */}
          <div className={`
            fixed inset-0 bg-white dark:bg-gray-900 z-20 transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:static lg:translate-x-0 lg:bg-transparent lg:dark:bg-transparent
            flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full
          `}>
            {/* Close Button for Mobile */}
            <button 
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
                        variant="outline" 
                        className="w-full lg:w-auto flex items-center justify-between px-4 py-2.5 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-full text-base hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap dark:text-gray-200"
                      >
                        {filter.label}
                        <MdArrowDropDown size={24} className="ml-2 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0 border-none shadow-lg dark:bg-gray-800">
                      {filter.component || (
                        <div className="flex flex-col">
                          {filter.options?.map((option) => (
                            <Button 
                              key={option} 
                              variant="ghost" 
                              className="justify-start px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left dark:text-gray-300"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
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