import { io, Socket } from 'socket.io-client';

export interface SocketIncomingMessage {
  conversationId: string;
  senderId: string;
  message: {
    message: string;
    media?: string[];
    timestamp: string;
    is_seen: boolean;
    messageId: string;
  };
}

export interface incomingTypingIndicator {
  conversationId: string;
  userId: string;
}

export interface incomingMessageRead {
  conversationId: string;
  readBy: string;
}

export interface incomingUnreadMessagesCount {
  conversationId: string;
  count: number;
}

// ADDED: Notification related interfaces
export interface NotificationData {
  id: string;
  type: string;
  senderId: string;
  senderName: string;
  senderPhoto: string | null;
  content: string;
  createdAt: string;
  referenceId: string;
  isRead?: boolean;
}

export interface IncomingNotification {
  id: string;
  type: string;
  senderId: string;
  senderName: string;
  senderPhoto: string | null;
  content: string;
  createdAt: string;
  referenceId: string;
}

export interface IncomingNotificationCount {
  count: number;
}

export interface incomingTotalCount {
  totalUnreadCount:number;
}
export interface BaseSocketEvent {
  type: string;
  [key: string]: unknown;
}

export type SocketEventData = 
  | SocketIncomingMessage 
  | incomingTypingIndicator 
  | incomingMessageRead 
  | incomingUnreadMessagesCount 
  |incomingTotalCount
  | IncomingNotification
  | IncomingNotificationCount
  | BaseSocketEvent;

export interface PrivateMessagePayload {
  to: string;
  message: string;
  media?: string[];
}


class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: SocketEventData) => void>> = new Map();

  // Initialize socket connection
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const socketUrl = import.meta.env.VITE_SERVER_URL;

        this.socket = io(socketUrl, {
          auth: { token },
          reconnectionAttempts: 5,
          reconnectionDelay: 5000,
          transports: ['websocket'],
          autoConnect: true,
          withCredentials: true,
          timeout: 20000 // 20 seconds connection timeout
        });

        // Setup authentication
        this.socket.on('connect', () => {
          this.socket!.emit("authenticate", { token });
        });

        // Handle authentication response
        this.socket.on("authenticated", () => {
          resolve();
        });

        // Handle authentication errors
        this.socket.on("authentication_error", (error) => {
          console.error('Socket authentication failed:', error);
          reject(error);
        });

        // Handle connection errors
        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        // Setup standard event listeners
        this.setupEventListeners();

      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      // Notify server we're going offline before disconnecting
      this.setOnlineStatus(false);
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', () => {
    });

    // Message related events
    this.socket.on('new_message', () => {
    });

    this.socket.on('message_sent', () => {
    });

    this.socket.on('message_error', (error) => {
      console.error('Message send error:', error);
    });

    this.socket.on('message_reacted', () => {
    });

    this.socket.on('reaction_error', (error) => {
      console.error('Reaction error:', error);
    });

    // Unread messages and conversations
    this.socket.on('unread_messages_count', () => {
    });

    // this.socket.on('unread_conversations', (data) => {
    //   console.log('Unread conversations:', data);
    // });

    // Read receipts
    this.socket.on('messages_read', () => {
    });

    this.socket.on('read_error', (error) => {
      console.error('Mark as read error:', error);
    });

    // Typing indicators
    this.socket.on('user_typing', () => {
    });

    this.socket.on('user_stop_typing', () => {
    });

    // Presence
    this.socket.on('user_online', () => {
    });

    this.socket.on('user_offline', () => {
    });
    
    this.socket.on('conversation_unread_count', () => {
    });

    // ADDED: Notification related events
    this.socket.on('new_notification', () => {
    });

    this.socket.on('unread_notifications_count', () => {
    });

    this.socket.on('notification_error', () => {
    });
  }

  // Send a private message
  sendPrivateMessage(receiverId: string, message: string, media?: string[]): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const payload: PrivateMessagePayload = { 
      to: receiverId, 
      message 
    };
    
    if (media && media.length > 0) {
      payload.media = media;
    }

    this.socket.emit("private_message", payload);
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("typing", { conversationId });
  }

  // Stop typing indicator
  sendStopTypingIndicator(conversationId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("stop_typing", { conversationId });
  }

  // Mark conversation as read
  markAsRead(conversationId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("mark_as_read", { conversationId });
  }

  // Set online status
  setOnlineStatus(isOnline: boolean): void {
    if (!this.socket?.connected) return;
    this.socket.emit(isOnline ? "online" : "offline");
  }

  // React to a message
  reactToMessage(conversationId: string, messageId: string, reaction: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("react_to_message", { 
      conversationId, 
      messageId, 
      reaction 
    });
  }

  // ADDED: Notification related methods
  
  // Mark a notification as read
  markNotificationAsRead(notificationId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("mark_notification_read", { notificationId });
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): void {
    if (!this.socket?.connected) return;
    this.socket.emit("mark_all_notifications_read");
  }

  // Send a notification (for testing or specific use cases)
  sendNotification(recipientId: string, type: string, content?: string, referenceId?: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("new_notification", {
      recipientId,
      type,
      content,
      referenceId
    });
  }

  // Get socket connection status
  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  // Get socket instance (if needed for direct access)
  getSocket(): Socket | null {
    return this.socket;
  }

  // Generic method to add event listeners
  on<T extends SocketEventData>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) {
      console.error('Socket not connected');
      return () => {};
    }

    // Add to our listeners map
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback as (data: SocketEventData) => void);

    // Add the actual socket listener
    this.socket.on(event, callback);

    // Return a function to remove this specific listener
    return () => {
      this.off(event, callback);
    };
  }

  // Generic method to remove event listeners
  off<T extends SocketEventData>(event: string, callback: (data: T) => void): void {
    if (!this.socket) return;

    // Remove from our listeners map
    this.listeners.get(event)?.delete(callback as (data: SocketEventData) => void);
    
    // Remove the actual socket listener
    this.socket.off(event, callback);
  }
}

// Export as a singleton
export const socketService = new SocketService();