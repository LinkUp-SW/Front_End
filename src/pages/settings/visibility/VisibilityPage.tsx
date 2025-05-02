import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import { FaArrowRight } from 'react-icons/fa';

const VisibilityPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToBlocking = () => {
    navigate('/settings/visibility/blocking');
  };

  return (
    <SettingsLayoutPage>
      <div className="py-10 px-4 m-0">
        <div className="w-full max-w-[790px] mx-auto rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden p-0 bg-white dark:bg-gray-800 border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
          <h2 className="py-4 px-6 m-0 text-xl font-semibold text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
            Visibility of your profile and network
          </h2>
          
          <div 
            className="flex justify-between items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)] last:border-b-0 transition-colors duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.12)]  cursor-pointer"
            onClick={handleNavigateToBlocking}
          >
            <span className="text-base text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
              Blocking
            </span>
            <div className="flex items-center justify-center text-[#0891b2] dark:text-[#1d4ed8] w-8 h-8 rounded-full transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]">
              <FaArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default VisibilityPage;
