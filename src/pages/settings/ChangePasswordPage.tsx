import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import SettingsLayoutPage from '../../components/hoc/SettingsLayoutPage';
import styles from './changePasswordPage.module.css';
import { validatePassword } from '../../utils';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: ''
  });
  
  // Validate form on input changes
  useEffect(() => {
    const newErrors = {
      currentPassword: '', // Changed this line to remove the error message
      newPassword: newPassword ? validatePassword(newPassword) || '' : '',
      retypePassword: newPassword !== retypePassword && retypePassword ? 'Passwords don\'t match' : ''
    };
    
    setErrors(newErrors);
    
    // Check if form is valid
    if (
      currentPassword && 
      newPassword && 
      !validatePassword(newPassword) &&
      retypePassword && 
      newPassword === retypePassword
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentPassword, newPassword, retypePassword]);

  const handleBack = () => {
    navigate('/settings/sign-in-security');
  };

  const handleSavePassword = () => {
    // Here you would implement password validation and update logic
    console.log('Password changed');
    navigate('/settings/sign-in-security');
  };

  const handleForgotPassword = () => {
    // Implement forgot password flow
    console.log('Forgot password clicked');
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'retype':
        setShowRetypePassword(!showRetypePassword);
        break;
      default:
        break;
    }
  };

  return (
    <SettingsLayoutPage>
      <div className={styles.changePasswordContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          
          <h1 className={styles.title}>Change password</h1>
          <p className={styles.subtitle}>Create a new password that is at least 8 characters long.</p>
          
          <div className={styles.passwordInfoSection}>
            <button 
              className={styles.passwordInfoButton} 
              onClick={() => setShowPasswordInfo(!showPasswordInfo)}
            >
              <FaInfoCircle className={styles.infoIcon} />
              <span>What makes a strong password?</span>
            </button>
            
            {showPasswordInfo && (
              <div className={styles.passwordInfoBox}>
                <div className={styles.passwordInfoHeader}>
                  <h3>Choose a strong password to protect your account</h3>
                  <button 
                    className={styles.closeButton} 
                    onClick={() => setShowPasswordInfo(false)}
                  >
                    ×
                  </button>
                </div>
                <ul className={styles.passwordRules}>
                  <li>It should be at least 8 characters long</li>
                  <li>It should contain at least one uppercase letter</li>
                  <li>It should contain at least one lowercase letter</li>
                  <li>It should contain at least one digit</li>
                  <li>It should contain at least one special character</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="current-password">
              Type your current password <span className={styles.requiredAsterisk}>*</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input 
                id="current-password"
                type={showCurrentPassword ? "text" : "password"} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.passwordInput}
              />
              <button 
                type="button" 
                className={styles.showPasswordButton}
                onClick={() => togglePasswordVisibility('current')}
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.currentPassword && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}></span> {errors.currentPassword}
              </div>
            )}
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="new-password">
              Type your new password <span className={styles.requiredAsterisk}>*</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input 
                id="new-password"
                type={showNewPassword ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.passwordInput}
              />
              <button 
                type="button" 
                className={styles.showPasswordButton}
                onClick={() => togglePasswordVisibility('new')}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.newPassword && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}></span> {errors.newPassword}
              </div>
            )}
            <div className={styles.charCount}>
              {newPassword.length}/200
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="retype-password">
              Retype your new password <span className={styles.requiredAsterisk}>*</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input 
                id="retype-password"
                type={showRetypePassword ? "text" : "password"} 
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className={styles.passwordInput}
              />
              <button 
                type="button" 
                className={styles.showPasswordButton}
                onClick={() => togglePasswordVisibility('retype')}
              >
                {showRetypePassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.retypePassword && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}></span> {errors.retypePassword}
              </div>
            )}
            <div className={styles.charCount}>
              {retypePassword.length}/200
            </div>
          </div>
          
          
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.saveButton} ${isFormValid ? styles.saveButtonActive : ''}`} 
              onClick={handleSavePassword}
              disabled={!isFormValid}
            >
              Save Password
            </button>
            
            <button 
              className={styles.forgotPasswordButton} 
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default ChangePasswordPage;