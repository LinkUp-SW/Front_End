import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import * as Popover from "@radix-ui/react-popover";
import { FaStar } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getConversation,
  chattingMessages,
  deleteMessages,
  MessageChat,
} from "@/endpoints/messaging";
import {
  setEditingMessageId,
  setEditText,
} from "../../slices/messaging/messagingSlice";
import { toast } from "sonner";
import { socketService } from "@/services/socket";
import {
  SocketIncomingMessage,
  incomingTypingIndicator,
} from "@/services/socket";
import { useParams } from "react-router-dom";

const ChatingScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = Cookies.get("linkup_auth_token");
  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );

  const user2Name = "testUser";
  const user2Img =
    "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg";
  /* const user2Name = useSelector(
    (state: RootState) => state.messaging.user2Name
  );

  const userStatus = useSelector(
    (state: RootState) => state.messaging.userStatus
  );*/
  // Find conversation based on selected ID
  /*const conversation = useSelector((state: RootState) =>
    state.messaging.conversations.find(
      (conv) => conv.conversationID === selectedConvID
    )
  );*/

  const starredConversations = useSelector(
    (state: RootState) => state.messaging.starredConversations
  );

  const isCurrentConversationStarred =
    starredConversations.includes(selectedConvID);

  /*const messages = conversation ? conversation.user1_sent_messages : [];*/
  const [dataChat, setChatData] = useState<chattingMessages>();
  const [loading, setLoading] = useState<boolean>(true);
  const [msgDeleted, setMsgDeleted] = useState<boolean>(false);
  const [isTyping, setIsTyping] =
    useState(false); /*related to typing indicator (sockets) */

  useEffect(() => {
    const fetchChatting = async () => {
      try {
        const token = Cookies.get("linkup_auth_token");
        if (!token) return;

        const res = await getConversation(token, selectedConvID);
        setChatData(res);
        toast.success("Messages loaded successfully");
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        toast.error("Failed to load Messages");
      } finally {
        setLoading(false);
      }
    };

    fetchChatting();
  }, [selectedConvID]);
  useEffect(() => {
    if (msgDeleted) {
      // set it back to false right after render
      setMsgDeleted(false);
    }
  }, [msgDeleted]);
  useEffect(() => {
    const unsubscribeT = socketService.on<incomingTypingIndicator>(
      "user_typing",
      (incomingTyping) => {
        if (
          incomingTyping.conversationId === selectedConvID &&
          incomingTyping.userId !== id
        ) {
          setIsTyping(true);
        }
      }
    );

    const unsubscribeS = socketService.on<incomingTypingIndicator>(
      "user_stop_typing",
      (incomingStop) => {
        if (
          incomingStop.conversationId === selectedConvID &&
          incomingStop.userId !== id
        ) {
          setIsTyping(false);
        }
      }
    );

    return () => {
      unsubscribeT();
      unsubscribeS();
    };
  }, [selectedConvID, id]);

  useEffect(() => {
    const unsubscribe = socketService.on<SocketIncomingMessage>(
      "new_message",
      (incoming) => {
        if (incoming.conversationId !== selectedConvID) return;

        const newMsg: MessageChat = {
          messageId: Date.now().toString(), // temp ID
          senderId: incoming.senderId,
          senderName:
            incoming.senderId === id
              ? "You"
              : dataChat?.otherUser?.firstName || "",
          message: incoming.message.message,
          media: incoming.message.media || [],
          timestamp: incoming.message.timestamp,
          reacted: false,
          isSeen: incoming.message.is_seen,
          isOwnMessage: incoming.senderId === id, // Compare with your user ID
        };

        setChatData(
          (prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...prev.messages, newMsg],
                }
              : prev // or null-safe fallback
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedConvID, dataChat, id]);
  if (loading) return <div>Loading...</div>;

  const shouldShowProfile = (index: number) => {
    if (index === 0) return true;
    if (!dataChat) return true;
    const prevMessage = dataChat.messages[index - 1];
    const currentMessage = dataChat.messages[index];

    if (!prevMessage || !currentMessage) return true;
    if (prevMessage.senderId !== currentMessage.senderId) return true;

    const prevTime = new Date(prevMessage.timestamp).getTime();
    const currentTime = new Date(currentMessage.timestamp).getTime();

    if (currentTime - prevTime > 5 * 60 * 1000) {
      return true;
    } else {
      return false;
    }
  };

  const handlingDeleteMsg = async (convId: string, msgId: string) => {
    try {
      await deleteMessages(token!, convId, msgId);
      setChatData((prev) => ({
        ...prev!,
        messages: prev!.messages.filter((msg) => msg.messageId !== msgId),
      }));
      setMsgDeleted(true);
      toast.success("Message deleted");
    } catch (err) {
      console.log("Error deleting:", err);
      toast.error("Failed to delete message");
    }
  };

  return (
    <>
      <div className=" flex flex-col h-full overflow-hidden">
        {/* Chat Header */}

        <div className=" border border-[#e8e8e8] flex justify-between items-center px-3 py-3 flex-shrink-0">
          {dataChat?.otherUser && (
            <div>
              <p id="userName" className="font-semibold">
                {dataChat?.otherUser.firstName} {dataChat?.otherUser.lastName}
              </p>
              <p id="userStatuse" className="text-xs text-gray-500">
                {dataChat.otherUser.onlineStatus ? "Online" : "Offine"}
              </p>
            </div>
          )}
          <div className="flex space-x-4">
            <HiOutlineDotsHorizontal
              id="dots-chat"
              size={25}
              className="hover:rounded-full hover:bg-gray-200 hover:cursor-pointer"
            />
            {isCurrentConversationStarred ? (
              <FaStar
                id="star"
                size={25}
                className="hover:rounded-full hover:cursor-pointer text-[#c37d16]"
              />
            ) : (
              <IoIosStarOutline
                id="unfilled-star"
                size={25}
                className="hover:rounded-full hover:cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div className="border border-[#e8e8e8] overflow-y-auto p-3 flex-1">
          {Array.isArray(dataChat?.messages) &&
          dataChat?.messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            dataChat?.messages?.map((msg, index) => (
              <div>
                {shouldShowProfile(index) ? (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <img
                        id="user-img"
                        className="rounded-full w-10 h-10"
                        src={
                          msg.isOwnMessage
                            ? user2Img
                            : dataChat.otherUser.profilePhoto
                        }
                        alt="Profile"
                      />
                      <p id="user-name" className="pl-3 font-semibold">
                        {msg.isOwnMessage
                          ? user2Name
                          : `${dataChat.otherUser.firstName} ${dataChat.otherUser.lastName}`}
                        <span className="text-xs text-gray-500">
                          {" "}
                          · {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                    <div>
                      
                      {msgDeleted ? (
                        <div>This message has been deleted.</div>
                      ) : (
                        <div className="w-full hover:bg-gray-200 pl-14 hover:cursor-pointer flex justify-between ">
                          <div>{msg.message}</div>
                          <div>
                            <Popover.Root>
                              <Popover.Trigger asChild>
                                <button
                                  id="dots-btn"
                                  className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                  <HiOutlineDotsHorizontal
                                    size={15}
                                    className="text-gray-500"
                                  />
                                </button>
                              </Popover.Trigger>
                              <Popover.Portal>
                                <Popover.Content
                                  className="bg-white shadow-lg rounded-lg p-1 w-56 border border-gray-200 z-20"
                                  sideOffset={5}
                                >
                                  <button
                                    id="forward"
                                    className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                                  >
                                    Forward
                                  </button>
                                  <button
                                    id="share-via-email"
                                    className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                                  >
                                    Share via email
                                  </button>
                                  <button
                                    id="delete"
                                    className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                                    onClick={() => {
                                      handlingDeleteMsg(
                                        selectedConvID,
                                        msg.messageId
                                      );
                                    }}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    id="edit"
                                    className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                                    onClick={() => {
                                      dispatch(
                                        setEditingMessageId(msg.messageId)
                                      );
                                      dispatch(setEditText(msg.message));
                                    }}
                                  >
                                    Edit
                                  </button>
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>

                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full hover:bg-gray-200 pl-14 hover:cursor-pointer ">
                    {msg.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {/* Typing Indicator */}
        {isTyping && (
          <span className="p-2 text-gray-500 italic w-full pl-14 border-0  "> Typing...</span>
        )}
      </div>
    </>
  );
};

export default ChatingScreen;
