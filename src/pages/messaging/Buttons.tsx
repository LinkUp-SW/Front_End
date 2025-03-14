import {
  FILTER_OPTIONS_MESSAGES,
  FILTERS_LIST_MESSAGES,
} from "../../constants/index.ts";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react"; // For typing setState functions

// Add types for props
interface ButtonsProps {
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;
}

const Buttons = ({ activeFilter, setActiveFilter }: ButtonsProps) => {
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
      name: "Aly Mohamed",
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
  const BUTTON_STYLE =
    "text-center hover:bg-gray-100 hover:border-1 hover:border-gray-800  hover:cursor-pointer text-black rounded-2xl border-1 border-gray-400 border-1 pr-2 pl-2 pt-1 pb-1 mr-3 ";
  const MAIN_BUTTON_OPTIONS = "bg-white text-black";

  const [buttonNameList, setButtonNameList] = useState(FILTERS_LIST_MESSAGES);
  return (
    <>
      <div className="border-1 border-[#e8e8e8]">
        <select className="text-center appearance-none hover:bg-green-900 hover:cursor-pointer font-semibold bg-[#01754f] rounded-2xl text-white pr-2 pl-2 pt-1 pb-1 m-5 mt-3 mb-3">
          <option className="" value="Focused">
            Focused
          </option>
          <option className={MAIN_BUTTON_OPTIONS} value="Other">
            Other
          </option>
          <option className={MAIN_BUTTON_OPTIONS} value="Archived">
            Archived
          </option>
          <option className={MAIN_BUTTON_OPTIONS} value="Spam">
            Spam
          </option>
        </select>

        <span className="m-2 mr-7">|</span>

        {buttonNameList.map((buttonName) => (
          <button
            className={`${
              activeFilter === buttonName
                ? "text-center  hover:cursor-pointer font-semibold bg-[#01754f] rounded-2xl text-white  pr-2 pl-2 pt-1 pb-1 mr-3"
                : BUTTON_STYLE
            } `}
            onClick={() => {
              setActiveFilter(buttonName);
              setButtonNameList((prevMessage) => [
                buttonName,
                ...prevMessage.filter(
                  (filterNonActiveButton) =>
                    filterNonActiveButton !== buttonName
                ),
              ]);
            }}
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
