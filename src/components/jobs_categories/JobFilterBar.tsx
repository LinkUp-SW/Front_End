import React, { useState } from 'react';
import { MdArrowDropDown, MdMenu } from 'react-icons/md';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const JobFilterBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const filterOptions = [
    { 
      label: 'Location', 
      options: [
        'Egypt', 
        'United States', 
        'Saudi Arabia', 
        'United Kingdom'
      ] 
    },
    { 
      label: 'Experience level', 
      options: [
        'Internship', 
        'Entry level', 
        'Associate', 
        'Mid-Senior level', 
        'Director', 
        'Executive'
      ] 
    },
    { 
      label: 'Company', 
      options: [
        'Fortune 500', 
        'Startup', 
        'Public', 
        'Private', 
        'Non-profit'
      ] 
    },
    { 
      label: 'Remote', 
      options: [
        'On-site', 
        'Remote', 
        'Hybrid'
      ] 
    },
    { 
      label: 'Salary range', 
      options: [
        '1000-5000',
        '5000-10000',
        '10000+',
      ] 
    }
  ];

  return (
    <header className="w-full border-y bg-white border-b-gray-600 border-t-gray-300 flex items-center justify-center px-4 py-3 fixed top-14 left-0 z-10">
      <nav className="w-full max-w-7xl px-4 sm:px-6 lg:px-18">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MdMenu size={24} />
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center bg-green-800 text-white px-4 py-2.5 rounded-full text-base">
              <span>Jobs</span>
            </div>
            
            {/* Vertical Line */}
            <div className="h-6 border-l border-gray-300 mx-2"></div>

            <div className="flex items-center gap-3 overflow-x-auto">
              {filterOptions.map((filter) => (
                <Popover 
                  key={filter.label}
                  open={activePopover === filter.label}
                  onOpenChange={(open) => 
                    setActivePopover(open ? filter.label : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center px-4 py-2.5 border border-gray-300 rounded-full text-base 
                                 hover:bg-gray-100 whitespace-nowrap"
                    >
                      {filter.label}
                      <MdArrowDropDown size={24} className="ml-2 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-56 p-2 bg-white border rounded-lg shadow-lg"
                  >
                    <div className="flex flex-col">
                      {filter.options.map((option) => (
                        <Button
                          key={option}
                          variant="ghost"
                          className="justify-start px-3 py-2 hover:bg-gray-100 w-full text-left"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg lg:hidden">
              <div className="flex flex-col items-start p-4 space-y-2">
                <div className="flex items-center bg-green-800 text-white px-4 py-2.5 rounded-full text-base mb-2">
                  <span>Jobs</span>
                </div>
                
                {filterOptions.map((filter) => (
                  <Popover key={filter.label}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center px-4 py-2.5 border border-gray-300 rounded-full text-base 
                                   hover:bg-gray-100 w-full justify-between"
                      >
                        {filter.label}
                        <MdArrowDropDown size={24} className="ml-2 text-gray-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-full p-2 bg-white border rounded-lg shadow-lg"
                    >
                      <div className="flex flex-col">
                        {filter.options.map((option) => (
                          <Button
                            key={option}
                            variant="ghost"
                            className="justify-start px-3 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default JobFilterBar;