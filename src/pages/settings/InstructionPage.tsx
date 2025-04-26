import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './instructionPage.module.css';

const InstructionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/settings/close-account/reason');
  };

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
          <p className={styles.message}>
            Are you sure you want to close your account? You'll lose your connections, messages, endorsements, and
            recommendations.
          </p>

          <button onClick={handleContinue} className={styles.continueButton}>
            Continue
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default InstructionPage;