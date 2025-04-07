import BlueButton from "../buttons/BlueButton";
import RadioButton from "../buttons/RadioButton";
import TransparentButton from "../buttons/TransparentButton";
import { HiGlobeEuropeAfrica as GlobeIcon } from "react-icons/hi2";
import { FaPeopleGroup as PeopleIcon } from "react-icons/fa6";
import { TbMessage2Off as MessageCrossIcon } from "react-icons/tb";
import { useState } from "react";

interface CommentControlModalProps {
  setActiveModal: (value: string) => void; // Function to set the active modal
  commentSetting: string; // Current comment setting
  setCommentSetting: (value: string) => void; // Function to update the comment setting
}

const CommentControlModal: React.FC<CommentControlModalProps> = ({
  setActiveModal,
  commentSetting,
  setCommentSetting,
}) => {
  const [currentSelection, setCurrentSelection] = useState(commentSetting);

  return (
    <div className="flex-col flex py-6">
      <h1 className="border-b dark:border-gray-600 pb-4 px-5 text-xl font-medium">
        Comment Control
      </h1>

      <h2 className="p-4 pb-0 font-medium text-md">
        Who can comment on your post?
      </h2>
      <div className="py-7">
        <RadioButton
          icon={<GlobeIcon size={25} />}
          title={"Anyone"}
          subtitle={"Anyone on or off Linkedin"}
          isSelected={currentSelection === "Anyone"}
          onClick={() => {
            setCurrentSelection("Anyone");
          }}
        />
        <RadioButton
          icon={<PeopleIcon size={25} />}
          title={"Connections only"}
          subtitle={"Only your connections can comment"}
          isSelected={currentSelection === "Connections only"}
          onClick={() => {
            setCurrentSelection("Connections only");
          }}
        />
        <RadioButton
          icon={<MessageCrossIcon size={25} />}
          title={"No one"}
          subtitle={"No one can comment"}
          isSelected={currentSelection === "No one"}
          onClick={() => {
            setCurrentSelection("No one");
          }}
        />
      </div>

      <div className="flex w-full justify-end gap-2 px-5 border-t pt-5 relative top-5">
        <TransparentButton onClick={() => setActiveModal("settings")}>
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            if (currentSelection !== commentSetting) {
              setCommentSetting(currentSelection);
              setActiveModal("settings");
            }
          }}
          disabled={currentSelection === commentSetting}
        >
          Done
        </BlueButton>
      </div>
    </div>
  );
};

export default CommentControlModal;
