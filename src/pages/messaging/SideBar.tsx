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

// Add types for props
interface SideBarProps {
  activeFilter: string;
  search: string;
}

const SideBar = ({ activeFilter, search }: SideBarProps) => {
  const [deleted, setDeleted] = useState(false);
  const [unread, setUnread] = useState(false);
  const [hoveredItems, setHoveredItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [dataInfo, setDataInfo] = useState([
    {
      id: 1,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Mohanad Tarek",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["myconnections"],
    },
    {
      id: 2,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Youssef afifi",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["inmail"],
    },
    {
      id: 3,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Aly Mohamed unread",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["unread"],
    },
    {
      id: 4,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["starred"],
    },
    {
      id: 5,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["starred"],
    },
    {
      id: 6,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["starred"],
    },
    {
      id: 7,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: ["starred"],
    },
  ]);

  const filterMap = {
    [FILTER_OPTIONS_MESSAGES.FOCUSED]: dataInfo,
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

  const filteredMessages = filterMap[activeFilter].filter(
    (info) =>
      info.name.toLowerCase().includes(search.toLowerCase()) ||
      info.message.toLowerCase().includes(search.toLowerCase())
  );
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

        {filteredMessages.map((data) => (
          <button
            key={data.id}
            className={`relative flex h-1/5 w-full items-center p-3 border-1 border-[#e8e8e8] hover:cursor-pointer ${
              data.type.includes("unread")
                ? "bg-[#d7e8fa]  hover:bg-[#b1d1fffe]"
                : " hover:bg-gray-300"
            }`}
          >
            <div className="flex">
              <div
                className="relative inset-0 rounded-full w-12 h-12 bg-gray-100"
                onMouseEnter={() =>
                  !selectedItems.includes(data.id) &&
                  setHoveredItems((prevItems) => [...prevItems, data.id])
                }
                onMouseLeave={() => {
                  hoveredItems.includes(data.id) &&
                    setHoveredItems((prevItems) =>
                      prevItems.filter((id) => id !== data.id)
                    );
                }}
              >
                {hoveredItems.includes(data.id) ||
                selectedItems.includes(data.id) ? (
                  <button
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-md w-6 h-6 border hover:border-2 hover:bg-gray-200 hover:cursor-pointer"
                    onClick={() => {
                      // Toggle selected item in the array
                      setSelectedItems((prevItems) =>
                        prevItems.includes(data.id)
                          ? prevItems.filter((id) => id !== data.id)
                          : [...prevItems, data.id]
                      );
                    }}
                  >
                    {selectedItems.includes(data.id) ? (
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
                <p className="font-semibold text-sm">{data.name}</p>
                <p className="text-xs text-gray-600 truncate">{data.message}</p>
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
                    onClick={() =>
                      setDataInfo((prevData) =>
                        prevData.map((message) =>
                          message.id === data.id
                            ? {
                                ...message,
                                type: message.type.includes("unread")
                                  ? message.type.filter((t) => t !== "unread")
                                  : [...message.type, "unread"],
                              }
                            : message
                        )
                      )
                    }
                  >
                    {data.type.includes("unread")
                      ? "Mark as read"
                      : "Mark as unread"}
                  </button>
                  <button
                    className="block w-full text-left p-2 hover:bg-gray-100"
                    onClick={() =>
                      setDataInfo((prevData) =>
                        prevData.map((message) =>
                          message.id === data.id
                            ? {
                                ...message,
                                type: message.type.includes("starred")
                                  ? message.type.filter((t) => t !== "starred")
                                  : [...message.type, "starred"],
                              }
                            : message
                        )
                      )
                    }
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
