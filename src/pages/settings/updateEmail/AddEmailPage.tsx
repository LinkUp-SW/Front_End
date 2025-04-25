import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './addEmailPage.module.css';
import { updateEmail } from '@/endpoints/settingsEndpoints';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getErrorMessage } from '@/utils/errorHandler';

const AddEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleBack = () => {
    navigate('/settings/security/email');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get('linkup_auth_token');
      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      await updateEmail(token, newEmail, password);
      toast.success('Email updated successfully');
      navigate('/settings/security/email');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = newEmail && password;

  return (
    <SettingsLayoutPage>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <h2 className={styles.title}>Email addresses</h2>
          <p className={styles.subtitle}>Add a new email</p>
        </div>
        
        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="newEmail" className={styles.label}>
                Enter new email address
              </label>
              <input
                id="newEmail"
                type="email"
                className={styles.input}
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <p className={styles.helpText}>
                A confirmation will be sent to this account.
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Enter your LinkUp password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit"
              className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : ''}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default AddEmailPage;