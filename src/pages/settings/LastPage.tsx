import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './lastPage.module.css';

const LastPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleDone = () => {
    // Here you would typically implement the actual account closing logic
    // After successful closure, you might redirect to a logout page or confirmation page
    console.log('Account closing initiated');
    // navigate('/logout'); // Example redirection
  };

  return (
    <SettingsLayoutPage>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Back
          </button>
          <h1 className={styles.title}>Close account</h1>
          <p className={styles.subtitle}>Enter your password to close this account</p>
        </div>

        <div className={styles.content}>
          <label className={styles.passwordLabel}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.passwordInput}
            />
          </label>

          <button 
            onClick={handleDone} 
            className={styles.doneButton}
            disabled={!password}
          >
            Done
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default LastPage;