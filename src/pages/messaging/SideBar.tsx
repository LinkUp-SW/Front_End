import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  selectMessage,
  selectUserName,
  selectUserStatus,
} from "../../slices/messaging/messagingSlice";
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

const SideBar = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector(
    (state: RootState) => state.messaging.activeFilter
  );
  const search = useSelector((state: RootState) => state.messaging.search);

  /*const [deleted, setDeleted] = useState(false);*/
  const [dotAppearance, setDotAppearance] = useState<number[]>([]);
  const [unread, setUnread] = useState(false);
  const [hoveredItems, setHoveredItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [SelectedConversationStyle, setSelectedConversationStyle] =
    useState<number>();
  const [dataInfo, setDataInfo] = useState([
    {
      conversationID: 1,
      user1_id: 100,
      user2_id: 10,
      user2_name: "7amada",
      last_message_time: "1h ago",
      user1_sent_messages: {
        id: "100",
        message: " you: Lorem ipsum dolor ...",
        media: [],
        media_type: [],
        timestamp: "1h ago",
        reacted: false,
        is_seen: true,
        user1_img:
          "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        user2_img:
          "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      },
      last_message_text: "you: Lorem ipsum dolor ...",
      profileImg_user2:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      type: ["myconnections"],
      status: "offline",
    },
    {
      conversationID: 2,
      user1_id: 200,
      user2_id: 20,
      user2_name: "Ahmed",
      last_message_time: "30m ago",
      user1_sent_messages: [
        {
          id: "202",
          message: "See you at the meeting!",
          media: [],
          media_type: [],
          timestamp: "30m ago",
          reacted: true,
          is_seen: false,
          user1_img:
            "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
          user2_img:
            "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        },
      ],
      last_message_text: "See you at the meeting!",
      profileImg_user2:
        "https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg",
      type: ["inmail"],
      status: "online",
    },

    {
      conversationID: 3,
      user1_id: 300,
      user2_id: 30,
      user2_name: "Mariam",
      last_message_time: "5m ago",
      user1_sent_messages: [
        {
          id: "303",
          message: "Let's grab coffee later!",
          media: [],
          media_type: [],
          timestamp: "5m ago",
          reacted: false,
          is_seen: false,
          user1_img:
            "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
          user2_img:
            "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        },
      ],
      last_message_text: "Let's grab coffee later!",
      profileImg_user2:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      type: ["myconnections"],
      status: "offline",
    },
    {
      conversationID: 4,
      user1_id: 400,
      user2_id: 40,
      user2_name: "Sara",
      last_message_time: "10m ago",
      user1_sent_messages: [
        {
          id: "404",
          message: "Did you check the new project?",
          media: [],
          media_type: [],
          timestamp: "10m ago",
          reacted: true,
          is_seen: true,
          user1_img:
            "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
          user2_img:
            "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        },
      ],
      last_message_text: "Did you check the new project?",
      profileImg_user2:
        "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      type: ["starred"],
      status: "online",
    },
  ]);

  useEffect(() => {
    dataInfo.forEach((conversation) => {
      // Dispatch only if the conversation is starred.
      if (conversation.type.includes("starred")) {
        dispatch(toggleStarred(conversation.conversationID.toString()));
      }
    });
  }, []);
  const filterButtonData = {
    Focused: dataInfo,
    [FILTER_OPTIONS_MESSAGES.UNREAD]: dataInfo.filter((info) =>
      info.type.includes("unread")
    ),
    [FILTER_OPTIONS_MESSAGES.MY_CONNECTIONS]: dataInfo.filter((info) =>
      info.type.includes("myconnections")
    ),
    [FILTER_OPTIONS_MESSAGES.INMAIL]: dataInfo.filter((info) =>
      info.type.includes("inmail")
    ),
    [FILTER_OPTIONS_MESSAGES.STARRED]: dataInfo.filter((info) =>
      info.type.includes("starred")
    ),
  };

  const filteredMessagesSearch = filterButtonData[activeFilter].filter(
    (info) =>
      info.user2_name.toLowerCase().includes(search.toLowerCase()) ||
      info.last_message_text.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectConversation = (
    conversationID: number,
    dataType: string[],
    user2Name: string,
    userStatus: string
  ) => {
    dispatch(selectMessage(conversationID.toString()));
    dispatch(selectUserName(user2Name));
    dispatch(selectUserStatus(userStatus));
    if (dataType.includes("unread")) {
      setDataInfo((prevData) =>
        prevData.map((message) =>
          message.conversationID === conversationID
            ? {
                ...message,
                type: message.type.filter((t) => t !== "unread"),
              }
            : message
        )
      );
    }
    setSelectedConversationStyle(conversationID);
  };

  const handleHoverEnter = (conversationID: number) => {
    if (!selectedItems.includes(conversationID)) {
      setHoveredItems((prevItems) => [...prevItems, conversationID]);
    }
  };

  const handleHoverLeave = (conversationID: number) => {
    if (hoveredItems.includes(conversationID)) {
      setHoveredItems((prevItems) =>
        prevItems.filter((id) => id !== conversationID)
      );
    }
  };

  const dotHoverEnter = (conversationID: number) => {
    if (!selectedItems.includes(conversationID)) {
      setDotAppearance((prevItems) => [...prevItems, conversationID]);
    }
  };
  const dotHoverLeave = (conversationID: number) => {
    if (dotAppearance.includes(conversationID)) {
      setDotAppearance((prevItems) =>
        prevItems.filter((id) => id !== conversationID)
      );
    }
  };

  const toggleSelectedConversation = (conversationID: number) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(conversationID)
        ? prevItems.filter((id) => id !== conversationID)
        : [...prevItems, conversationID]
    );
  };

  const unreadFiltering = (conversationID: number) => {
    setDataInfo((prevData) =>
      prevData.map((message) =>
        message.conversationID === conversationID
          ? {
              ...message,
              type: message.type.includes("unread")
                ? message.type.filter((t) => t !== "unread")
                : [...message.type, "unread"],
            }
          : message
      )
    );
  };

  const starredFiltering = (conversationID: number) => {
    dispatch(toggleStarred(conversationID.toString()));

    setDataInfo((prevData) =>
      prevData.map((message) =>
        message.conversationID === conversationID
          ? {
              ...message,
              type: message.type.includes("starred")
                ? message.type.filter((t) => t !== "starred")
                : [...message.type, "starred"],
            }
          : message
      )
    );
  };

  return (
    <>
      <div className="h-full w-full border-r border-gray-200 overflow-y-auto bg-white">
        {selectedItems.length != 0 ? (
          <div className="bg-[#f3f6fa] p-3 pl-5 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
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

        <div className="divide-y divide-gray-200">
          {filteredMessagesSearch.map((data) => (
            <div
              onMouseEnter={() => dotHoverEnter(data.conversationID)}
              onMouseLeave={() => dotHoverLeave(data.conversationID)}
              onClick={() => {
                handleSelectConversation(
                  data.conversationID,
                  data.type,
                  data.user2_name,
                  data.status
                );
              }}
              key={data.conversationID}
              className={`relative flex items-start p-3 hover:cursor-pointer ${
                SelectedConversationStyle === data.conversationID
                  ? "bg-[#e6eef4] hover:bg-[#d9e5f0]"
                  : data.type.includes("unread")
                  ? "bg-[#eaf4fe] hover:bg-[#d9e5f0]"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex w-full">
                <div
                  id="conversation-section"
                  className="relative flex-shrink-0 mt-1"
                  onMouseEnter={() => handleHoverEnter(data.conversationID)}
                  onMouseLeave={() => handleHoverLeave(data.conversationID)}
                >
                  {hoveredItems.includes(data.conversationID) ||
                  selectedItems.includes(data.conversationID) ? (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <button
                        className={`w-5 h-5 flex items-center justify-center rounded border ${
                          selectedItems.includes(data.conversationID)
                            ? "bg-[#01754f] border-[#01754f]"
                            : "border-gray-400 bg-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectedConversation(data.conversationID);
                        }}
                      >
                        {selectedItems.includes(data.conversationID) && (
                          <span className="text-white text-xs font-extrabold">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>
                  ) : (
                    <img
                      id="profile-section"
                      className="rounded-full w-12 h-12 border border-gray-200"
                      src={data.profileImg_user2}
                      alt="profile"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 pl-2 pr-2">
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-sm ${
                        data.type.includes("unread")
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {data.user2_name}
                    </p>

                    {!dotAppearance.includes(data.conversationID) && (
                      <p className="text-xs text-gray-500">
                        {data.last_message_time}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 truncate mt-1 ">
                    {data.last_message_text}
                  </p>
                </div>
              </div>

              {dotAppearance.includes(data.conversationID) && (
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
                          onClick={() => unreadFiltering(data.conversationID)}
                        >
                          {data.type.includes("unread")
                            ? "Mark as read"
                            : "Mark as unread"}
                        </button>
                        <button
                          id="starred"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                          onClick={() => starredFiltering(data.conversationID)}
                        >
                          {data.type.includes("starred")
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
                        <button
                          id="delete-conversation"
                          className="block w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded"
                        >
                          Delete conversation
                        </button>
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
                {data.type.includes("starred") && (
                  <FaStar id="star" size={15} className="text-[#c37d16]" />
                )}

                {data.type.includes("unread") && (
                  <span className="flex items-center justify-center text-xs rounded-full text-white w-4 h-4 bg-blue-600 font-medium">
                    1
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
