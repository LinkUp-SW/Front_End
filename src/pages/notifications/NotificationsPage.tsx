import React, { useState, useEffect } from 'react';
import styles from './notifications.module.css';
import { WithNavBar } from '../../components';

import notificationPicture from "../../assets/notificationpicture.jpeg"; 
import notificationPicture2 from "../../assets/notificationpicture2.jpeg"; 

interface Notification {
  id: string;
  type: 'job' | 'post' | 'hiring' | 'course' | 'analytics' | 'recommendation';
  content: string;
  time: string;
  profileImg?: string;
  action?: string;
  actionLink?: string;
  location?: string;
  count?: number;
  isNew?: boolean;
}

// Define tab types for notification filtering
type Tab = 'all' | 'jobs' | 'posts' | 'mentions';

// Define post filter types
type PostFilter = 'all' | 'comments' | 'reactions' | 'reposts';

const NotificationsPage: React.FC = () => {
  // State for active tab and notifications
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // State for post dropdown
  const [showPostDropdown, setShowPostDropdown] = useState<boolean>(false);
  const [activePostFilter, setActivePostFilter] = useState<PostFilter>('all');

  // Fetch mock notifications data //////
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real implementation, this would be an API call
        const response = await fetch('/api/notifications');
        const data = await response.json();
        
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to mock data if API call fails
        setNotifications(MOCK_NOTIFICATIONS);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.postsTabContainer}`) && 
          !target.closest(`.${styles.dropdownArrow}`)) {
        setShowPostDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Filter notifications based on active tab and post filter
  const getFilteredNotifications = (): Notification[] => {
    switch (activeTab) {
      case 'jobs':
        return notifications.filter(notification => 
          notification.type === 'job' || notification.type === 'recommendation');
      case 'posts':
        // For the posts tab, we'll return an empty array to show the empty state
        // In a real implementation, you would filter based on posts and the activePostFilter
        return []; 
      case 'mentions':
        return []; // Return empty for mentions tab to match the "No new mentions" screen
      default:
        return notifications;
    }
  };

  // Handle main tab click
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== 'posts') {
      setShowPostDropdown(false);
    }
  };

  // Handle arrow click to toggle dropdown
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPostDropdown(!showPostDropdown);
  };

  // Handle post filter selection
  const handlePostFilterClick = (filter: PostFilter) => {
    setActivePostFilter(filter);
    setShowPostDropdown(false);
  };

  // Filtered notifications based on active tab
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Profile Section */}
        <div className={styles.leftSidebar}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}></div>
            <div className={styles.profileContent}>
              <div className={styles.profileImage}>
                <img src="/api/placeholder/150/150" alt="Profile" />
              </div>
              <h2 className={styles.profileName}>Malak El-Tuny</h2>
              <p className={styles.profileTitle}>Biomedical and Data Engineering Student</p>
              <p className={styles.profileLocation}>Cairo</p>
              <p className={styles.profileEducation}>
                <span className={styles.educationIcon}>🏛️</span> Cairo University
              </p>
            </div>
          </div>
          <div className={styles.notificationSettings}>
            <h3>Manage your notifications</h3>
            <a href="#" className={styles.settingsLink}>View settings</a>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContentWrapper}>
          {/* Standalone Tab Navigation */}
          <div className={styles.standaloneTabContainer}>
            <button type="button" className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => handleTabClick('all')}> All</button>
            <button type="button" className={`${styles.tabButton} ${activeTab === 'jobs' ? styles.activeTab : ''}`} onClick={() => handleTabClick('jobs')}>Jobs</button>
            
            {/* Posts Tab with Dropdown */}
            <div className={styles.postsTabContainer}>
              <button type="button" className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`} onClick={() => handleTabClick('posts')}>My posts <span className={styles.dropdownArrow} onClick={handleArrowClick}>▼</span></button>
              
              {/* Post Filter Dropdown */}
              {showPostDropdown && (
                <div className={styles.postDropdown}>
                  <div className={styles.dropdownHeader}>
                    Filter post activity
                  </div>
                  <div className={`${styles.dropdownItem} ${activePostFilter === 'all' ? styles.activeDropdownItem : ''}`}onClick={() => handlePostFilterClick('all')}>
                    All
                  </div>
                  <div className={`${styles.dropdownItem} ${activePostFilter === 'comments' ? styles.activeDropdownItem : ''}`}onClick={() => handlePostFilterClick('comments')}>
                    Comments
                  </div>
                  <div className={`${styles.dropdownItem} ${activePostFilter === 'reactions' ? styles.activeDropdownItem : ''}`}onClick={() => handlePostFilterClick('reactions')}>
                    Reactions
                  </div>
                  <div className={`${styles.dropdownItem} ${activePostFilter === 'reposts' ? styles.activeDropdownItem : ''}`}onClick={() => handlePostFilterClick('reposts')}>
                    Reposts
                  </div>
                </div>
              )}
            </div>
            <button type="button" className={`${styles.tabButton} ${activeTab === 'mentions' ? styles.activeTab : ''}`} onClick={() => handleTabClick('mentions')}>Mentions</button>
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
    </div>
  );
};

// Mock notifications data for fallback
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'hiring',
    content: '<b>Malak</b> is hiring.',
    time: '4h',
    profileImg: '/api/placeholder/50/50',
    isNew: true
  },
  {
    id: '2',
    type: 'analytics',
    content: 'Your posts got <b>15 impressions</b> last week. View your analytics.',
    time: '4h',
    profileImg: '/api/placeholder/50/50',
    isNew: true
  },
  {
    id: '3',
    type: 'course',
    content: 'New from <b>Free Online Courses with Certificates</b> in Free Online Courses: Boost Your Skills with 100 Free Courses and Certificates on Udemy and Coursera',
    time: '11h',
    profileImg: '/api/placeholder/50/50',
    isNew: true
  },
  {
    id: '4',
    type: 'job',
    content: 'software engineer: <b>30+ opportunities</b> in Cairo, Egypt',
    time: '20h',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: true
  },
  {
    id: '5',
    type: 'recommendation',
    content: '<b>ETL Data Analyst</b> at Siemens Digital Industries Software and <b>9 other recommendations</b> for you.',
    time: '1d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: true
  },
  {
    id: '6',
    type: 'job',
    content: 'frontend developer: <b>15+ opportunities</b> in Dubai, UAE',
    time: '1d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: false
  },
  {
    id: '7',
    type: 'job',
    content: 'product manager: <b>12 opportunities</b> in Riyadh, Saudi Arabia',
    time: '2d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: false
  },
  {
    id: '8',
    type: 'hiring',
    content: '<b>Amira</b> is looking for a <b>UX Designer</b>.',
    time: '3d',
    profileImg: '/api/placeholder/50/50',
    action: 'See post',
    actionLink: '#',
    isNew: false
  },
  {
    id: '9',
    type: 'recommendation',
    content: '<b>Data Scientist</b> at Google and <b>7 other recommendations</b> based on your profile.',
    time: '3d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: false
  }
];

export default WithNavBar(NotificationsPage);
