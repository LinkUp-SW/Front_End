import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';

const InstructionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/settings/close-account/reason');
  };

  return (
    <SettingsLayoutPage>
      <div className="bg-white dark:bg-[#111827] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.1)] p-6 max-w-[800px] mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-transparent border-0 text-[#666666] dark:text-[rgba(255,255,255,0.6)] cursor-pointer text-sm p-0 mb-4 flex items-center hover:text-[#0891b2] dark:hover:text-[#0891b2]"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold m-0 text-black dark:text-[rgba(255,255,255,0.87)]">
            Close account
          </h1>
          <p className="text-base text-[#666666] dark:text-[rgba(255,255,255,0.6)] mt-2 mb-0">
            We're sorry to see you go
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm leading-6 text-[#333333] dark:text-[rgba(255,255,255,0.87)] mb-6">
            Are you sure you want to close your account? You'll lose your connections, messages, endorsements, and
            recommendations.
          </p>

          <button 
            onClick={handleContinue} 
            className="bg-[#0891b2] text-white border-0 rounded-[25px] px-6 py-3 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-[#067a99]"
          >
            Continue
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default InstructionPage;