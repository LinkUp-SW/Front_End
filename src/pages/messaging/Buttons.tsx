import { useDispatch } from "react-redux";
import { activeButton } from "../../slices/messaging/messagingSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FILTERS_LIST_MESSAGES } from "../../constants/index.ts";
import { useState } from "react";

const Buttons = () => {
  const activeFilter = useSelector(
    (state: RootState) => state.messaging.activeFilter
  );
  const dispatch = useDispatch();
  const [buttonNameList, setButtonNameList] = useState(FILTERS_LIST_MESSAGES);
  const [AllowOtherButtons, setAllowOtherButtons] = useState("false");

  const handleFilterButtonClick = (buttonName: string) => {
    dispatch(activeButton(buttonName));
    setButtonNameList((prevMessage) => [
      buttonName,
      ...prevMessage.filter(
        (filterNonActiveButton) => filterNonActiveButton !== buttonName
      ),
    ]);
    setAllowOtherButtons("true");
  };

  const handleMainButton = (value: string) => {
    dispatch(activeButton(value));
    setAllowOtherButtons("false");
    setButtonNameList(FILTERS_LIST_MESSAGES);
  };

  return (
    <>
      <div className="border-1 border-[#e8e8e8] flex items-center space-x-2 px-4 py-2 overflow-x-auto">
        

        <select
          onChange={(e) => handleMainButton(e.target.value)}
          className="selectButton flex-shrink-0"
        >
          <option value="Focused">Focused</option>
          <option value="Other">Other</option>
          <option value="Archived">Archived</option>
          <option value="Spam">Spam</option>
        </select>

        <div className="border-l border-gray-300 h-7 flex-shrink-0"></div>

        {/* (3) For Large Screens: Button list */}
        <div className="hidden lg:flex items-center space-x-2 overflow-x-auto flex-nowrap">
          {buttonNameList.map((buttonName) => (
            <button
              id="button-name"
              key={buttonName}
              className={`${
                activeFilter === buttonName && AllowOtherButtons === "true"
                  ? "text-center hover:cursor-pointer font-semibold bg-[#01754f] rounded-2xl text-white pr-2 pl-2 pt-1 pb-1 mr-3"
                  : "text-center hover:bg-gray-100 hover:border hover:border-gray-800 hover:cursor-pointer text-black rounded-2xl border-gray-400 border pr-2 pl-2 pt-1 pb-1 mr-3"
              }`}
              onClick={() => handleFilterButtonClick(buttonName)}
            >
              {buttonName}
            </button>
          ))}
        </div>

        {/* (3) For Small Screens: "Unread" button + "All Filters" select */}
        <div className="flex lg:hidden items-center space-x-2 overflow-x-auto flex-nowrap">
          <button
            id="unread-button"
            className={`${
              activeFilter === "Unread" && AllowOtherButtons === "true"
                ? "text-center hover:cursor-pointer font-semibold bg-[#01754f] rounded-2xl text-white pr-2 pl-2 pt-1 pb-1"
                : "text-center hover:bg-gray-100 hover:border hover:border-gray-800 hover:cursor-pointer text-black rounded-2xl border-gray-400 border pr-2 pl-2 pt-1 pb-1"
            }`}
            onClick={() => handleFilterButtonClick("Unread")}
          >
            Unread
          </button>

          <select
            onChange={(e) => handleFilterButtonClick(e.target.value)}
            className=" text-center hover:bg-gray-100 hover:border hover:border-gray-800 hover:cursor-pointer text-black rounded-2xl border-gray-400 border pr-2 pl-2 pt-1 pb-1"
          >
            <option value="" disabled selected>
              All Filters
            </option>
            {buttonNameList.map((buttonName) => (
              <option key={buttonName} value={buttonName}>
                {buttonName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default Buttons;
