import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '../../components/hoc/SettingsLayoutPage';

const AccountPreferencePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleDisplaySettings = () => {
    navigate('/settings/display');
  };

  const handleCloseAccount = () => {
    navigate('/settings/close-account');
  };

  return (
    <SettingsLayoutPage>
      {/* Equivalent to .preferencesContent */}
      <div className="w-full max-w-[800px] mx-auto py-10 px-4">
        {/* Display Settings */}
        {/* Equivalent to .preferencesSection */}
        <div className="bg-white rounded-lg mb-4 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Equivalent to .sectionTitle */}
          <h2 className="py-4 px-6 m-0 text-[18px] font-semibold text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.08)]">
            Display
          </h2>
          {/* Equivalent to .optionItem */}
          <div className="flex justify-between items-center py-4 px-6 min-h-[48px] text-base text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.08)] cursor-pointer hover:bg-[rgba(0,0,0,0.03)] last:border-b-0">
            <span>Dark mode</span>
            {/* Equivalent to .arrowButton */}
            <button 
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-2 text-[rgba(0,0,0,0.6)]"
              onClick={handleDisplaySettings}
              aria-label="Go to display settings"
            >
              {/* Equivalent to .arrowIcon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                className="w-4 h-4"
              >
                <path 
                  d="M6 12l4-4-4-4" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-lg mb-4 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
          <h2 className="py-4 px-6 m-0 text-[18px] font-semibold text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.08)]">
            Account management
          </h2>
          <div className="flex justify-between items-center py-4 px-6 min-h-[48px] text-base text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.08)] cursor-pointer hover:bg-[rgba(0,0,0,0.03)] last:border-b-0">
            {/* Equivalent to .highlightedText */}
            <span className="text-black font-normal">
              Close account
            </span>
            <button 
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-2 text-[rgba(0,0,0,0.6)]"
              onClick={handleCloseAccount}
              aria-label="Go to close account"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                className="w-4 h-4"
              >
                <path 
                  d="M6 12l4-4-4-4" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default AccountPreferencePage;