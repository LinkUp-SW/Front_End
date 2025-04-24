import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './addEmailPage.module.css';

const AddEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleBack = () => {
    navigate('/settings/security/email');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the new email to the server
    console.log('Adding new email:', newEmail);
    // After successful addition, redirect back to the email page
    navigate('/settings/security/email');
  };

  const isFormValid = newEmail && password;

  return (
    <SettingsLayoutPage>
      <div className={styles.addEmailContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          
          <h2 className={styles.title}>Email addresses</h2>
          <p className={styles.subtitle}>Add a new email</p>
        </div>
        
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="newEmail" className={styles.inputLabel}>
                Enter new email address
              </label>
              <input
                id="newEmail"
                type="email"
                className={styles.emailInput}
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <p className={styles.inputHelperText}>
                A confirmation will be sent to this account. Click on the confirmation link to verify and add this email.
              </p>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                Enter your LinkUp password
              </label>
              <input
                id="password"
                type="password"
                className={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit"
              className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : ''}`}
              disabled={!isFormValid}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default AddEmailPage;