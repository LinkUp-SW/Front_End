import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Import RootState from store.ts
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosStarOutline } from "react-icons/io";

/* import { useState ,useEffect} from "react";
import {getChattingMessages, sendMessage} from "../endpoints/messaging"
 */
/* interface Message{
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
 */

const ChatingScreen = () => {
  /* const [Messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const conversationId = "conv-1"; // Example conversation
    const senderId = "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d";


    useEffect(()=>{
        const loadMessages=async()=>{
            try{
                const data=await getChattingMessages(conversationId);
                setMessages(data);
            }
            catch(error){
                console.error("Error fetching messages:", error)
            }
        }
        loadMessages();
    },[])

    const handleSending= async()=>{
        try{
            const message=await sendMessage(conversationId, senderId, newMessage)
            setMessages((prevMessages)=>[...prevMessages,message]);
            setNewMessage("");
        }
        catch(error)
        {
            console.error("Error fetching messages:", error);
        }
    }
 */

  const messages = useSelector((state: RootState) => state.messaging.messages);
  return (
    <>
      <div className="h-1/2   ">
        <div className="h-1/5 border-1 border-[#e8e8e8] flex justify-between items-center ">
        <div >
            <p className="pl-3">First Last</p>
            <p className="text-xs pl-3">Active now</p>
        </div>

        <div className="mr-3">
        <HiOutlineDotsHorizontal size={30} className="inline-block ml-3" />
        <IoIosStarOutline size={30} className="inline-block ml-3" />
        </div>


        </div>

        <div className="h-4/5 border-1 border-[#e8e8e8] overflow-y-auto  ">
         {messages.map((msg)=>(
          
          <div>
            <div className="flex mt-1">
              <div className="rounded-full w-12 h-12 bg-gray-100 inline-block">
                
              </div>
              <p className="ml-2 mt-2 font-semibold">{msg.name} <span className=" font-light text-xs text-gray-500">. {msg.date}</span></p>
              </div>
          <div className="pl-20 hover:bg-gray-200">
            {msg.message}
          </div>
          </div>
         )
        )} 
        </div>
      </div>
    </>
  );
};
export default ChatingScreen;
