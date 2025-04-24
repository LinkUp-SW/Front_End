import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './OTP.module.css';

const OTP: React.FC = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const userEmail = "malak.abdullrhman03@eng-st.cu.edu.eg"; // This would normally come from state or context
  
  const handleBack = () => {
    navigate('/settings/security/email');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would verify the OTP here
    navigate('/settings/security/email/add');
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
              disabled={verificationCode.length !== 6}
            >
              Submit
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