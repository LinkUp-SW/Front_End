import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import styles from './primaryEmailPage.module.css';
import { getCurrentEmail } from '@/endpoints/settingsEndpoints';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const PrimaryEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const token = Cookies.get('linkup_auth_token');
        if (!token) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }

        const response = await getCurrentEmail(token);
        setCurrentEmail(response.email);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentEmail();
  }, [navigate]);

  const handleBack = () => {
    navigate('/settings/security');
  };
  
  const handleAddEmail = () => {
    navigate('/settings/security/email/verify');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SettingsLayoutPage>
      <div className={styles.emailContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <h2 className={styles.title}>Email address</h2>
        </div>
        
        <div className={styles.emailSection}>
          <h3 className={styles.sectionTitle}>Your current email</h3>
          <p className={styles.emailText}>{currentEmail}</p>
          
          <button 
            className={styles.addEmailButton} 
            onClick={handleAddEmail}
          >
            Change email address
          </button>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default PrimaryEmailPage;