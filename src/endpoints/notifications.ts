import axios from "axios";
import { Notification, PostFilter } from "../types";
import { Tab } from "../pages/notifications/NotificationsPage";

export const getNotifications = async(
    token: string
): Promise<Notification[]> => {
    const response = await axios.get('/api/notifications', {
        headers: {
            Authorization: "Bearer" + token,
        },
    });
    return response.data;
};

export const filterNotificationsByTab = (
    notifications: Notification[], 
    activeTab: Tab, 
    activePostFilter?: PostFilter
): Notification[] => {
    switch (activeTab) {
      case 'jobs':
        return notifications.filter(notification => 
          notification.type === 'job' || notification.type === 'recommendation');
      case 'posts':
        // In a real implementation, you would filter based on posts and the activePostFilter
        return []; 
      case 'mentions':
        return []; // Return empty for mentions tab to match the "No new mentions" screen
      default:
        return notifications;
    }
};

// Setup click outside listener for dropdowns
export const setupClickOutsideListener = (
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
export const handleTabChange = (
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
export const handlePostFilterSelection = (
    filter: PostFilter,
    setActivePostFilter: (filter: PostFilter) => void,
    setShowPostDropdown: (show: boolean) => void
): void => {
    setActivePostFilter(filter);
    setShowPostDropdown(false);
};
  
// Toggle post dropdown
export const togglePostDropdown = (
    e: React.MouseEvent,
    showPostDropdown: boolean,
    setShowPostDropdown: (show: boolean) => void
): void => {
    e.stopPropagation();
    setShowPostDropdown(!showPostDropdown);
};