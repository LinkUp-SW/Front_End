import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '../../components/hoc/SettingsLayoutPage';
import styles from './accountPreferencePage.module.css';

const AccountPreferencePage: React.FC = () => {
  const navigate = useNavigate();
  const handleDisplaySettings = () => {
    navigate('/settings/display');
  };

  const handleCloseAccount = () => {
    navigate('/settings/close-account');
  };

  return (
    <SettingsLayoutPage>
      <div className={styles.preferencesContent}>
        {/* Display Settings */}
        <div className={styles.preferencesSection}>
          <h2 className={styles.sectionTitle}>Display</h2>
          <div className={styles.optionItem}>
            <span>Dark mode</span>
            <button 
              className={styles.arrowButton}
              onClick={handleDisplaySettings}
              aria-label="Go to display settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={styles.arrowIcon}>
                <path d="M6 12l4-4-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className={styles.preferencesSection}>
          <h2 className={styles.sectionTitle}>Account management</h2>
          <div className={styles.optionItem}>
            <span>
              <span className={styles.highlightedText}>Close account</span>
            </span>
            <button 
              className={styles.arrowButton}
              onClick={handleCloseAccount}
              aria-label="Go to close account"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={styles.arrowIcon}>
                <path d="M6 12l4-4-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default AccountPreferencePage;