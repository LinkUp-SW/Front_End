import BlueButton from "../buttons/BlueButton";
import TransparentButton from "../buttons/TransparentButton";

interface AddDocumentModalProps {
  setActiveModal: (value: string) => void; // Similar to PostSettingsModalProps
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  setActiveModal,
}) => {
  return (
    <div className="flex-col flex px-4">
      <div className="flex w-full justify-end gap-2 px-5">
        <TransparentButton
          id="back-button"
          onClick={() => setActiveModal("create-post")}
        >
          Back
        </TransparentButton>
        <BlueButton id="done-button">Done</BlueButton>
      </div>
    </div>
  );
};

export default AddDocumentModal;
