import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import { getCurrentEmail } from '@/endpoints/settingsEndpoints';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getErrorMessage } from '@/utils/errorHandler';

const PrimaryEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const token = Cookies.get('linkup_auth_token');
        if (!token) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }

        const response = await getCurrentEmail(token);
        setCurrentEmail(response.email);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentEmail();
  }, [navigate]);

  const handleBack = () => {
    navigate('/settings/security');
  };

  const handleAddEmail = () => {
    navigate('/settings/security/email/add');
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">Loading...</div>;
  }

  return (
    <SettingsLayoutPage>
      <div className="max-w-[700px] w-full mx-auto p-6 bg-white dark:bg-[#111827] rounded-lg">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="bg-transparent border-none text-[#0891b2] text-base font-semibold cursor-pointer py-2 flex items-center mb-4 hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold mb-2 text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
            Email address
          </h2>
        </div>

        <div className="border-t pt-5 border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
          <h3 className="text-base font-semibold mb-3 text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
            Your current email
          </h3>
          <p className="text-sm mb-6 text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
            {currentEmail}
          </p>

          <button
            onClick={handleAddEmail}
            className="border border-[#0891b2] bg-white dark:bg-[#111827] text-[#0891b2] px-4 py-2 rounded-full text-sm font-semibold transition hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]"
          >
            Change email address
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default PrimaryEmailPage;
