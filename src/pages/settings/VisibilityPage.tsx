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
        <div className="w-full max-w-[790px] mx-auto bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden p-0">
          <h2 className="py-4 px-6 m-0 text-xl font-semibold text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.08)]">
            Visibility of your profile and network
          </h2>
          
          <div 
            className="flex justify-between items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)] last:border-b-0 transition-colors duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.03)] cursor-pointer"
            onClick={handleNavigateToBlocking}
          >
            <span className="text-base text-[rgba(0,0,0,0.9)]">
              Blocking
            </span>
            <div className="flex items-center justify-center text-[#0891b2] w-8 h-8 rounded-full transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)]">
              <FaArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default VisibilityPage;