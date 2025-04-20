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
















