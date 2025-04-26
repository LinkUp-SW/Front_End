import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';

const ReasonPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleNext = () => {
    if (selectedReason === 'Other') {
      navigate('/settings/close-account/other-option');
    } else if (selectedReason) {
      navigate('/settings/close-account/confirm');
    }
  };

  const reasons = [
    'I have a duplicate account',
    'I\'m getting too many emails',
    'I\'m not getting any value from my membership',
    'I have a privacy concern',
    'I\'m receiving unwanted contact',
    'Other'
  ];

  return (
    <SettingsLayoutPage>
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6 mx-auto w-[800px]">
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
            Malak, we're sorry to see you go
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-[#333333] mb-4">
            Tell us the reason for closing your account:
          </p>

          <div className="flex flex-col gap-4 mb-6">
            {reasons.map((reason) => (
              <label key={reason} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="closeReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => handleReasonChange(reason)}
                  className="mr-3 cursor-pointer"
                />
                <span className="text-sm text-[#333333]">{reason}</span>
              </label>
            ))}
          </div>

          <button 
            onClick={handleNext} 
            disabled={!selectedReason}
            className="bg-[#0891b2] text-white border-0 rounded-[25px] px-6 py-3 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-[#067a99] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default ReasonPage;