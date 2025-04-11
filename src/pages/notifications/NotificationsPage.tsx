import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './notifications.module.css';
import { ProfileCard, WithNavBar, LinkUpFooter, WhosHiringImage } from '../../components';
import { RootState } from '../../store';
import notificationPicture2 from "../../assets/notificationpicture2.jpeg"; 
import { getNotifications, markNotificationAsRead } from '@/endpoints/notifications';
import { Notification } from '../../types';

// Define tab types for notification filtering
export type Tab = 'all' | 'jobs' | 'posts' | 'mentions';
export type PostFilter = 'all' | 'comments' | 'reactions';

// Extract the filterNotificationsByTab function and export it separately
export const filterNotificationsByTab = (
  notifications: Notification[], 
  activeTab: Tab, 
  activePostFilter?: PostFilter
): Notification[] => {
  switch (activeTab) {
    case 'jobs': {
      return notifications.filter(notification => 
        notification.type === 'job'
      );
    }

    case 'posts': {
      const postNotifications = notifications.filter(notification => 
        notification.type === 'post'
      );

      if (activePostFilter === 'comments') {
        return postNotifications.filter(n => 
          n.content.toLowerCase().includes('comment') || 
          n.content.toLowerCase().includes('replied')
        );
      }

      if (activePostFilter === 'reactions') {
        return postNotifications.filter(n => 
          n.content.toLowerCase().includes('liked') || 
          n.content.toLowerCase().includes('shared')
        );
      }

      return postNotifications;
    }

    case 'mentions': {
      return notifications.filter(notification => 
        notification.content.includes('@')
      );
    }

    default: {
      return notifications;
    }
  }
};


const NotificationsPage: React.FC = () => {
  // State for active tab and notifications
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for post dropdown
  const [showPostDropdown, setShowPostDropdown] = useState<boolean>(false);
  const [activePostFilter, setActivePostFilter] = useState<PostFilter>('all');

  // State for mobile responsiveness
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  // Get dark mode state from Redux
  const isDarkMode = useSelector((state: RootState) => state.theme.theme === 'dark');

  // Fetch notifications data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications('hfhfhfh');
        setNotifications(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Setup click outside listener for dropdowns
  const setupClickOutsideListener = (
    containerSelector: string,
    arrowSelector: string,
    setShowDropdown: (show: boolean) => void
  ): () => void => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(containerSelector) && 
          !target.closest(arrowSelector)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  };

  // Handle tab click
  const handleTabChange = (
    tab: Tab, 
    setActiveTab: (tab: Tab) => void,
    setShowPostDropdown: (show: boolean) => void
  ): void => {
    setActiveTab(tab);
    if (tab !== 'posts') {
      setShowPostDropdown(false);
    }
  };

  // Handle post filter selection
  const handlePostFilterSelection = (
    filter: PostFilter,
    setActivePostFilter: (filter: PostFilter) => void,
    setShowPostDropdown: (show: boolean) => void
  ): void => {
    setActivePostFilter(filter);
    setShowPostDropdown(false);
  };
  
  // Toggle post dropdown
  const togglePostDropdown = (
    e: React.MouseEvent,
    showPostDropdown: boolean,
    setShowPostDropdown: (show: boolean) => void
  ): void => {
    e.stopPropagation();
    setShowPostDropdown(!showPostDropdown);
  };

  // Function to handle notification click and mark as read
  const handleNotificationClick = async (notificationId: string) => {
    try {
      // Call the endpoint to mark notification as read
      await markNotificationAsRead('hfhfhfh', notificationId);
      
      // Optionally update the UI to reflect read status
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Filtered notifications based on active tab
  const filteredNotifications = filterNotificationsByTab(notifications, activeTab, activePostFilter);

  // Function to render empty state message
  const renderEmptyStateMessage = () => {
    if (activeTab === 'posts') {
      return (
        <>
          <h3 className={styles.emptyStateTitle}>No new post activities</h3>
          <p className={styles.emptyStateDescription}>
            Interactions with your posts will appear here
          </p>
        </>
      );
    }

    if (activeTab === 'mentions') {
      return (
        <>
          <h3 className={styles.emptyStateTitle}>No new mentions</h3>
          <p className={styles.emptyStateDescription}>
            When someone tags you in a post or comment, that notification will appear here.
          </p>
        </>
      );
    }

    return (
      <>
        <h3 className={styles.emptyStateTitle}>No notifications</h3>
        <p className={styles.emptyStateDescription}>
          You're all caught up! Check back later for new updates.
        </p>
      </>
    );
  };

  return (
    <main className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.content}>
        {/* Left Profile Section */}
        <div className={styles.leftSidebar}>
          <ProfileCard />
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
              onClick={() => handleTabChange('all', setActiveTab, setShowPostDropdown)}>
              All
            </button>
            <button 
              type="button" 
              className={`${styles.tabButton} ${activeTab === 'jobs' ? styles.activeTab : ''}`} 
              onClick={() => handleTabChange('jobs', setActiveTab, setShowPostDropdown)}>
              Jobs
            </button>
            
            {/* Posts Tab with Dropdown */}
            <div className={styles.postsTabContainer}>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`} 
                onClick={() => handleTabChange('posts', setActiveTab, setShowPostDropdown)}>
                My posts <span 
                  className={styles.dropdownArrow} 
                  onClick={(e) => togglePostDropdown(e, showPostDropdown, setShowPostDropdown)}>
                  ▼
                </span>
              </button>
              
              {/* Post Filter Dropdown for Desktop and Mobile */}
              {showPostDropdown && (
                <div className={`${styles.postDropdown} ${isMobile ? styles.mobilePostDropdown : ''}`}>
                  <div className={styles.dropdownHeader}>
                    Filter post activity
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'all' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('all', setActivePostFilter, setShowPostDropdown)}>
                    All
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'comments' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('comments', setActivePostFilter, setShowPostDropdown)}>
                    Comments
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'reactions' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('reactions', setActivePostFilter, setShowPostDropdown)}>
                    Reactions
                  </div>
                </div>
              )}
            </div>
            <button 
              type="button" 
              className={`${styles.tabButton} ${activeTab === 'mentions' ? styles.activeTab : ''}`} 
              onClick={() => handleTabChange('mentions', setActiveTab, setShowPostDropdown)}>
              Mentions
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
                  <div 
                    key={notification.id} 
                    className={`${styles.notificationItem} ${
                      !notification.read ? styles.unreadNotification : styles.readNotification
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    {!notification.read && (
                      <div className={styles.notificationIndicator}></div>
                    )}
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
                  {renderEmptyStateMessage()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className={styles.rightSidebar}>
          <div className={styles.adContainer}>
            <WhosHiringImage/>
          </div>
          <div className={styles.footerLinks}>
            <LinkUpFooter/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WithNavBar(NotificationsPage);