/* //add here any needed function that will fetch from an endpoint
import axios from "axios";


interface Message{
    id: string;               // Unique message ID
    conversationId: string;   // ID of the conversation this message belongs to
    senderId: string;         // ID of the user who sent the message
    text: string;             // Message content (can be empty if it's an attachment)
    timestamp: string;        // Time the message was sent (ISO format)
    messageType: "text" | "image" | "video" | "document" | "audio" | "sticker"; // Type of message
    attachments?: string[];   // URLs of attached files (if any)
    status: "sent" | "delivered" | "read"; // Message status
    isDeleted?: boolean;      // Indicates if the message was deleted
  
  }


  export const getChattingMessages = async (id: string): Promise<Message[]> => {
    try {
      const BASE_URL =
        import.meta.env.VITE_NODE_ENV !== "PROD"
          ? "/get-messages-on-screen"
          : "actual api endpoint";
  
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        throw new Error(error.response?.statusText || "Failed to fetch user info");
      }
      throw new Error("Unexpected error occurred");
    }
  };
  

  export const sendMessage= async(conversationId: string, senderId: string, text: string): Promise<Message>=>{

    try {
        const response = await axios.post(
          import.meta.env.VITE_NODE_ENV === "DEV"
            ? "/send-message"
            : "actual_api/messages/send",
          { conversationId, senderId, text }
        );
        return response.data;
      } 
      
    catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    };
   */