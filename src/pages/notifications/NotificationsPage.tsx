import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './notifications.module.css';
import { ProfileCard, WithNavBar, LinkUpFooter, WhosHiringImage } from '../../components';
import { RootState } from '../../store';
import notificationPicture2 from "../../assets/notificationpicture2.jpeg"; 
import { getNotifications, markNotificationAsRead } from '@/endpoints/notifications';
import { Notification } from '../../types';

// Define tab types for notification filtering
export type Tab = 'all' | 'posts' | 'messages';
export type PostFilter = 'all' | 'comments' | 'reactions';

// Extract the filterNotificationsByTab function and export it separately
export const filterNotificationsByTab = (
  notifications: Notification[], 
  activeTab: Tab, 
  activePostFilter?: PostFilter
): Notification[] => {
  switch (activeTab) {
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
    
    case 'messages': {
      return notifications.filter(notification => 
        notification.type === 'message'
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
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // State for post dropdown
  const [showPostDropdown, setShowPostDropdown] = useState<boolean>(false);
  const [activePostFilter, setActivePostFilter] = useState<PostFilter>('all');

  // State for tracking clicked notifications
  const [clickedNotifications, setClickedNotifications] = useState<Set<string>>(new Set());
  
  // New state for notification options dropdown
  const [activeOptionsDropdown, setActiveOptionsDropdown] = useState<string | null>(null);

  // State for mobile responsiveness
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  // Get dark mode state from Redux
  const isDarkMode = useSelector((state: RootState) => state.theme.theme === 'dark');

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => notification.isNew).length;
    setUnreadCount(count);
  }, [notifications]);

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

  // Add click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close post dropdown if clicked outside
      if (!target.closest(`.${styles.postsTabContainer}`) && 
          !target.closest(`.${styles.dropdownArrow}`)) {
        setShowPostDropdown(false);
      }
      
      // Close options dropdown if clicked outside
      if (!target.closest(`.${styles.notificationOptions}`)) {
        setActiveOptionsDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle tab click
  const handleTabChange = (tab: Tab): void => {
    setActiveTab(tab);
    if (tab !== 'posts') {
      setShowPostDropdown(false);
    }
  };

  // Handle post filter selection
  const handlePostFilterSelection = (filter: PostFilter): void => {
    setActivePostFilter(filter);
    setShowPostDropdown(false);
  };
  
  // Toggle post dropdown
  const togglePostDropdown = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowPostDropdown(!showPostDropdown);
  };
  
  // Toggle notification options dropdown
  const toggleOptionsDropdown = (e: React.MouseEvent, notificationId: string): void => {
    e.stopPropagation();
    setActiveOptionsDropdown(prevId => prevId === notificationId ? null : notificationId);
  };

  // Function to handle notification click and mark as read
  const handleNotificationClick = async (notification: Notification) => {
    // Immediately update UI to show the notification as read
    setClickedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.add(notification.id);
      return newSet;
    });
    
    if (!notification.isNew) return; // Only process unread notifications
    
    try {
      // Call the endpoint to mark notification as read
      await markNotificationAsRead('hfhfhfh', notification.id);
      
      // Update local state to mark notification as read (isNew = false)
      setNotifications(prevNotifications => 
        prevNotifications.map(item => 
          item.id === notification.id 
            ? { ...item, isNew: false } 
            : item
        )
      );
      
      // Update unread count will happen automatically via the useEffect
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert UI change if API call fails
      setClickedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
    }
  };
  
  // Function to manually mark notification as read from dropdown
  const handleMarkAsRead = async (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    
    // Close the dropdown
    setActiveOptionsDropdown(null);
    
    // If already read, do nothing
    if (!notification.isNew) return;
    
    try {
      // Call the endpoint to mark notification as read
      await markNotificationAsRead('hfhfhfh', notification.id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(item => 
          item.id === notification.id 
            ? { ...item, isNew: false } 
            : item
        )
      );
      
      // Add to clicked notifications set
      setClickedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.add(notification.id);
        return newSet;
      });
      
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
    
    if (activeTab === 'messages') {
      return (
        <>
          <h3 className={styles.emptyStateTitle}>No new messages</h3>
          <p className={styles.emptyStateDescription}>
            Direct messages from your connections will appear here.
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
              onClick={() => handleTabChange('all')}>
              All
              {unreadCount > 0 && <span className={styles.tabNotificationBadge}>{unreadCount}</span>}
            </button>
            
            {/* Posts Tab with Dropdown */}
            <div className={styles.postsTabContainer}>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`} 
                onClick={() => handleTabChange('posts')}>
                My posts
                <span 
                  className={styles.dropdownArrow} 
                  onClick={(e) => togglePostDropdown(e)}>
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
                    onClick={() => handlePostFilterSelection('all')}>
                    All
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'comments' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('comments')}>
                    Comments
                  </div>
                  <div 
                    className={`${styles.dropdownItem} ${activePostFilter === 'reactions' ? styles.activeDropdownItem : ''}`}
                    onClick={() => handlePostFilterSelection('reactions')}>
                    Reactions
                  </div>
                </div>
              )}
            </div>
            <button 
              type="button" 
              className={`${styles.tabButton} ${activeTab === 'messages' ? styles.activeTab : ''}`} 
              onClick={() => handleTabChange('messages')}>
              Messages
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
                      !notification.isNew || clickedNotifications.has(notification.id) ? 
                        styles.readNotification : styles.unreadNotification
                    } ${
                      clickedNotifications.has(notification.id) ? styles.clickedNotification : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.isNew && !clickedNotifications.has(notification.id) && (
                      <div className={styles.notificationIndicator}></div>
                    )}
                    <div className={styles.notificationImage}>
                      <img src={notification.profileImg || "/api/placeholder/50/50"} alt="Notification" />
                    </div>
                    <div className={styles.notificationContent}>
                      <p dangerouslySetInnerHTML={{ __html: notification.content }}></p>
                      {notification.action && (
                        <a 
                          href={notification.actionLink || "#"} 
                          className={styles.actionButton}
                          onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
                        >
                          {notification.action}
                        </a>
                      )}
                    </div>
                    <div className={styles.notificationTime}>
                      {notification.time}
                    </div>
                    <div className={styles.notificationOptions}>
                      <button 
                        type="button" 
                        aria-label="More options"
                        onClick={(e) => toggleOptionsDropdown(e, notification.id)}
                      >
                        ...
                      </button>
                      
                      {/* Options dropdown */}
                      {activeOptionsDropdown === notification.id && (
                        <div className={styles.optionsDropdown}>
                          <div 
                            className={styles.optionItem}
                            onClick={(e) => handleMarkAsRead(e, notification)}
                          >
                            Mark this notification as read
                          </div>
                        </div>
                      )}
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