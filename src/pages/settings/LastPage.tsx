import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';

const LastPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleDone = () => {
    // Here you would typically implement the actual account closing logic
    // After successful closure, you might redirect to a logout page or confirmation page
    console.log('Account closing initiated');
    // navigate('/logout'); // Example redirection
  };

  return (
    <SettingsLayoutPage>
      <div className="bg-white dark:bg-[#111827] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.1)] p-6 w-[800px] mx-auto">
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
            Enter your password to close this account
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-[#666666] dark:text-[rgba(255,255,255,0.6)] mb-2">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#dddddd] dark:border-[rgba(255,255,255,0.12)] rounded bg-[#f9f9f9] dark:bg-[#1F2937] font-inherit text-sm mt-2 focus:outline-none focus:border-[#0891b2] text-black dark:text-[rgba(255,255,255,0.87)]"
            />
          </label>

          <button 
            onClick={handleDone} 
            disabled={!password}
            className="bg-[#0891b2] text-white border-0 rounded-[25px] px-6 py-3 text-base font-medium cursor-pointer transition-colors duration-200 mt-6 hover:bg-[#067a99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Done
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default LastPage;