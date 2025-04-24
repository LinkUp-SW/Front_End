import { io, Socket } from 'socket.io-client';

export interface SocketIncomingMessage {
  conversationId: string;
  senderId: string;
  message: {
    message: string;
    media?: string[];
    timestamp: string;
    is_seen: boolean;
  };
}


class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

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
          console.log('Socket connected, authenticating...');
          this.socket!.emit("authenticate", { token });
        });

        // Handle authentication response
        this.socket.on("authenticated", (data) => {
          console.log('Socket authenticated:', data);
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
      console.log('Socket disconnected');
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected from server, reason:', reason);
    });

    // Message related events
    this.socket.on('new_message', (data) => {
      console.log('New message received:', data);
    });

    this.socket.on('message_sent', (data) => {
      console.log('Message sent confirmation:', data);
    });

    this.socket.on('message_error', (error) => {
      console.error('Message send error:', error);
    });

    this.socket.on('message_reacted', (data) => {
      console.log('Message reaction:', data);
    });

    this.socket.on('reaction_error', (error) => {
      console.error('Reaction error:', error);
    });

    // Unread messages and conversations
    this.socket.on('unread_messages_count', (data) => {
      console.log('Unread messages count:', data);
    });

    this.socket.on('unread_conversations', (data) => {
      console.log('Unread conversations:', data);
    });

    // Read receipts
    this.socket.on('messages_read', (data) => {
      console.log('Messages read by:', data);
    });

    this.socket.on('read_error', (error) => {
      console.error('Mark as read error:', error);
    });

    // Typing indicators
    this.socket.on('user_typing', (data) => {
      console.log('User typing:', data);
    });

    this.socket.on('user_stop_typing', (data) => {
      console.log('User stopped typing:', data);
    });

    // Presence
    this.socket.on('user_online', (data) => {
      console.log('User online:', data);
    });

    this.socket.on('user_offline', (data) => {
      console.log('User offline:', data);
    });
  }

  // Send a private message
  sendPrivateMessage(receiverId: string, message: string, media?: string[]): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const payload: any = { 
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

  // Get socket connection status
  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  // Get socket instance (if needed for direct access)
  getSocket(): Socket | null {
    return this.socket;
  }

  // Generic method to add event listeners
  on<T>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) {
      console.error('Socket not connected');
      return () => {};
    }

    // Add to our listeners map
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // Add the actual socket listener
    this.socket.on(event, callback);

    // Return a function to remove this specific listener
    return () => {
      this.off(event, callback);
    };
  }

  // Generic method to remove event listeners
  off<T>(event: string, callback: (data: T) => void): void {
    if (!this.socket) return;

    // Remove from our listeners map
    this.listeners.get(event)?.delete(callback);
    
    // Remove the actual socket listener
    this.socket.off(event, callback);
  }
}

// Export as a singleton
export const socketService = new SocketService();