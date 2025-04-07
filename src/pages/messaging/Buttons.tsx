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

  const handleMainButton = () => {
    dispatch(activeButton("Focused"));
    setAllowOtherButtons("false");
    setButtonNameList(FILTERS_LIST_MESSAGES);
  };

  return (
    <>
      <div className="border-1 border-[#e8e8e8] flex items-center  space-x-4 px-4">
        <select
          onChange={() => handleMainButton()}
          className="selectMainButton"
        >
          <option id="focused" value="Focused">
            Focused
          </option>
          <option id="other" value="Other">
            Other
          </option>
          <option id="archived" value="Archived">
            Archived
          </option>
          <option id="spam" value="Spam">
            Spam
          </option>
        </select>

        <div className="border-1 border-gray-300 h-7"></div>

        {buttonNameList.map((buttonName) => (
          <button
            id="button-name"
            className={`${
              activeFilter === buttonName && AllowOtherButtons === "true"
                ? "text-center  hover:cursor-pointer font-semibold bg-[#01754f] rounded-2xl text-white  pr-2 pl-2 pt-1 pb-1 mr-3"
                : "buttonStyle"
            } `}
            onClick={() => handleFilterButtonClick(buttonName)}
            key={buttonName}
          >
            {buttonName}
          </button>
        ))}
      </div>
    </>
  );
};

export default Buttons;
