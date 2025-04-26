import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';

const OtherOptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');

  const handleNext = () => {
    navigate('/settings/close-account/confirm');
  };

  return (
    <SettingsLayoutPage>
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6 w-[800px] mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-transparent border-0 text-[#666666] cursor-pointer text-sm p-0 mb-4 flex items-center hover:text-[#0891b2]"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold m-0 text-black">
            Close account
          </h1>
          <p className="text-base text-[#666666] mt-2 mb-0">
            Please provide a little more information to help us improve
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-[#666666] mb-2">
            Reason for closing account
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="w-full p-3 border border-[#dddddd] rounded resize-y font-inherit text-sm mt-2 focus:outline-none focus:border-[#0891b2]"
            />
          </label>

          <button 
            onClick={handleNext} 
            className="bg-[#0891b2] text-white border-0 rounded-[25px] px-6 py-3 text-base font-medium cursor-pointer transition-colors duration-200 mt-6 hover:bg-[#067a99]"
          >
            Next
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default OtherOptionPage;