import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import { sendEmailVerificationOTP, verifyEmailOTP, getCurrentEmail } from '@/endpoints/settingsEndpoints';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getErrorMessage } from '@/utils/errorHandler';

const OTP: React.FC = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = Cookies.get('linkup_auth_token');
        if (!token) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }

        const response = await getCurrentEmail(token);
        setUserEmail(response.email);
        await sendEmailVerificationOTP(response.email);
      } catch (error) {
        toast.error(getErrorMessage(error));
        navigate('/settings/security/email');
      }
    };

    fetchEmail();
  }, [navigate]);

  const handleBack = () => {
    navigate('/settings/security/email');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await verifyEmailOTP(verificationCode, userEmail, true);
      toast.success('Email verified successfully');
      navigate('/settings/security/email/add');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsLayoutPage>
      <div className="max-w-[700px] w-full mx-auto p-6 bg-white dark:bg-[#111827] rounded-lg text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] transition-colors duration-300">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="bg-transparent border-none text-[#0a66c2] text-base font-semibold cursor-pointer py-2 flex items-center mb-4 hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold mb-2">Email addresses</h2>
          <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            We sent a code to your email
          </p>
        </div>

        <div className="pt-5">
          <p className="text-sm mb-4">
            Enter the verification code sent to {userEmail}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              className="w-full max-w-sm px-4 py-3 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] rounded text-base bg-white dark:bg-[#111827] text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
              placeholder="Enter the PIN"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />

            <button
              type="submit"
              className={`rounded-full px-6 py-2 text-sm font-medium text-white transition ${
                verificationCode.length === 6 && !isSubmitting
                  ? 'bg-[#0a66c2] hover:bg-[#0e7490]'
                  : 'bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.12)] cursor-not-allowed'
              }`}
              disabled={verificationCode.length !== 6 || isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </button>
          </form>

          <p className="text-xs mt-4 text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            If you don't see the email in your inbox, check your spam folder.
          </p>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default OTP;
