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
      <div className="w-full max-w-[800px] mx-auto py-10 px-4">
        {/* Display Settings Section */}
        <div className="bg-white dark:bg-[#111827] rounded-lg mb-4 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] overflow-hidden">
          <h2 className="py-4 px-6 m-0 text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
            Display
          </h2>
          <div
            className="flex justify-between items-center py-4 px-6 min-h-[48px] text-base text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]"
            onClick={handleDisplaySettings}
          >
            <span>Dark mode</span>
            <button
              className="flex items-center justify-center p-2 text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]"
              aria-label="Go to display settings"
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

        {/* Account Management Section */}
        <div className="bg-white dark:bg-[#111827] rounded-lg mb-4 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] overflow-hidden">
          <h2 className="py-4 px-6 m-0 text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
            Account management
          </h2>
          <div
            className="flex justify-between items-center py-4 px-6 min-h-[48px] text-base text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]"
            onClick={handleCloseAccount}
          >
            <span className="text-black dark:text-white font-normal">
              Close account
            </span>
            <button
              className="flex items-center justify-center p-2 text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]"
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
