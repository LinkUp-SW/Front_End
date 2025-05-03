import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import { updateEmail } from '@/endpoints/settingsEndpoints';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getErrorMessage } from '@/utils/errorHandler';

const AddEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/settings/security/email');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      await updateEmail(token, newEmail, password);
      toast.success('Email updated successfully');
      navigate('/settings/security/email/verify');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = newEmail && password;

  return (
    <SettingsLayoutPage>
      <div className="max-w-[700px] w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg text-[rgba(0,0,0,0.9)] dark:text-white transition-colors duration-300">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="bg-transparent border-none text-[#0a66c2] dark:text-[#1d4ed8] text-base font-semibold flex items-center mb-4 px-0 py-2 cursor-pointer hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-semibold mb-2">Email addresses</h2>
          <p className="text-base text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)] mb-6">
            Add a new email
          </p>
        </div>

        <div className="py-6">
          <form onSubmit={handleSubmit} className="max-w-[500px]">
            {/* Email input */}
            <div className="mb-6">
              <label htmlFor="newEmail" className="block mb-2 font-medium text-[rgba(0,0,0,0.9)] dark:text-white">
                Enter new email address
              </label>
              <input
                id="newEmail"
                type="email"
                className="w-full p-3 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] rounded-md text-base bg-white dark:bg-gray-900 text-[rgba(0,0,0,0.9)] dark:text-white"
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <p className="mt-2 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                A confirmation will be sent to this account.
              </p>
            </div>

            {/* Password input */}
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-medium text-[rgba(0,0,0,0.9)] dark:text-white">
                Enter your LinkUp password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-3 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] rounded-md text-base bg-white dark:bg-gray-900 text-[rgba(0,0,0,0.9)] dark:text-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`bg-[#0a66c2] dark:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-md w-full transition-colors duration-200 hover:bg-[#0e7490] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Updating...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default AddEmailPage;
