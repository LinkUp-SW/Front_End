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
          <h1 className={styles.sectionTitle}>Account access</h1>
          
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
            
            <div className={styles.accessItem}>
              <div className={styles.accessItemInfo}>
                <span className={styles.accessItemTitle}>Two-step verification</span>
                <span className={styles.accessItemStatus}>Off</span>
              </div>
              <Link to="/settings/two-factor" className={styles.accessItemAction}>
                <FaArrowRight />
              </Link>
            </div>
          </div>
          
          <div className={styles.footerLinks}>
            <Link to="/help-center" className={styles.footerLink}>Help Center</Link>
            <Link to="/policies" className={styles.footerLink}>Professional Community Policies</Link>
            <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link to="/accessibility" className={styles.footerLink}>Accessibility</Link>
            <Link to="/recommendation-transparency" className={styles.footerLink}>Recommendation Transparency</Link>
            <Link to="/user-agreement" className={styles.footerLink}>User Agreement</Link>
            <Link to="/license-agreement" className={styles.footerLink}>End User License Agreement</Link>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default SignInAndSecurityPage;