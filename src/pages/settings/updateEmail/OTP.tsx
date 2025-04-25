import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './OTP.module.css';
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
      await verifyEmailOTP(verificationCode, userEmail,true);
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
      <div className={styles.otpContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <h2 className={styles.title}>Email addresses</h2>
          <p className={styles.subtitle}>We sent a code to your email</p>
        </div>
        
        <div className={styles.verificationSection}>
          <p className={styles.instructionText}>
            Enter the verification code sent to {userEmail}
          </p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.otpInput}
              placeholder="Enter the PIN"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            
            <button 
              type="submit"
              className={styles.submitButton}
              disabled={verificationCode.length !== 6 || isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </button>
          </form>
          
          <p className={styles.helperText}>
            If you don't see the email in your inbox, check your spam folder.
          </p>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default OTP;