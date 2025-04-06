import BlueButton from "../buttons/BlueButton";
import RadioButton from "../buttons/RadioButton";
import TransparentButton from "../buttons/TransparentButton";
import { HiGlobeEuropeAfrica as GlobeIcon } from "react-icons/hi2";
import { FaPeopleGroup as PeopleIcon } from "react-icons/fa6";
import { useState } from "react";

interface PostSettingsModalProps {
  setActiveModal: (value: string) => void;
  privacySetting: string;
  setPrivacySetting: (value: string) => void;
  commentSetting: string;
}

const PostSettingsModal: React.FC<PostSettingsModalProps> = ({
  setActiveModal,
  privacySetting,
  setPrivacySetting,
  commentSetting,
}) => {
  const [currentSettings, setCurrentSettings] = useState(privacySetting);
  return (
    <div className="flex-col flex">
      <h1 className="border-b dark:border-gray-600 pb-4 px-5 text-xl font-medium">
        Post Settings
      </h1>

      <h2 className="p-4 pb-0 font-medium text-md">Who can see your post?</h2>
      <div className="py-7">
        <RadioButton
          icon={<GlobeIcon size={25} />}
          title={"Anyone"}
          subtitle={"Anyone on or off Linkedin"}
          isSelected={currentSettings == "Anyone"}
          onClick={() => {
            setCurrentSettings("Anyone");
          }}
        />
        <RadioButton
          icon={<PeopleIcon size={25} />}
          title={"Connections only"}
          isSelected={currentSettings == "Connections only"}
          onClick={() => {
            setCurrentSettings("Connections only");
          }}
        />
      </div>
      <button
        className="flex items-center pl-6 mb-5 justify-between hover:cursor-pointer w-full p-2 py-5  hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setActiveModal("comment-control")}
      >
        {/* Text Content */}
        <div className="flex flex-col items-start">
          <span className="text-md font-medium text-black dark:text-white">
            Comment control
          </span>
          <span className="text-sm text-gray-500  dark:text-gray-400">
            {commentSetting}
          </span>
        </div>

        {/* Arrow Icon */}
        <div className="text-gray-400 dark:text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>
      <div className="flex w-full justify-end gap-2 px-5 px-5">
        <TransparentButton onClick={() => setActiveModal("create-post")}>
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            currentSettings != privacySetting
              ? (setPrivacySetting(currentSettings),
                setActiveModal("create-post"))
              : null;
          }}
          disabled={currentSettings == privacySetting}
        >
          Done
        </BlueButton>
      </div>
    </div>
  );
};

export default PostSettingsModal;
