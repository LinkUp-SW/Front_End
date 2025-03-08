import { FaCheckSquare } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineMarkAsUnread } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

import { useEffect, useState } from "react";

const SideBar = () => {
  const [hovered, setHovered] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(false);
  const [count, setCount] = useState(0);
  const [close, setClose] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [unread, setUnread] = useState(false);

  const Blocks =
    "relative flex h-1/5 items-center p-3 border-1 border-[#e8e8e8] hover:bg-gray-300 hover:cursor-pointer ";

  return (
    <>
      <div className="h-full w-2/5 border-1 border-[#e8e8e8] overflow-y-auto ">
        {selectedMessages && !close ? (
          <div className="bg-[#f7f9fc] p-3 pl-5 flex justify-between">
            <div>
              <IoIosClose
                size={30}
                className="inline-block hover:cursor-pointer hover:bg-gray-200 hover:rounded-full"
                onClick={() => {
                  setClose(!close);
                  setSelectedMessages(false);
                  setHovered(false);
                }}
              />
              <span>{count} counted</span>
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

        <div className={Blocks}>
          <div
            className="relative inset-0 rounded-full w-12 h-12 bg-gray-100"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {selectedMessages ? setHovered(true) : setHovered(false)}}
          >
            {!hovered ? (
              <img
                className="rounded-full w-12 h-12 "
                src="https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg"
                alt="profile"
              />
            ) : (
              <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-md w-6 h-6 border hover:border-2 hover:bg-gray-200 hover:cursor-pointer"
                onClick={() => {
                  setSelectedMessages(!selectedMessages);
                  setClose(false);
                  

                  
                
                }}
              >
                {selectedMessages ? (
                  <FaCheckSquare className="bg-white text-green-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-md w-6 h-6 border hover:border-2" />
                ) : (
                  ""
                )}
              </button>
            )}
          </div>

          <div className="flex-1 p-3">
            <p className="font-semibold text-sm">Mohanad Tarek</p>
            <p className="text-xs text-gray-600 truncate">
              you: Lorem ipsum dolor ...
            </p>
          </div>

          <p className="absolute top-2 right-3 text-xs text-gray-600">2h ago</p>
        </div>

        <div className={Blocks}></div>

        <div className={Blocks}></div>

        <div className={Blocks}></div>
      </div>
    </>
  );
};

export default SideBar;
