import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectMessage } from "../../slices/messaging/messagingSlice";
import * as Popover from "@radix-ui/react-popover";
import { FaStar } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaCheckSquare } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineMarkAsUnread } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { FILTER_OPTIONS_MESSAGES } from "../../constants/index.ts";
import { useState } from "react";

const SideBar = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector(
    (state: RootState) => state.messaging.activeFilter
  );
  const search = useSelector((state: RootState) => state.messaging.search);

  const [deleted, setDeleted] = useState(false);
  const [unread, setUnread] = useState(false);
  const [hoveredItems, setHoveredItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [SelectedConversationStyle, setSelectedConversationStyle] =
    useState<number>();
  const [dataInfo, setDataInfo] = useState([
    {
      conversationID: 1,
      recieverID: 1,
      senderID: 10,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      messages: {
        id: 100,
        Img: "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        name: "Mohanad Tarek",
        message: " you: Lorem ipsum dolor ...",
        date: "1h ago",
      },
      type: ["myconnections"],
    },
    {
      conversationID: 2,
      recieverID: 2,
      senderID: 11,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      messages: {
        id: 3,
        Img: "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        name: "Aly Mohamed unread",
        message: " you: Lorem ipsum dolor ...",
        date: "2h ago",
        type: ["unread"],
      },
      type: ["inmail"],
    },
    {
      conversationID: 3,
      recieverID: 3,
      senderID: 13,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      messages: {
        id: 103,
        Img: "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        name: "Mohanad Tarek",
        message: " you: Lorem ipsum dolor ...",
        date: "2h ago",
      },
      type: ["myconnections"],
    },
    {
      conversationID: 4,
      recieverID: 4,
      senderID: 14,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      messages: {
        id: 104,
        Img: "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        name: "Amr Doma",
        message: " you: Lorem ipsum dolor ...",
        date: "2h ago",
      },
      type: ["starred"],
    },
    {
      conversationID: 5,
      recieverID: 5,
      senderID: 15,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      messages: {
        id: 105,
        Img: "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        name: "Amr Doma2",
        message: " you: Lorem ipsum dolor ...",
        date: "2h ago",
      },
      type: ["starred"],
    },
  ]);

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
      info.messages.name.toLowerCase().includes(search.toLowerCase()) ||
      info.messages.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectConversation = (
    conversationID: number,
    dataType: string[]
  ) => {
    dispatch(selectMessage(conversationID.toString()));
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
      <div className="h-full w-2/5 border-1 border-[#e8e8e8] overflow-y-auto ">
        {selectedItems.length != 0 ? (
          <div className="bg-[#f7f9fc] p-3 pl-5 flex justify-between">
            <div>
              <IoIosClose
                size={30}
                className="inline-block hover:cursor-pointer hover:bg-gray-200 hover:rounded-full"
                onClick={() => {
                  setSelectedItems([]);
                  setHoveredItems([]);
                }}
              />
              <span>{selectedItems.length} selected</span>
            </div>
            <div>
              <MdOutlineMarkAsUnread
                size={25}
                className="inline-block mr-3 hover:cursor-pointer  hover:bg-gray-200 hover:rounded-full"
                onClick={() => setUnread(!unread)}
              />
              <MdOutlineDelete
                size={25}
                className="inline-block mr-3 hover:cursor-pointer hover:bg-gray-200 hover:rounded-full"
                onClick={() => setDeleted(true)}
              />
              <IoArchiveOutline
                size={25}
                className="inline-block mr-3 hover:cursor-pointer hover:bg-gray-200 hover:rounded-full"
              />
            </div>
          </div>
        ) : (
          ""
        )}

        {filteredMessagesSearch.map((data) => (
          <button
            onClick={() => {
              handleSelectConversation(data.conversationID, data.type);
            }}
            key={data.conversationID}
            className={`relative flex h-1/5 w-full items-center p-3 border-1 border-[#e8e8e8] hover:cursor-pointer ${
              SelectedConversationStyle === data.conversationID
                ? "bg-[#edf3f8] hover:bg-gray-300"
                : data.type.includes("unread")
                ? "bg-[#d7e8fa]  hover:bg-[#b1d1fffe]"
                : " hover:bg-gray-300"
            }`}
          >
            <div className="flex">
              <div
                className="relative inset-0 rounded-full w-12 h-12 bg-gray-100"
                onMouseEnter={() => handleHoverEnter(data.conversationID)}
                onMouseLeave={() => handleHoverLeave(data.conversationID)}
              >
                {hoveredItems.includes(data.conversationID) ||
                selectedItems.includes(data.conversationID) ? (
                  <button
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-md w-6 h-6 border hover:border-2 hover:bg-gray-200 hover:cursor-pointer"
                    onClick={() =>
                      toggleSelectedConversation(data.conversationID)
                    }
                  >
                    {selectedItems.includes(data.conversationID) ? (
                      <FaCheckSquare className="bg-white text-green-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-md w-6 h-6 border hover:border-2" />
                    ) : (
                      ""
                    )}
                  </button>
                ) : (
                  <img
                    className="rounded-full w-12 h-12 "
                    src={data.profileImg}
                    alt="profile"
                  />
                )}
              </div>

              <div className="flex-1 p-3 text-left pt-0">
                <p className="font-semibold text-sm">{data.messages.name}</p>
                <p className="text-xs text-gray-600 truncate">
                  {data.messages.message}
                </p>
              </div>
            </div>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="absolute top-2 right-3 text-xs text-gray-600">
                  <HiOutlineDotsHorizontal
                    size={15}
                    className="inline-block ml-3"
                  />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="bg-white shadow-lg rounded-lg p-2 w-45 border border-gray-200"
                  sideOffset={5}
                >
                  <button className="block w-full text-left p-2 hover:bg-gray-100">
                    Move to Other
                  </button>
                  <button className="block w-full text-left p-2 hover:bg-gray-100">
                    Label as Jobs
                  </button>
                  <button
                    className="block w-full text-left p-2 hover:bg-gray-100"
                    onClick={() => unreadFiltering(data.conversationID)}
                  >
                    {data.type.includes("unread")
                      ? "Mark as read"
                      : "Mark as unread"}
                  </button>
                  <button
                    className="block w-full text-left p-2 hover:bg-gray-100"
                    onClick={() => starredFiltering(data.conversationID)}
                  >
                    {data.type.includes("starred") ? "Remove Star" : "Star"}
                  </button>

                  <button className="block w-full text-left p-2 hover:bg-gray-100">
                    Mute
                  </button>
                  <button className="block w-full text-left p-2 hover:bg-gray-100">
                    Archive
                  </button>
                  <button className="block w-full text-left p-2 hover:bg-gray-100">
                    Delete conversation
                  </button>
                  <button className="block w-full text-left p-2 hover:bg-gray-100">
                    Manage settings
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <div className=" flex absolute bottom-2 right-3">
              {data.type.includes("starred") ? (
                <FaStar size={15} className=" text-yellow-600 m-1" />
              ) : (
                ""
              )}
              {data.type.includes("unread") ? (
                <span className="text-xs rounded-full m-1 text-white w-4 h-4 bg-blue-600 ">
                  1
                </span>
              ) : (
                ""
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default SideBar;
