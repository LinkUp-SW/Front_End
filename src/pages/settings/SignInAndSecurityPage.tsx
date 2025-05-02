import React from 'react';
import { Link } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import { FaArrowRight } from 'react-icons/fa';

const SignInAndSecurityPage: React.FC = () => {
  return (
    <SettingsLayoutPage>
      <div className="py-10 px-4 m-0">
        <div className="w-full max-w-[790px] mx-auto bg-white dark:bg-[#111827] rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] overflow-hidden p-0">
          <h2 className="py-4 px-6 m-0 text-xl font-semibold text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
            Account access
          </h2>
          <div className="flex flex-col">
            <div className="flex justify-between items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] transition-colors duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.12)]">
              <div className="flex flex-col gap-1">
                <span className="text-base font-medium text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
                  Email addresses
                </span>
              </div>
              <Link 
                to="/settings/security/email" 
                className="flex items-center justify-center text-[#0891b2] w-8 h-8 rounded-full transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)]"
              >
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex justify-between items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] last:border-b-0 transition-colors duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.12)]">
              <div className="flex flex-col gap-1">
                <span className="text-base font-medium text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
                  Change password
                </span>
              </div>
              <Link 
                to="/settings/security/changepassword" 
                className="flex items-center justify-center text-[#0891b2] w-8 h-8 rounded-full transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)]"
              >
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default SignInAndSecurityPage;