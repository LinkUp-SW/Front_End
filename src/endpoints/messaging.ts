import axiosInstance from "@/services/axiosInstance";

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  onlineStatus: boolean;
}

export interface LastMessage {
  message: string;
  timestamp:string | Date; 
  isOwnMessage: boolean;
}

export interface Conversation {
  conversationId: string;
  conversationType:string[];
  otherUser: User;
  lastMessage: LastMessage;
  unreadCount: number;
}

export interface unreadMessagesCount {
  conversationId: string;
  otherUser: User;
  lastMessage: LastMessage;
  unreadCount: number;

}
export interface MessageChat
  {
    messageId:string
    senderId: string;
    senderName: string;
    message: string;
    media: string[];
    timestamp: string | Date ;
    reacted: boolean;
    isSeen: boolean;
    isOwnMessage: boolean;
    isDeleted: boolean;
    isEdited: boolean;
  }

export interface chattingMessages{
  conversationId: string;
  otherUser: User;
  messages: MessageChat[];
}


export const getAllConversations = async (
  token: string
): Promise<{ conversations: Conversation[] }> => {
  const response = await axiosInstance.get('/api/v1/conversations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

export const getConversation = async (
  token: string,
  convId: string
): Promise<chattingMessages> => {
  const response = await axiosInstance.get(`/api/v1/conversations/${convId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

export const deleteConversation= async(
  token:string,
  convId:string
)=>{
  const response =await axiosInstance.delete(`/api/v1/conversations/${convId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
})
  return response.data
}

export const deleteMessages= async(
  token:string,
  conversationId:string,
  messageId:string

)=>{
  const response =await axiosInstance.delete(`/api/v1/messages/${conversationId}/${messageId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
})
  return response.data
}

export const editMessage = async (
  token: string,
  conversationId: string,
  messageId: string,
  newMessage: string
) => {
  const response = await axiosInstance.patch(`/api/v1/messages/${conversationId}/${messageId}/edit`,
    { message: newMessage },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};



export const markConversationAsRead = async (token: string, conversationId: string) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/conversations/${conversationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;  // This will contain the success message from the backend
  } catch (error) {
    console.error("Error marking conversation as unread:", error);
    throw new Error('Error marking conversation as read');
  }
};

export const markConversationAsUnread = async (token: string, conversationId: string) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/conversations/${conversationId}/unread`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error marking conversation as unread:", error);
    throw new Error('Error marking conversation as unread');
  }
};

export const startConversation = async (
  token: string,
  user2ID: string,
  firstMessage?: string,
  media?: string[],
  mediaTypes?: string[]
): Promise<{ conversationId: string }> => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/conversations/start-conversation/${user2ID}`,
      {
        firstMessage,
        media,
        mediaTypes
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // Improved error handling
    console.error("Error starting conversation:", error);
    
    // Return more specific error information if available
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to start conversation');
    }
    
    throw new Error('Failed to start conversation');
  }
}







export const getUnseenMessagesCountByConversation = async (
  token: string
): Promise<unreadMessagesCount[]> => {
  const response = await axiosInstance.get(
    '/api/v1/conversation/unread-messages-count',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.formattedUnseenCountByConversation;
};
export const getUnseenMessagesCount = async (
  token: string
): Promise<number> => {
  const response = await axiosInstance.get(
    '/api/v1/conversation/unread-conversations',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.unseenCount;
};


export const markMessagesAsSeen = async (
  token: string,
  conversationId: string
) => {
  const response = await axiosInstance.put(
    `/api/v1/messages/${conversationId}/seen`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
  
};















