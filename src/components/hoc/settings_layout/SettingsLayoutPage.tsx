import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './settingsLayoutPage.module.css';

// Icons 
import { FaUser, FaLock, FaEye, FaShieldAlt, FaBullhorn, FaBell } from 'react-icons/fa';

const SETTING_MENU_ITEMS = [
  { id: 'account', icon: <FaUser />, label: 'Account preferences' },
  { id: 'security', icon: <FaLock />, label: 'Sign in & security' },
  { id: 'visibility', icon: <FaEye />, label: 'Visibility' },
  { id: 'privacy', icon: <FaShieldAlt />, label: 'Data privacy' },
  { id: 'advertising', icon: <FaBullhorn />, label: 'Advertising data' },
  { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
];

const PROFILE_SETTINGS = [
  { id: 'name-location', label: 'Name, location, and industry', hasArrow: true },
  { id: 'demographic', label: 'Personal demographic information', hasArrow: true },
  { id: 'verifications', label: 'Verifications', hasArrow: true },
];

const DISPLAY_SETTINGS = [
  { id: 'dark-mode', label: 'Dark mode', hasArrow: true },
];

const GENERAL_SETTINGS = [
  { id: 'language', label: 'Language', hasArrow: true },
  { id: 'content-language', label: 'Content language', hasArrow: true },
  { id: 'autoplay', label: 'Autoplay videos', hasToggle: true, defaultToggle: true },
  { id: 'sound-effects', label: 'Sound effects', hasToggle: true, defaultToggle: true },
  { id: 'profile-photos', label: 'Showing profile photos', hasArrow: true, value: 'All LinkedIn members' },
];

const SettingsLayoutPage: React.FC = () => {
  const [activeSettings, setActiveSettings] = useState<string>('account');
  const [toggleStates, setToggleStates] = useState({
    'autoplay': true,
    'sound-effects': true,
  });

  const handleMenuClick = (id: string) => {
    setActiveSettings(id);
  };

  const handleToggleChange = (id: string) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }));
  };

  return (
    <div className={styles.settingsLayout}>
      {/* LinkedIn Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img 
              src="/src/assets/link_up.png" 
              alt="LinkUp" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/100x34?text=LinkedIn+Logo';
              }}
            />
          </Link>
        </div>
        <div className={styles.profileImage}>
          <img 
            src="/profile-image.png" 
            alt="Profile" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/30x30?text=P';
            }}
          />
        </div>
      </header>

      <div className={styles.settingsContainer}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img 
                src="/profile-image.png" 
                alt="User" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/40x40?text=U';
                }}
              />
            </div>
            <h2 className={styles.settingsTitle}>Settings</h2>
          </div>

          <nav className={styles.navigation}>
            <ul className={styles.menuList}>
              {SETTING_MENU_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className={`${styles.menuItem} ${activeSettings === item.id ? styles.active : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Profile Information Section */}
          <section className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Profile information</h3>
            <div className={styles.settingsList}>
              {PROFILE_SETTINGS.map((setting) => (
                <div key={setting.id} className={styles.settingItem}>
                  <div className={styles.settingLabel}>{setting.label}</div>
                  {setting.hasArrow && <div className={styles.settingArrow}>→</div>}
                </div>
              ))}
            </div>
          </section>

          {/* Display Section */}
          <section className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Display</h3>
            <div className={styles.settingsList}>
              {DISPLAY_SETTINGS.map((setting) => (
                <div key={setting.id} className={styles.settingItem}>
                  <div className={styles.settingLabel}>{setting.label}</div>
                  {setting.hasArrow && <div className={styles.settingArrow}>→</div>}
                </div>
              ))}
            </div>
          </section>

          {/* General Preferences Section */}
          <section className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>General preferences</h3>
            <div className={styles.settingsList}>
              {GENERAL_SETTINGS.map((setting) => (
                <div key={setting.id} className={styles.settingItem}>
                  <div className={styles.settingLabel}>{setting.label}</div>
                  {setting.value && <div className={styles.settingValue}>{setting.value}</div>}
                  {setting.hasToggle && (
                    <div className={styles.settingToggle}>
                      <button 
                        className={`${styles.toggle} ${toggleStates[setting.id as keyof typeof toggleStates] ? styles.toggleOn : ''}`}
                        onClick={() => handleToggleChange(setting.id)}
                      >
                        <span className={styles.toggleText}>
                          {toggleStates[setting.id as keyof typeof toggleStates] ? 'On' : 'Off'}
                        </span>
                      </button>
                    </div>
                  )}
                  {setting.hasArrow && <div className={styles.settingArrow}>→</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayoutPage;