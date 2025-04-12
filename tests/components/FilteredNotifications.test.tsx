// tests/FilteredNotifications.test.tsx
import { describe, it, expect } from 'vitest';
import { filterNotificationsByTab} from '../../src/pages/notifications/NotificationsPage';
import { Notification } from '../../src/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'post',
    content: 'John commented on your post',
    isNew: true,
    time: '1h ago',
    profileImg: '',
    action: '',
    actionLink: '',
  },
  {
    id: '2',
    type: 'post',
    content: 'Emily liked your post',
    isNew: false,
    time: '2h ago',
    profileImg: '',
    action: '',
    actionLink: '',
  },
  {
    id: '3',
    type: 'message',
    content: 'You have a new message from Sarah',
    isNew: true,
    time: '5h ago',
    profileImg: '',
    action: '',
    actionLink: '',
  },
  {
    id: '4',
    type: 'post',
    content: 'Mike shared your post',
    isNew: false,
    time: '6h ago',
    profileImg: '',
    action: '',
    actionLink: '',
  },
];

describe('filterNotificationsByTab', () => {
  it('returns all notifications for "all" tab', () => {
    const result = filterNotificationsByTab(mockNotifications, 'all');
    expect(result).toHaveLength(4);
  });

  it('returns only "post" notifications for "posts" tab', () => {
    const result = filterNotificationsByTab(mockNotifications, 'posts');
    expect(result).toHaveLength(3);
    result.forEach(notification => {
      expect(notification.type).toBe('post');
    });
  });

  it('returns only "message" notifications for "messages" tab', () => {
    const result = filterNotificationsByTab(mockNotifications, 'messages');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('message');
  });

  it('filters "post" notifications to only include comments', () => {
    const result = filterNotificationsByTab(mockNotifications, 'posts', 'comments');
    expect(result).toHaveLength(1);
    expect(result[0].content.toLowerCase()).toContain('comment');
  });

  it('filters "post" notifications to only include reactions', () => {
    const result = filterNotificationsByTab(mockNotifications, 'posts', 'reactions');
    expect(result).toHaveLength(2);
    expect(result[0].content.toLowerCase()).toMatch(/liked|shared/);
    expect(result[1].content.toLowerCase()).toMatch(/liked|shared/);
  });

  it('returns empty list if no matching notifications', () => {
    const emptyInput: Notification[] = [];
    const result = filterNotificationsByTab(emptyInput, 'posts');
    expect(result).toHaveLength(0);
  });
});
