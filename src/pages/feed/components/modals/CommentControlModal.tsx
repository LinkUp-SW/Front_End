import BlueButton from "../buttons/BlueButton";
import RadioButton from "../buttons/RadioButton";
import TransparentButton from "../buttons/TransparentButton";
import { HiGlobeEuropeAfrica as GlobeIcon } from "react-icons/hi2";
import { FaPeopleGroup as PeopleIcon } from "react-icons/fa6";
import { TbMessage2Off as MessageCrossIcon } from "react-icons/tb";

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
  return (
    <div className="flex-col flex py-6">
      <RadioButton
        icon={<GlobeIcon size={25} />}
        title={"Anyone"}
        subtitle={"Anyone on or off Linkedin"}
        isSelected={commentSetting === "Anyone"}
        onClick={() => {
          setCommentSetting("Anyone");
        }}
      />
      <RadioButton
        icon={<PeopleIcon size={25} />}
        title={"Connections only"}
        subtitle={"Only your connections can comment"}
        isSelected={commentSetting === "Connections only"}
        onClick={() => {
          setCommentSetting("Connections only");
        }}
      />
      <RadioButton
        icon={<MessageCrossIcon size={25} />}
        title={"No one"}
        subtitle={"No one can comment"}
        isSelected={commentSetting === "No one"}
        onClick={() => {
          setCommentSetting("No one");
        }}
      />
      <div className="flex w-full justify-end gap-2 px-5">
        <TransparentButton onClick={() => setActiveModal("create-post")}>
          Back
        </TransparentButton>
        <BlueButton>Done</BlueButton>
      </div>
    </div>
  );
};

export default CommentControlModal;
