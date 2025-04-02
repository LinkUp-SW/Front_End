import BlueButton from "../buttons/BlueButton";
import TransparentButton from "../buttons/TransparentButton";

interface PostSettingsModalProps {
  setIsSettingsModal: (value: boolean) => void;
}

const PostSettingsModal: React.FC<PostSettingsModalProps> = ({
  setIsSettingsModal,
}) => {
  return (
    <div className="flex-col flex">
      <div className="flex w-full justify-end gap-2">
        <TransparentButton onClick={() => setIsSettingsModal(false)}>
          Back
        </TransparentButton>
        <BlueButton>Done</BlueButton>
      </div>
    </div>
  );
};

export default PostSettingsModal;
