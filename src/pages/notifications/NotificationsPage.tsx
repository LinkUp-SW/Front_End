import React, { useState, useEffect } from 'react';
import styles from './notifications.module.css';
import { ProfileCard, WithNavBar } from '../../components';

import notificationPicture from "../../assets/notificationpicture.jpeg"; 
import notificationPicture2 from "../../assets/notificationpicture2.jpeg"; 
import { getNotifications, filterNotificationsByTab, setupClickOutsideListener, handleTabChange, handlePostFilterSelection, togglePostDropdown } from '@/endpoints/notifications';
import { Notification, PostFilter } from '../../types';

// Define tab types for notification filtering
export type Tab = 'all' | 'jobs' | 'posts' | 'mentions';

const NotificationsPage: React.FC = () => {
  // State for active tab and notifications
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // State for post dropdown
  const [showPostDropdown, setShowPostDropdown] = useState<boolean>(false);
  const [activePostFilter, setActivePostFilter] = useState<PostFilter>('all');



  // Fetch notifications data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications('hfhfhfh');
        setNotifications(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to empty array if API call fails instead of MOCK_NOTIFICATIONS
        setNotifications([]);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const cleanup = setupClickOutsideListener(
      `.${styles.postsTabContainer}`,
      `.${styles.dropdownArrow}`,
      setShowPostDropdown
    );
    
    return cleanup;
  }, []);

  // Filtered notifications based on active tab
  const filteredNotifications = filterNotificationsByTab(notifications, activeTab, activePostFilter);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* Left Profile Section - Using ProfileCard component */}
        <div className={styles.leftSidebar}>
          <ProfileCard   />
          <div className={styles.notificationSettings}>
            <h3>Manage your notifications</h3>
            <a href="#" className={styles.settingsLink}>View settings</a>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContentWrapper}>
          {/* Standalone Tab Navigation */}
          <div className={styles.standaloneTabContainer}>
            <button 
              type="button" 
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`} 
              onClick={() => handleTabChange('all', setActiveTab, setShowPostDropdown)}>All
            </button>
            <button 
              type="button" 
              className={`${styles.tabButton} ${activeTab === 'jobs' ? styles.activeTab : ''}`} 
              onClick={() => handleTabChange('jobs', setActiveTab, setShowPostDropdown)}>Jobs
            </button>
            
            {/* Posts Tab with Dropdown */}
            <div className={styles.postsTabContainer}>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`} 
                onClick={() => handleTabChange('posts', setActiveTab, setShowPostDropdown)}>My posts <span className={styles.dropdownArrow} onClick={(e) => togglePostDropdown(e, showPostDropdown, setShowPostDropdown)}>▼</span>
              </button>
              
              {/* Post Filter Dropdown */}
              {showPostDropdown && (
                <div className={styles.postDropdown}>
                  <div className={styles.dropdownHeader}>
                    Filter post activity
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'all' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('all', setActivePostFilter, setShowPostDropdown)}>All
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'comments' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('comments', setActivePostFilter, setShowPostDropdown)}>Comments
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'reactions' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('reactions', setActivePostFilter, setShowPostDropdown)} >Reactions
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'reposts' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('reposts', setActivePostFilter, setShowPostDropdown)}>Reposts
                  </div>
                </div>
              )}
            </div>
            <button 
              type="button" 
              className={`${styles.tabButton} ${activeTab === 'mentions' ? styles.activeTab : ''}`} 
              onClick={() => handleTabChange('mentions', setActiveTab, setShowPostDropdown)}>Mentions
            </button>
          </div>

          {/* Content Box */}
          <div className={styles.mainContent}>
            {/* Notification List */}
            <div className={styles.notificationsList}>
              {loading ? (
                <div className={styles.loading}>Loading notifications...</div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <div key={notification.id} className={styles.notificationItem}>
                    <div className={styles.notificationIndicator}></div>
                    <div className={styles.notificationImage}>
                      <img src={notification.profileImg || "/api/placeholder/50/50"} alt="Notification" />
                    </div>
                    <div className={styles.notificationContent}>
                      <p dangerouslySetInnerHTML={{ __html: notification.content }}></p>
                      {notification.action && (
                        <a href={notification.actionLink || "#"} className={styles.actionButton}>
                          {notification.action}
                        </a>
                      )}
                    </div>
                    <div className={styles.notificationTime}>
                      {notification.time}
                    </div>
                    <div className={styles.notificationOptions}>
                      <button type="button" aria-label="More options">...</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateImage}>
                    <img src={notificationPicture2} alt="No notifications" />
                  </div>
                  {activeTab === 'posts' && (
                    <>
                      <h3 className={styles.emptyStateTitle}>No new post activities</h3>
                      <p className={styles.emptyStateDescription}>
                        View your previous post activity on your profile
                      </p>
                      <a href="#" className={styles.emptyStateAction}>
                        View previous activity
                      </a>
                    </>
                  )}
                  {activeTab === 'mentions' && (
                    <>
                      <h3 className={styles.emptyStateTitle}>No new mentions</h3>
                      <p className={styles.emptyStateDescription}>
                        When someone tags you in a post or comment, that notification will appear here.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* to be implemented*/}
        {/* Right Sidebar */}
        <div className={styles.rightSidebar}>
          <div className={styles.adContainer}>
            <div className={styles.hiringAd}>
              <img src={notificationPicture} alt="LinkedIn hiring" />
            </div>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkRow}>
              <a href="#">About</a>
              <a href="#">Accessibility</a>
              <a href="#">Help Center</a>
            </div>
            <div className={styles.linkRow}>
              <a href="#">Privacy & Terms</a>
              <a href="#">Ad Choices</a>
            </div>
            <div className={styles.linkRow}>
              <a href="#">Advertising</a>
              <a href="#">Business Services</a>
            </div>
            <div className={styles.linkRow}>
              <a href="#">Get the LinkedIn app</a>
              <a href="#">More</a>
            </div>
            <div className={styles.copyright}>
              <span className={styles.linkedInLogo}>Link UP</span> Link Up Corporation © 2025
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WithNavBar(NotificationsPage);