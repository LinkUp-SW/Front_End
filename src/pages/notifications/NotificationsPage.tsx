import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./notifications.module.css";
import {
  ProfileCard,
  WithNavBar,
  LinkUpFooter,
  WhosHiringImage,
} from "@/components";
import { RootState } from "@/store";
import notificationPicture2 from "@/assets/notificationpicture2.jpeg";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationsCount,
} from "@/endpoints/notifications";
import { Notification } from "@/types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export type Tab = "all" | "posts" | "messages";
export type PostFilter = "all" | "comments" | "reactions";

// Update the filtering function to handle null/undefined content
export const filterNotificationsByTab = (
  notifications: Notification[],
  activeTab: Tab,
  activePostFilter?: PostFilter
): Notification[] => {
  if (!Array.isArray(notifications)) {
    return [];
  }

  switch (activeTab) {
    case "posts": {
      // Filter notifications related to comments and reactions, safely handling null/undefined content
      const postRelatedNotifications = notifications.filter((notification) => {
        const content = notification.content
          ? notification.content.toLowerCase()
          : "";
        return content.includes("comment") || content.includes("reacted");
      });

      // Apply additional filtering if a specific post filter is selected
      if (activePostFilter === "comments") {
        return postRelatedNotifications.filter(
          (n) => n.content && n.content.toLowerCase().includes("comment")
        );
      }

      if (activePostFilter === "reactions") {
        return postRelatedNotifications.filter(
          (n) => n.content && n.content.toLowerCase().includes("reacted")
        );
      }

      return postRelatedNotifications;
    }

    case "messages": {
      return notifications.filter(
        (notification) => notification.type === "message"
      );
    }

    case "all":
    default: {
      // Return all notifications for the 'all' tab
      return notifications;
    }
  }
};

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unReadCount, setUnreadCount] = useState<number>(0);
  const [showPostDropdown, setShowPostDropdown] = useState<boolean>(false);
  const [activePostFilter, setActivePostFilter] = useState<PostFilter>("all");
  const [clickedNotifications, setClickedNotifications] = useState<Set<string>>(
    new Set()
  );
  const [activeOptionsDropdown, setActiveOptionsDropdown] = useState<
    string | null
  >(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isDarkMode = useSelector(
    (state: RootState) => state.theme.theme === "dark"
  );
  const token = Cookies.get("linkup_auth_token");
  const userId=Cookies.get('linkup_user_id')

  const fetchNotifications = async () => {
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await getNotifications(token);
      setNotifications(response.notifications);

      // Set unreadCount from the response
      setUnreadCount(response.unReadCount);
      setError(null);

      console.log("Fetched notifications:", response.notifications);
      console.log("Unread count:", response.unReadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = async () => {
    if (!token) return;
    try {
      const count = await getUnreadNotificationsCount(token);
      setUnreadCount(count);
      console.log("Updated unread count:", count);
    } catch (error) {
      console.error("Error updating unread count:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(`.${styles.postsTabContainer}`) &&
        !target.closest(`.${styles.dropdownArrow}`)
      ) {
        setShowPostDropdown(false);
      }

      if (!target.closest(`.${styles.notificationOptions}`)) {
        setActiveOptionsDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleTabChange = (tab: Tab): void => {
    setActiveTab(tab);
    if (tab !== "posts") {
      setShowPostDropdown(false);
    }
  };

  const handlePostFilterSelection = (filter: PostFilter): void => {
    setActivePostFilter(filter);
    setShowPostDropdown(false);
  };

  const togglePostDropdown = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowPostDropdown(!showPostDropdown);
  };

  const toggleOptionsDropdown = (
    e: React.MouseEvent,
    notificationId: string
  ): void => {
    e.stopPropagation();
    setActiveOptionsDropdown((prevId) =>
      prevId === notificationId ? null : notificationId
    );
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Don't mark as read if already read
    if (!notification.id || notification.isRead) return;

    // Optimistically update the UI
    setClickedNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.add(notification.id);
      return newSet;
    });

    try {
      await markNotificationAsRead(token as string, notification.id);

      // Update the notifications array to mark this notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item
        )
      );

      // Decrement the unread count
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));

      // Also fetch the updated count from the server to ensure consistency
      await updateUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Revert UI optimistic update in case of error
      setClickedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
    }
  };

  const handleMarkAsRead = async (
    e: React.MouseEvent,
    notification: Notification
  ) => {
    e.stopPropagation();
    if (!notification.id || notification.isRead) return;

    setActiveOptionsDropdown(null);

    try {
      await markNotificationAsRead(token as string, notification.id);

      // Update the notifications array
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item
        )
      );

      // Decrement the unread count
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));

      // Also fetch the updated count from the server
      await updateUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const filteredNotifications = filterNotificationsByTab(
    notifications,
    activeTab,
    activePostFilter
  );

  const renderEmptyStateMessage = () => {
    if (error) {
      return (
        <>
          <h3 className={styles.emptyStateTitle}>Error</h3>
          <p className={styles.emptyStateDescription}>{error}</p>
        </>
      );
    }

    switch (activeTab) {
      case "posts":
        return (
          <>
            <h3 className={styles.emptyStateTitle}>No new post activities</h3>
            <p className={styles.emptyStateDescription}>
              Interactions with your posts will appear here
            </p>
          </>
        );

      case "messages":
        return (
          <>
            <h3 className={styles.emptyStateTitle}>No new messages</h3>
            <p className={styles.emptyStateDescription}>
              Direct messages from your connections will appear here
            </p>
          </>
        );

      default:
        return (
          <>
            <h3 className={styles.emptyStateTitle}>No notifications</h3>
            <p className={styles.emptyStateDescription}>
              You're all caught up! Check back later for new updates
            </p>
          </>
        );
    }
  };

  const formatNotificationTime = (createdAt: string): string => {
    if (!createdAt) {
      return "Date not available";
    }

    const date = new Date(createdAt);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return format(date, "MMM d, yyyy h:mm a");
  };

  const handleNavigation = (type: Notification["type"],refId:string) => {
    if (type === "connection_request") {
      return navigate(`/my-network`);
    }
    if (type === "follow") {
      return navigate("/following-followers");
    }
    if (type === "message") {
      return navigate("/messaging");
    }
    if(type==='comment'||type==='reacted'){
      return navigate(`/feed/posts/${refId}`)
    }
    if(type==='connection_accepted'){
      return navigate(`/connections/${userId}`)
    }
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.content}>
        <div className={styles.leftSidebar}>
          <ProfileCard />
          <div className={styles.notificationSettings}>
            <h3>Manage your notifications</h3>
            <a href="/settings/notifications" className={styles.settingsLink}>
              View settings
            </a>
          </div>
        </div>

        <div className={styles.mainContentWrapper}>
          <div className={styles.standaloneTabContainer}>
            <button
              type="button"
              className={`${styles.tabButton} ${
                activeTab === "all" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("all")}
            >
              All
              {unReadCount > 0 && (
                <span className={styles.tabNotificationBadge}>
                  {unReadCount}
                </span>
              )}
            </button>

            <div className={styles.postsTabContainer}>
              <button
                type="button"
                className={`${styles.tabButton} ${
                  activeTab === "posts" ? styles.activeTab : ""
                }`}
                onClick={() => handleTabChange("posts")}
              >
                Posts
                <span
                  className={styles.dropdownArrow}
                  onClick={(e) => togglePostDropdown(e)}
                >
                  ▼
                </span>
              </button>

              {showPostDropdown && (
                <div
                  className={`${styles.postDropdown} ${
                    isMobile ? styles.mobilePostDropdown : ""
                  }`}
                >
                  <div className={styles.dropdownHeader}>
                    Filter post activity
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${
                      activePostFilter === "all"
                        ? styles.activeDropdownItem
                        : ""
                    }`}
                    onClick={() => handlePostFilterSelection("all")}
                  >
                    All
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${
                      activePostFilter === "comments"
                        ? styles.activeDropdownItem
                        : ""
                    }`}
                    onClick={() => handlePostFilterSelection("comments")}
                  >
                    Comments
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${
                      activePostFilter === "reactions"
                        ? styles.activeDropdownItem
                        : ""
                    }`}
                    onClick={() => handlePostFilterSelection("reactions")}
                  >
                    Reactions
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`${styles.tabButton} ${
                activeTab === "messages" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("messages")}
            >
              Messages
            </button>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.notificationsList}>
              {loading ? (
                <div className={styles.loading}>Loading notifications...</div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      notification.isRead ||
                      clickedNotifications.has(notification.id)
                        ? styles.readNotification
                        : styles.unreadNotification
                    } ${
                      clickedNotifications.has(notification.id)
                        ? styles.clickedNotification
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {!notification.isRead &&
                      !clickedNotifications.has(notification.id) && (
                        <div className={styles.notificationIndicator}></div>
                      )}
                    <div className={styles.notificationImage}>
                      <img
                        src={
                          notification.sender?.profilePhoto ||
                          "/api/placeholder/50/50"
                        }
                        alt={`${notification.sender?.firstName || "User"} ${
                          notification.sender?.lastName || "Name"
                        }`}
                      />
                    </div>

                    <div className={styles.notificationContent}>
                      <p>{notification.content}</p>
                      {notification.referenceId && (
                        <button
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigation(notification.type,notification.referenceId);
                          }}
                        >
                          View {notification.type}
                        </button>
                      )}
                    </div>
                    <div className={styles.notificationTime}>
                      {formatNotificationTime(notification.createdAt)}
                    </div>
                    <div className={styles.notificationOptions}>
                      <button
                        type="button"
                        aria-label="More options"
                        onClick={(e) =>
                          toggleOptionsDropdown(e, notification.id)
                        }
                      >
                        ...
                      </button>

                      {activeOptionsDropdown === notification.id && (
                        <div className={styles.optionsDropdown}>
                          {!notification.isRead && (
                            <div
                              className={styles.optionItem}
                              onClick={(e) => handleMarkAsRead(e, notification)}
                            >
                              Mark as read
                            </div>
                          )}
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

        <div className={styles.rightSidebar}>
          <div className={styles.adContainer}>
            <WhosHiringImage />
          </div>
          <div className={styles.footerLinks}>
            <LinkUpFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithNavBar(NotificationsPage);
