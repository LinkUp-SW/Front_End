import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './primaryEmailPage.module.css';

const PrimaryEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = "malak.abdullrhman03@eng-st.cu.edu.eg"; 
  
  const handleBack = () => {
    navigate('/settings/security');
  };
  
  const handleAddEmail = () => {
    navigate('/settings/security/email/verify');
  };


  return (
    <SettingsLayoutPage>
      <div className={styles.emailContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          
          <h2 className={styles.title}>Email addresses</h2>
          <p className={styles.subtitle}>Emails you've added</p>
        </div>
        
        <div className={styles.emailSection}>
          <h3 className={styles.sectionTitle}>Primary email</h3>
          <p className={styles.emailText}>{userEmail}</p>
          
          <button 
            onClick={handleAddEmail}
            className={styles.addEmailButton}
          >
            Add email address
          </button>
          
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default PrimaryEmailPage;