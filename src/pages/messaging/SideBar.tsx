import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  selectMessage,
  selectUserName,
  selectUserStatus,
  selectUserId,
  setResponsiveIsSidebar,
  setDataInfo
} from "../../slices/messaging/messagingSlice";
import { incomingUnreadMessagesCount} from "@/services/socket";
import { toggleStarred } from "../../slices/messaging/messagingSlice";
import * as Popover from "@radix-ui/react-popover";
import { FaStar } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { MdOutlineMarkAsUnread } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { FILTER_OPTIONS_MESSAGES } from "../../constants/index.ts";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components";

import {
  getAllConversations,
  deleteConversation,
  getUnseenMessagesCountByConversation,
  markConversationAsRead,
  markConversationAsUnread,
} from "@/endpoints/messaging";
import Cookies from "js-cookie";
import { Conversation } from "@/endpoints/messaging";
import { toast } from "sonner";
import { socketService } from "@/services/socket";
import LinkUpLoader from "../../components/linkup_loader/LinkUpLoader";
import { useParams } from "react-router-dom";

const SideBar = () => {
  const { id } = useParams();
  const token = Cookies.get("linkup_auth_token");

  const dispatch = useDispatch();
  const activeFilter = useSelector(
    (state: RootState) => state.messaging.activeFilter
  );
  const search = useSelector((state: RootState) => state.messaging.search);

  /*const [deleted, setDeleted] = useState(false);*/
  const [dotAppearance, setDotAppearance] = useState<string[]>([]);
  const [unread, setUnread] = useState(false);
  const [hoveredItems, setHoveredItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [SelectedConversationStyle, setSelectedConversationStyle] =
    useState<string>();

  // const [dataInfo, setDataInfo] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );
  const dataInfo = useSelector((state: RootState) => state.messaging.setDataInfo);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!token) return;

        const data: { conversations: Conversation[] } =
          await getAllConversations(token);
          dispatch(setDataInfo(data.conversations));
        toast.success("Conversations loaded successfully");
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        toast.error("Failed to load Conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);



  useEffect(() => {
    dataInfo.forEach((conversation) => {
      // Dispatch only if the conversation is starred.
      if (conversation.conversationType.includes("starred")) {
        dispatch(toggleStarred(conversation.conversationId.toString()));
      }
    });
  }, [dataInfo]);

  useEffect(() => {
    const handleUserOnline = (incoming: { userId: string }) => {
      if (incoming.userId !== id) {
        const updatedData = dataInfo.map((conversation) =>
          conversation.otherUser.userId === incoming.userId
            ? {
                ...conversation,
                otherUser: {
                  ...conversation.otherUser,
                  onlineStatus: true,
                },
              }
            : conversation
        );
        dispatch(setDataInfo(updatedData));
      }
    };
  
    const handleUserOffline = (incoming: { userId: string }) => {
      if (incoming.userId !== id) {
        const updatedData = dataInfo.map((conversation) =>
          conversation.otherUser.userId === incoming.userId
            ? {
                ...conversation,
                otherUser: {
                  ...conversation.otherUser,
                  onlineStatus: false,
                },
              }
            : conversation
        );
        dispatch(setDataInfo(updatedData));
      }
    };
  
    socketService.on("user_online", handleUserOnline);
    socketService.on("user_offline", handleUserOffline);
  
    return () => {
      socketService.off("user_online", handleUserOnline);
      socketService.off("user_offline", handleUserOffline);
    };
  }, [id]);
  

  useEffect(() => {
    const unsubscribe = socketService.on<incomingUnreadMessagesCount>(
      "conversation_unread_count",
      (incoming) => {
        console.log("haneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet")
          const updatedData = dataInfo.map((message) =>
            message.conversationId === incoming.conversationId
              ? {
                  ...message,
                  unreadCount: incoming.count,
                  conversationType: incoming.count > 0 
                    ? message.conversationType.includes("Unread") 
                      ? message.conversationType 
                      : [...message.conversationType, "Unread"]
                    : message.conversationType
                }
              : message
          );
          dispatch(setDataInfo(updatedData));
      }
    );
  
    return () => {
      unsubscribe();
    };
  }, []);

  const filterButtonData = {
    Focused: dataInfo,
    [FILTER_OPTIONS_MESSAGES.UNREAD]: dataInfo.filter((info) =>
      info.conversationType.includes("Unread")
    ),
    [FILTER_OPTIONS_MESSAGES.MY_CONNECTIONS]: dataInfo.filter((info) =>
      info.conversationType.includes("myconnections")
    ),
    [FILTER_OPTIONS_MESSAGES.INMAIL]: dataInfo.filter((info) =>
      info.conversationType.includes("inmail")
    ),
    [FILTER_OPTIONS_MESSAGES.STARRED]: dataInfo.filter((info) =>
      info.conversationType.includes("starred")
    ),
  };

  if (loading)
    return (
      <div>
        <LinkUpLoader />
      </div>
    );

  const filteredMessagesSearch = filterButtonData[activeFilter].filter(
    (info) =>
      info.otherUser.firstName.toLowerCase().includes(search.toLowerCase()) ||
      info.lastMessage.message.toLowerCase().includes(search.toLowerCase())
  );

  // In SideBar.tsx, update the handleSelectConversation function
  const handleSelectConversation = async (
    conversationID: string,
    dataType: string[],
    user2Name: string,
    userStatus: boolean,
    user2Id: string
  ) => {
    dispatch(selectMessage(conversationID.toString()));
    dispatch(selectUserName(user2Name));
    dispatch(selectUserStatus(userStatus));
    dispatch(selectUserId(user2Id));
    dispatch(setResponsiveIsSidebar(true));

    // If this conversation has unread messages
    if (dataType.includes("Unread")) {
      if (token) {
        try {
          await markConversationAsRead(token, conversationID); // API call first

          // On success, update local state and show toast
          const updatedData = dataInfo.map((message) =>
            message.conversationId === conversationID
              ? {
                  ...message,
                  conversationType: message.conversationType.filter(
                    (t) => t !== "Unread"
                  ),
                  unreadCount: 0,
                }
              : message
          );
          dispatch(setDataInfo(updatedData));
          toast.success("Conversation marked as read");
        } catch (err) {
          console.error("Failed to mark conversation as read:", err);
          toast.error("Failed to mark conversation as read");
        }
      }
    }

    setSelectedConversationStyle(conversationID);
  };

  const handleHoverEnter = (conversationID: string) => {
    if (!selectedItems.includes(conversationID)) {
      setHoveredItems((prevItems) => [...prevItems, conversationID]);
    }
  };

  const handleHoverLeave = (conversationID: string) => {
    if (hoveredItems.includes(conversationID)) {
      setHoveredItems((prevItems) =>
        prevItems.filter((id) => id !== conversationID)
      );
    }
  };

  const dotHoverEnter = (conversationID: string) => {
    if (!selectedItems.includes(conversationID)) {
      setDotAppearance((prevItems) => [...prevItems, conversationID]);
    }
  };
  const dotHoverLeave = (conversationID: string) => {
    if (dotAppearance.includes(conversationID)) {
      setDotAppearance((prevItems) =>
        prevItems.filter((id) => id !== conversationID)
      );
    }
  };

  const toggleSelectedConversation = (conversationID: string) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(conversationID)
        ? prevItems.filter((id) => id !== conversationID)
        : [...prevItems, conversationID]
    );
  };

  const unreadFiltering = async (conversationID: string) => {
    try {
      await markConversationAsUnread(token!, conversationID);
      const updatedData = dataInfo.map((message) =>
        message.conversationId === conversationID
          ? {
              ...message,
              conversationType: message.conversationType.includes("Unread")
                ? message.conversationType.filter((t) => t !== "Unread")
                : [...message.conversationType, "Unread"],
            }
          : message
      );
      dispatch(setDataInfo(updatedData));
      toast.success("Conversation marked as unread");
    } catch (err) {
      console.error("Error marking as unread:", err);
      toast.error("Failed to mark conversation as unread");
    }
  };

  const starredFiltering = (conversationID: string) => {
    dispatch(toggleStarred(conversationID.toString()));

    const updatedData = dataInfo.map((message) =>
      message.conversationId === conversationID
        ? {
            ...message,
            conversationType: message.conversationType.includes("starred")
              ? message.conversationType.filter((t) => t !== "starred")
              : [...message.conversationType, "starred"],
          }
        : message
    );
    dispatch(setDataInfo(updatedData));
  };

  const handlingDeleteConv = async (conversationID: string) => {
    try {
      await deleteConversation(token!, conversationID);
      const updatedData = dataInfo.filter(
        (conv) => conversationID !== conv.conversationId
      );
      dispatch(setDataInfo(updatedData));
      toast.success("Conversation deleted");
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        {selectedItems.length != 0 ? (
          <div className="bg-[#f3f6fa] p-3 pl-5 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
            <div className="flex items-center">
              <IoIosClose
                size={30}
                className="inline-block hover:cursor-pointer hover:bg-gray-200 hover:rounded-full p-1 mr-2"
                onClick={() => {
                  setSelectedItems([]);
                  setHoveredItems([]);
                }}
              />

              <span className="text-sm font-medium">
                {selectedItems.length} selected
              </span>
            </div>

            <div className="flex items-center">
              <button className="p-1 mx-1 hover:bg-gray-200 rounded-full">
                <MdOutlineMarkAsUnread
                  size={22}
                  className="text-gray-600"
                  onClick={() => setUnread(!unread)}
                />
              </button>
              <button className="p-1 mx-1 hover:bg-gray-200 rounded-full">
                <MdOutlineDelete size={22} className="text-gray-600" />
              </button>
              <button className="p-1 mx-1 hover:bg-gray-200 rounded-full">
                <IoArchiveOutline size={22} className="text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
          {filteredMessagesSearch.map((data) => (
            <div
              onMouseEnter={() => dotHoverEnter(data.conversationId)}
              onMouseLeave={() => dotHoverLeave(data.conversationId)}
              onClick={() => {
                handleSelectConversation(
                  data.conversationId,
                  data.conversationType,
                  data.otherUser.firstName,
                  data.otherUser.onlineStatus,
                  data.otherUser.userId
                );
              }}
              key={data.conversationId}
              className={`relative flex items-start p-4 hover:cursor-pointer ${
                SelectedConversationStyle === data.conversationId
                  ? "bg-[#e6eef4] hover:bg-[#d9e5f0]"
                  : data.conversationType.includes("Unread")
                  ? "bg-[#eaf4fe] hover:bg-[#d9e5f0]"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex w-full">
                <div
                  id="conversation-section"
                  className="relative flex-shrink-0 mt-1"
                  onMouseEnter={() => handleHoverEnter(data.conversationId)}
                  onMouseLeave={() => handleHoverLeave(data.conversationId)}
                >
                  {hoveredItems.includes(data.conversationId) ||
                  selectedItems.includes(data.conversationId) ? (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <button
                        className={`w-5 h-5 flex items-center justify-center rounded border ${
                          selectedItems.includes(data.conversationId)
                            ? "bg-[#01754f] border-[#01754f]"
                            : "border-gray-400 bg-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectedConversation(data.conversationId);
                        }}
                      >
                        {selectedItems.includes(data.conversationId) && (
                          <span className="text-white text-xs font-extrabold">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-12 h-12">
                      <img
                        id="profile-section"
                        className="rounded-full w-12 h-12 border  border-gray-200"
                        src={data.otherUser.profilePhoto}
                        alt="profile"
                      />
                      {data.otherUser.onlineStatus && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#01754f] border-2 border-white rounded-full"></span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pl-2 pr-2">
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-sm ${
                        data.conversationType.includes("Unread")
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {data.otherUser.firstName} {data.otherUser.lastName}
                    </p>

                    {!dotAppearance.includes(data.conversationId) && (
                      <p className="text-xs text-gray-500">
                        {data.lastMessage?.timestamp
                          ? new Date(
                              data.lastMessage.timestamp
                            ).toLocaleString()
                          : "No messages yet"}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 truncate mt-1 ">
                    {data.lastMessage?.message || ""}
                  </p>
                </div>
              </div>

              {dotAppearance.includes(data.conversationId) && (
                <div className="absolute top-3 right-3">
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
                          id="move-to-other"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                        >
                          Move to Other
                        </button>
                        <button
                          id="label-as-jobs"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                        >
                          Label as Jobs
                        </button>
                        <button
                          id="unread"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                          onClick={() => unreadFiltering(data.conversationId)}
                        >
                          {data.conversationType.includes("Unread")
                            ? "Mark as read"
                            : "Mark as unread"}
                        </button>
                        <button
                          id="starred"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                          onClick={() => starredFiltering(data.conversationId)}
                        >
                          {data.conversationType.includes("starred")
                            ? "Remove Star"
                            : "Star"}
                        </button>
                        <button
                          id="mute"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                        >
                          Mute
                        </button>
                        <button
                          id="archive"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                        >
                          Archive
                        </button>
                        <div>
                          <button
                            id="delete-conversation"
                            className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                            onClick={openModal}
                          >
                            Delete conversation
                          </button>
                          {isOpen && (
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Delete conversation from your inbox
                                  </DialogTitle>
                                  <DialogDescription>
                                    This conversation will be deleted
                                    permanently.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <button
                                    onClick={closeModal}
                                    className="btn btn-cancel"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      handlingDeleteConv(data.conversationId);
                                      closeModal();
                                    }}
                                    className="bg-blue-700 text-white rounded-md p-2"
                                  >
                                    Delete
                                  </button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>

                        <button
                          id="manage-settings"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                        >
                          Manage settings
                        </button>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
              )}

              <div className="absolute bottom-1 right-4 flex space-x-1">
                {data.conversationType.includes("starred") && (
                  <FaStar id="star" size={15} className="text-[#c37d16]" />
                )}

                {data.conversationType.includes("Unread") &&
                  data.unreadCount > 0 && (
                    <span className="flex items-center justify-center text-xs rounded-full text-white w-4 h-4 bg-blue-600 font-medium">
                      {data.unreadCount}
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
