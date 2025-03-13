import { FaCheckSquare } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineMarkAsUnread } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import {
  FILTER_OPTIONS_MESSAGES,
  FILTERS_LIST_MESSAGES,
} from "../../constants/index.ts";
import Buttons from "./Buttons";

import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react"; // For typing setState functions

// Add types for props
interface SideBarProps {
  activeFilter: string;
}

const SideBar = ({ activeFilter }: SideBarProps) => {
  /*const [hovered, setHovered] = useState(false);*/
  const [deleted, setDeleted] = useState(false);
  const [unread, setUnread] = useState(false);
  const [hoveredItems, setHoveredItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const dataInfo = [
    {
      id: 1,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Mohanad Tarek",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "myconnections",
    },
    {
      id: 2,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Youssef afifi",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "inmail",
    },
    {
      id: 3,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Aly Mohamed unread",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "unread",
    },
    {
      id: 4,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "starred",
    },
    {
      id: 5,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "starred",
    },
    {
      id: 6,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "starred",
    },
    {
      id: 7,
      profileImg:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "Amr Doma",
      message: " you: Lorem ipsum dolor ...",
      date: "2h ago",
      type: "starred",
    },
  ];

  const Blocks =
    "relative flex h-1/5 items-center p-3 border-1 border-[#e8e8e8] hover:bg-gray-300 hover:cursor-pointer ";
  const filterMap = {
    [FILTER_OPTIONS_MESSAGES.FOCUSED]: dataInfo,
    [FILTER_OPTIONS_MESSAGES.UNREAD]: dataInfo.filter(
      (info) => info.type === "unread"
    ),
    [FILTER_OPTIONS_MESSAGES.MY_CONNECTIONS]: dataInfo.filter(
      (info) => info.type === "myconnections"
    ),
    [FILTER_OPTIONS_MESSAGES.INMAIL]: dataInfo.filter(
      (info) => info.type === "inmail"
    ),
    [FILTER_OPTIONS_MESSAGES.STARRED]: dataInfo.filter(
      (info) => info.type === "starred"
    ),
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

        {filterMap[activeFilter].map((data) => (
          <div key={data.id} className={Blocks}>
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

            <div className="flex-1 p-3">
              <p className="font-semibold text-sm">{data.name}</p>
              <p className="text-xs text-gray-600 truncate">{data.message}</p>
            </div>

            <p className="absolute top-2 right-3 text-xs text-gray-600">
              {data.date}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SideBar;
