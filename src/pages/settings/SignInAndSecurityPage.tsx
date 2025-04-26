import React from 'react';
import { Link } from 'react-router-dom';
import SettingsLayoutPage from '../../components/hoc/SettingsLayoutPage';
import styles from './signInAndSecurityPage.module.css';
import { FaArrowRight } from 'react-icons/fa';

const SignInAndSecurityPage: React.FC = () => {
  return (
    <SettingsLayoutPage>
      <div className={styles.securityPageContainer}>
        <div className={styles.contentContainer}>
          <h2 className={styles.sectionTitle}>Account access</h2>
          <div className={styles.accessItemsList}>
            <div className={styles.accessItem}>
              <div className={styles.accessItemInfo}>
                <span className={styles.accessItemTitle}>Email addresses</span>
              </div>
              <Link to="/settings/email" className={styles.accessItemAction}>
                <FaArrowRight />
              </Link>
            </div>

            <div className={styles.accessItem}>
              <div className={styles.accessItemInfo}>
                <span className={styles.accessItemTitle}>Change password</span>
              </div>
              <Link to="/settings/security/changepassword" className={styles.accessItemAction}>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default SignInAndSecurityPage;