import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { Notification } from '../../src/types';
import { filterNotificationsByTab } from '../../src/pages/notifications/NotificationsPage';


describe('filterNotificationsByTab Function', () => {
  // Use a factory function to create test notifications
  // This makes it easier to adapt if the notification structure changes
  const createNotification = (overrides: Partial<Notification> = {}): Notification => {
    return {
      id: '1',
      type: 'post',
      content: 'Default content',
      time: '1h',
      ...overrides
    };
  };

  test('filters all notifications when tab is "all"', () => {
    // Create notifications of different types
    const notifications = [
      createNotification({ type: 'post' }),
      createNotification({ type: 'job', id: '2' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'all');
    expect(result.length).toBe(2);
    // Verify we get all notifications without filtering
    expect(result).toEqual(notifications);
  });

  test('filters job notifications when tab is "jobs"', () => {
    // Create mixed notification types
    const notifications = [
      createNotification({ type: 'post' }),
      createNotification({ type: 'job', id: '2' }),
      createNotification({ type: 'message', id: '3' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'jobs');
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('job');
  });

  test('filters post notifications when tab is "posts" with no filter', () => {
    // Create mixed notification types
    const notifications = [
      createNotification({ type: 'post' }),
      createNotification({ type: 'job', id: '2' }),
      createNotification({ type: 'post', id: '3' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'posts');
    expect(result.length).toBe(2);
    // Verify each result is a post notification
    result.forEach(notification => {
      expect(notification.type).toBe('post');
    });
  });

  test('filters post notifications with comments filter', () => {
    // Create post notifications with different content types
    const notifications = [
      createNotification({ content: 'User commented on your post' }),
      createNotification({ content: 'User replied to your post', id: '2' }),
      createNotification({ content: 'User liked your post', id: '3' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'posts', 'comments');
    expect(result.length).toBe(2);
    // Verify we have at least one notification with each type of content
    expect(result.some(n => n.content.includes('commented'))).toBe(true);
    expect(result.some(n => n.content.includes('replied'))).toBe(true);
  });

  test('filters post notifications with reactions filter', () => {
    // Create post notifications with different content types
    const notifications = [
      createNotification({ content: 'User liked your post' }),
      createNotification({ content: 'User shared your post', id: '2' }),
      createNotification({ content: 'User commented on your post', id: '3' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'posts', 'reactions');
    expect(result.length).toBe(2);
    // Verify we have at least one notification with each type of content
    expect(result.some(n => n.content.includes('liked'))).toBe(true);
    expect(result.some(n => n.content.includes('shared'))).toBe(true);
  });

  test('filters mention notifications when tab is "mentions"', () => {
    // Create notifications with and without mentions
    const notifications = [
      createNotification({ content: 'Regular post' }),
      createNotification({ content: 'User @mentioned you', id: '2' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'mentions');
    expect(result.length).toBe(1);
    expect(result[0].content).toContain('@');
  });

  test('returns empty array when no notifications match filter', () => {
    // Create notifications without any mentions
    const notifications = [
      createNotification({ content: 'No mentions here' })
    ];
    
    const result = filterNotificationsByTab(notifications, 'mentions');
    expect(result.length).toBe(0);
  });

  test('handles empty notifications array', () => {
    const result = filterNotificationsByTab([], 'all');
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});