import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import SettingsLayoutPage from '../../components/hoc/SettingsLayoutPage';
import { validatePassword } from '../../utils';
import { changePassword } from '@/endpoints/changePassword';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: ''
  });

  useEffect(() => {
    const newErrors = {
      currentPassword: '',
      newPassword: newPassword ? validatePassword(newPassword) || '' : '',
      retypePassword: newPassword !== retypePassword && retypePassword ? 'Passwords don\'t match' : ''
    };
    
    setErrors(newErrors);
    
    if (
      currentPassword && 
      newPassword && 
      !validatePassword(newPassword) &&
      retypePassword && 
      newPassword === retypePassword
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentPassword, newPassword, retypePassword]);

  const handleBack = () => {
    navigate('/settings/sign-in-security');
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'retype':
        setShowRetypePassword(!showRetypePassword);
        break;
    }
  };

  const handleSavePassword = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setStatusMessage('');
    
    try {
      const response = await changePassword(currentPassword, newPassword);
      
      if (response.success) {
        setStatusMessage('Password changed successfully');
        setTimeout(() => {
          navigate('/settings/sign-in-security');
        }, 1500);
      } else {
        setStatusMessage(response.message || 'Failed to change password');
      }
    } catch (error) {
      setStatusMessage('An error occurred. Please try again later.');
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <SettingsLayoutPage>
      <div className="flex flex-col w-full max-w-[800px] mx-auto p-5">
        <div className="mb-[30px]">
          <button 
            onClick={handleBack}
            className="flex items-center bg-transparent border-0 text-[#0891b2] text-sm font-semibold p-0 mb-4 cursor-pointer"
          >
            ← Back
          </button>
          
          <h1 className="text-2xl font-semibold m-0 mb-2 text-[rgba(0,0,0,0.9)]">
            Change password
          </h1>
          <p className="text-sm text-[rgba(0,0,0,0.6)] m-0 mb-5">
            Create a new password that is at least 8 characters long.
          </p>
          
          <div className="relative mb-6">
            <button 
              onClick={() => setShowPasswordInfo(!showPasswordInfo)}
              className="flex items-center bg-transparent border-0 text-[#0891b2] px-3 py-2 rounded-2xl bg-[rgba(10,102,194,0.08)] cursor-pointer text-sm"
            >
              <FaInfoCircle className="mr-2 text-base" />
              <span>What makes a strong password?</span>
            </button>
            
            {showPasswordInfo && (
              <div className="absolute top-full left-0 w-[300px] bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] mt-2 z-[100] border border-[#e0e0e0]">
                <div className="flex justify-between items-start p-4 pb-2 border-b border-[#e0e0e0]">
                  <h3 className="text-base m-0 font-semibold text-[rgba(0,0,0,0.9)] max-w-[85%]">
                    Choose a strong password to protect your account
                  </h3>
                  <button 
                    onClick={() => setShowPasswordInfo(false)}
                    className="bg-transparent border-0 text-xl cursor-pointer text-[rgba(0,0,0,0.6)] p-0"
                  >
                    ×
                  </button>
                </div>
                <ul className="list-none p-4 m-0">
                  {[
                    'It should be at least 8 characters long',
                    'It should contain at least one uppercase letter',
                    'It should contain at least one lowercase letter',
                    'It should contain at least one digit',
                    'It should contain at least one special character'
                  ].map((rule, index) => (
                    <li key={index} className="relative py-2 text-sm text-[rgba(0,0,0,0.9)] border-b border-[#f3f3f3] last:border-b-0">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-5">
          {/* Current Password Input */}
          <div className="flex flex-col relative mb-2">
            <label htmlFor="current-password" className="text-sm text-[rgba(0,0,0,0.8)] mb-2">
              Type your current password <span className="text-[#d11124]">*</span>
            </label>
            <div className="flex border border-[#ddd] rounded overflow-hidden">
              <input 
                id="current-password"
                type={showCurrentPassword ? "text" : "password"} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1 p-3 border-0 outline-none text-base text-black"
              />
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility('current')}
                className="bg-transparent border-0 px-4 text-[#0891b2] font-semibold cursor-pointer"
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="text-[#d11124] text-xs mt-1 flex items-center">
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password Input */}
          <div className="flex flex-col relative mb-2">
            <label htmlFor="new-password" className="text-sm text-[rgba(0,0,0,0.8)] mb-2">
              Type your new password <span className="text-[#d11124]">*</span>
            </label>
            <div className="flex border border-[#ddd] rounded overflow-hidden">
              <input 
                id="new-password"
                type={showNewPassword ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 p-3 border-0 outline-none text-base text-black"
              />
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility('new')}
                className="bg-transparent border-0 px-4 text-[#0891b2] font-semibold cursor-pointer"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.newPassword && (
              <div className="text-[#d11124] text-xs mt-1 flex items-center">
                {errors.newPassword}
              </div>
            )}
            <div className="absolute right-2 -bottom-5 text-xs text-[rgba(0,0,0,0.6)]">
              {newPassword.length}/200
            </div>
          </div>

          {/* Retype Password Input */}
          <div className="flex flex-col relative mb-2">
            <label htmlFor="retype-password" className="text-sm text-[rgba(0,0,0,0.8)] mb-2">
              Retype your new password <span className="text-[#d11124]">*</span>
            </label>
            <div className="flex border border-[#ddd] rounded overflow-hidden">
              <input 
                id="retype-password"
                type={showRetypePassword ? "text" : "password"} 
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="flex-1 p-3 border-0 outline-none text-base text-black"
              />
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility('retype')}
                className="bg-transparent border-0 px-4 text-[#0891b2] font-semibold cursor-pointer"
              >
                {showRetypePassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.retypePassword && (
              <div className="text-[#d11124] text-xs mt-1 flex items-center">
                {errors.retypePassword}
              </div>
            )}
            <div className="absolute right-2 -bottom-5 text-xs text-[rgba(0,0,0,0.6)]">
              {retypePassword.length}/200
            </div>
          </div>
          
          {statusMessage && (
            <div className={`text-xs mt-1 ${statusMessage.includes('success') ? 'text-green-600' : 'text-[#d11124]'}`}>
              {statusMessage}
            </div>
          )}
          
          <div className="flex flex-col gap-4 mt-5">
            <button 
              onClick={handleSavePassword}
              disabled={!isFormValid || isLoading}
              className={`py-2 w-[140px] border-0 rounded-[20px] font-semibold cursor-pointer text-base transition-all duration-200 
                ${isFormValid ? 'bg-[#0891b2] text-white' : 'bg-[#f3f2ef] text-[rgba(0,0,0,0.4)]'}`}
            >
              {isLoading ? 'Processing...' : 'Save Password'}
            </button>
            
            <button 
              onClick={handleForgotPassword}
              className="bg-transparent border-0 text-[#0891b2] cursor-pointer text-base text-left p-0 w-fit mb-4"
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default ChangePasswordPage;