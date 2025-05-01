import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

// Singleton class to manage socket connection for notifications
class NotificationsSocketService {
  private static instance: NotificationsSocketService;
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private token: string | undefined;
  
  // Events we'll listen for
  private readonly EVENTS = {
    AUTHENTICATED: 'authenticated',
    NEW_NOTIFICATION: 'new_notification',
    UNREAD_NOTIFICATIONS_COUNT: 'unread_notifications_count',
    NOTIFICATION_ERROR: 'notification_error',
  };

  private constructor() {
    this.token = Cookies.get('linkup_auth_token');
  }

  public static getInstance(): NotificationsSocketService {
    if (!NotificationsSocketService.instance) {
      NotificationsSocketService.instance = new NotificationsSocketService();
    }
    return NotificationsSocketService.instance;
  }

  // Initialize socket connection
  public connect(): void {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return;
    }

    if (!this.token) {
      console.error('Cannot connect to socket: No authentication token found');
      return;
    }

    // Connect to socket server using environment variable for socket URL
    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.authenticate();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Listen for server events
    this.setupServerListeners();
  }

  // Authenticate with the socket server
  private authenticate(): void {
    if (!this.socket || !this.token) return;

    this.socket.emit('authenticate', { token: this.token });
    
    this.socket.on(this.EVENTS.AUTHENTICATED, (data) => {
      console.log('Socket authenticated:', data);
    });
  }

  // Set up listeners for server events
  private setupServerListeners(): void {
    if (!this.socket) return;

    // Listen for new notifications
    this.socket.on(this.EVENTS.NEW_NOTIFICATION, (notification) => {
      console.log('New notification received:', notification);
      this.emitToListeners(this.EVENTS.NEW_NOTIFICATION, notification);
    });

    // Listen for unread count updates
    this.socket.on(this.EVENTS.UNREAD_NOTIFICATIONS_COUNT, (data) => {
      console.log('Unread notifications count:', data);
      this.emitToListeners(this.EVENTS.UNREAD_NOTIFICATIONS_COUNT, data.count);
    });

    // Listen for errors
    this.socket.on(this.EVENTS.NOTIFICATION_ERROR, (error) => {
      console.error('Notification error:', error);
      this.emitToListeners(this.EVENTS.NOTIFICATION_ERROR, error);
    });
  }

  // Register a listener for a specific event
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  // Remove a listener for a specific event
  public off(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }
  }

  // Notify all registered listeners for an event
  private emitToListeners(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => {
        callback(data);
      });
    }
  }

  // Mark a notification as read via socket
  public markNotificationAsRead(notificationId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.error('Cannot mark notification as read: Socket not connected');
      return;
    }

    this.socket.emit('mark_notification_read', { notificationId });
  }

  // Mark all notifications as read via socket
  public markAllNotificationsAsRead(): void {
    if (!this.socket || !this.socket.connected) {
      console.error('Cannot mark all notifications as read: Socket not connected');
      return;
    }

    this.socket.emit('mark_all_notifications_read');
  }

  // Disconnect the socket
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get the current socket instance
  public getSocket(): Socket | null {
    return this.socket;
  }

  // Check if socket is connected
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export the singleton instance
export default NotificationsSocketService.getInstance();