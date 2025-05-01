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
  deleteMessages,
  MessageChat,
} from "@/endpoints/messaging";
import {
  setEditingMessageId,
  setEditText,
  setChatData,
} from "../../slices/messaging/messagingSlice";
import { toast } from "sonner";
import { socketService } from "@/services/socket";
import {
  SocketIncomingMessage,
  incomingTypingIndicator,
  incomingMessageRead,
} from "@/services/socket";
import { useParams } from "react-router-dom";
import LinkUpLoader from "../../components/linkup_loader/LinkUpLoader";

const ChatingScreen = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const token = Cookies.get("linkup_auth_token");
  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );
  const userBioState = useSelector((state: RootState) => state.userBio.data);
  const starredConversations = useSelector(
    (state: RootState) => state.messaging.starredConversations
  );

  const user2Name = `${userBioState?.bio.first_name || ""} ${userBioState?.bio.last_name || ""}`.trim();
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

 

  const isCurrentConversationStarred =
    starredConversations.includes(selectedConvID);

  const dataChat = useSelector((state: RootState) => state.messaging.chatData);
  const dataInfo = useSelector(
    (state: RootState) => state.messaging.setDataInfo
  );
  const editedMessageIds = useSelector(
    (state: RootState) => state.messaging.setEditedMessageIds
  );

  /*const messages = conversation ? conversation.user1_sent_messages : [];*/
  const [loading, setLoading] = useState<boolean>(true);

  const [deletedMessageIds, setDeletedMessageIds] = useState<string[]>([]);

  const [isTyping, setIsTyping] =
    useState<boolean>(false); /*related to typing indicator (sockets) */

  useEffect(() => {
    const fetchChatting = async () => {
      try {
        const token = Cookies.get("linkup_auth_token");
        if (!token) return;

        const res = await getConversation(token, selectedConvID);
        dispatch(setChatData(res));
        socketService.markAsRead(selectedConvID);
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
    if (!selectedConvID) return;

    const interval = setInterval(() => {
      socketService.markAsRead(selectedConvID);
    }, 3000); // every 3 seconds (adjust as needed)

    return () => {
      clearInterval(interval); // cleanup on unmount or selectedConvID change
    };
  }, [selectedConvID]);

  useEffect(() => {
    const unsubscribe = socketService.on<incomingMessageRead>(
      "messages_read",
      (incoming) => {
        if (
          incoming.conversationId === selectedConvID &&
          incoming.readBy !== id
        ) {
          dispatch(
            setChatData({
              ...dataChat!,
              messages: dataChat!.messages.map((msg) =>
                msg.senderId === id ? { ...msg, isSeen: true } : msg
              ),
            })
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedConvID, id, dataChat]);

  useEffect(() => {
    const unsubscribe = socketService.on<SocketIncomingMessage>(
      "new_message",
      (incoming) => {
        if (incoming.conversationId !== selectedConvID) return;

        const realMsg: MessageChat = {
          messageId: incoming.message.messageId,
          senderId: incoming.senderId,
          senderName:
            incoming.senderId === id
              ? (userBioState?.bio.first_name || "") + " " + (userBioState?.bio.last_name || "")
              : dataChat?.otherUser?.firstName || "",
          message: incoming.message.message,
          media: incoming.message.media || [],
          timestamp: incoming.message.timestamp,
          reacted: false,
          isSeen: incoming.message.is_seen,
          isOwnMessage: incoming.senderId === id,
          isDeleted: false,
          isEdited: false,
        };

        const updatedMessages = [...(dataChat?.messages || [])];

        // 1. Try replacing temporary message
        const tempIndex = updatedMessages.findIndex(
          (msg) =>
            msg.messageId.startsWith("temp-") &&
            msg.senderId === realMsg.senderId &&
            msg.message === realMsg.message
        );

        if (tempIndex !== -1) {
          updatedMessages[tempIndex] = realMsg;
        } else {
          // 2. If not duplicate, just push
          const alreadyExists = updatedMessages.some(
            (msg) => msg.messageId === realMsg.messageId
          );
          if (!alreadyExists) updatedMessages.push(realMsg);
        }

        dispatch(
          setChatData({
            ...dataChat!,
            messages: updatedMessages,
          })
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedConvID, dataChat, id]);

  // Add this to your ChatingScreen component

  if (loading)
    return (
      <div>
        <LinkUpLoader />
      </div>
    );

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
      setDeletedMessageIds((prev) => [...prev, msgId]);
      dispatch(
        setChatData({
          ...dataChat,
          messages: dataChat.messages.map((msg) =>
            msg.messageId === msgId ? { ...msg, isDeleted: true } : msg
          ),
        })
      );

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
              <p
                id="userStatuse"
                className="text-xs text-gray-500 flex items-center gap-1"
              >
                {/* Replace the existing online status code with this */}
                {dataInfo.find((conv) => conv.conversationId === selectedConvID)
                  ?.otherUser.onlineStatus && (
                  <span className="inline-block w-2 h-2 bg-[#01754f] rounded-full"></span>
                )}
                {dataInfo.find((conv) => conv.conversationId === selectedConvID)
                  ?.otherUser.onlineStatus
                  ? "Online"
                  : "Offline"}
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
            dataChat?.messages?.map((msg, index) => {
              const isDeleted =
                msg.isDeleted || deletedMessageIds.includes(msg.messageId);
              const isEdited =
                msg.isEdited || editedMessageIds.includes(msg.messageId);
              const showProfile = shouldShowProfile(index);
              const messageTime = new Date(msg.timestamp).toLocaleTimeString();
              const profilePhoto = msg.isOwnMessage
                ? user2Img
                : dataChat.otherUser.profilePhoto;
              const userName = msg.isOwnMessage
                ? user2Name
                : `${dataChat.otherUser.firstName} ${dataChat.otherUser.lastName}`;

              return (
                <div key={index}>
                  {/* Profile Section - Conditionally rendered */}
                  {showProfile && (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <img
                          id="user-img"
                          className="rounded-full w-10 h-10"
                          src={profilePhoto}
                          alt="Profile"
                        />
                        <p id="user-name" className="pl-3 font-semibold">
                          {userName}
                          <span className="text-xs text-gray-500">
                            {" "}
                            · {messageTime}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={`w-full hover:bg-gray-200 ${
                      showProfile ? "pl-14" : "pl-14"
                    } hover:cursor-pointer flex justify-between`}
                  >
                    <div>
                      {isDeleted ? (
                        <div className="pr-2 pl-2 bg-gray-100 rounded-lg  break-words">
                          This message has been deleted.
                        </div>
                      ) : (
                        <>
                          {msg.message}
                          {isEdited && (
                            <span className="text-s text-gray-500  pl-2">
                              (Edited)
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Three dots menu - always visible */}
                    {!isDeleted && (
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
                              {msg.isOwnMessage && (
                                <>
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
                                </>
                              )}
                            </Popover.Content>
                          </Popover.Portal>
                        </Popover.Root>
                      </div>
                    )}
                  </div>

                  {/* Seen indicator */}
                  {msg.isOwnMessage && msg.isSeen && (
                    <div className="pl-14 mt-1 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-300">
                        <img
                          src={dataChat.otherUser.profilePhoto}
                          alt="Read by"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-500">Seen</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* Typing Indicator */}
        {isTyping && (
          <span className="p-2 text-gray-500 italic w-full pl-14 border-0  ">
            {" "}
            Typing...
          </span>
        )}
        {/* {chatRead && (
          <span className="p-2 text-gray-500 italic w-full pl-14 border-0  "> seen</span>
        )} */}
      </div>
    </>
  );
};

export default ChatingScreen;
