import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './reasonPage.module.css';

const ReasonPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleNext = () => {
    if (selectedReason === 'Other') {
      navigate('/settings/close-account/other-option');
    } else if (selectedReason) {
      navigate('/settings/close-account/confirm');
    }
  };

  const reasons = [
    'I have a duplicate account',
    'I\'m getting too many emails',
    'I\'m not getting any value from my membership',
    'I have a privacy concern',
    'I\'m receiving unwanted contact',
    'Other'
  ];

  return (
    <SettingsLayoutPage>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Back
          </button>
          <h1 className={styles.title}>Close account</h1>
          <p className={styles.subtitle}>Malak, we're sorry to see you go</p>
        </div>

        <div className={styles.content}>
          <p className={styles.label}>Tell us the reason for closing your account:</p>

          <div className={styles.radioGroup}>
            {reasons.map((reason) => (
              <label key={reason} className={styles.radioOption}>
                <input
                  type="radio"
                  name="closeReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => handleReasonChange(reason)}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>{reason}</span>
              </label>
            ))}
          </div>

          <button 
            onClick={handleNext} 
            className={styles.nextButton}
            disabled={!selectedReason}
          >
            Next
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default ReasonPage;