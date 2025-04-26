import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './otherOptionPage.module.css';

const OtherOptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');

  const handleNext = () => {
    navigate('/settings/close-account/confirm');
  };

  return (
    <SettingsLayoutPage>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Back
          </button>
          <h1 className={styles.title}>Close account</h1>
          <p className={styles.subtitle}>Please provide a little more information to help us improve</p>
        </div>

        <div className={styles.content}>
          <label className={styles.textareaLabel}>
            Reason for closing account
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.textarea}
              rows={6}
            />
          </label>

          <button 
            onClick={handleNext} 
            className={styles.nextButton}
          >
            Next
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default OtherOptionPage;