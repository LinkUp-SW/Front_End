import BlueButton from "../buttons/BlueButton";
import TransparentButton from "../buttons/TransparentButton";
import { useRef, useState, useEffect } from "react";
import DocumentPreview from "./DocumentPreview";
import { toast } from "sonner";

interface AddDocumentModalProps {
  setActiveModal: (value: string) => void;
  selectedMedia: File[];
  setSelectedMedia: (images: File[]) => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  setActiveModal,
  selectedMedia,
  setSelectedMedia,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSelectedMedia, setCurrentSelectedMedia] = useState<File[]>([]);
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Only take the first file
    const maxFileSizeInMB = 10;
    const maxFileSize = maxFileSizeInMB * 1048576; // 10 MB

    // Validate file type
    if (!file.type.match(/^application\/pdf$/)) {
      toast.error(`File "${file.name}" must be a PDF document.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input
      }
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error(
        `File "${file.name}" exceeds the maximum size of ${maxFileSizeInMB} MB.`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input
      }
      return;
    }

    // Set only the single file
    setCurrentSelectedMedia([file]);
  };

  useEffect(() => {
    setCurrentSelectedMedia(selectedMedia);
  }, [selectedMedia]);
  return (
    <div className="flex-col flex">
      <h1 className="border-b dark:border-gray-600 pb-4 px-5 text-xl font-medium">
        Share a document
      </h1>

      <div className="px-10 py-14">
        <TransparentButton
          id="choose-file-button"
          onClick={() => triggerFileInput()}
          className="w-full"
        >
          Choose file
        </TransparentButton>
      </div>

      {currentSelectedMedia && currentSelectedMedia.length != 0 && (
        <DocumentPreview currentSelectedMedia={currentSelectedMedia} />
      )}
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleAdd}
        className="self-center hidden"
        id="file-input"
      />
      <p className="p-10  text-sm text-gray-500 dark:text-gray-400">
        For accessibility purposes, LinkUp members who can view your post will
        be able to download your document as a PDF.
      </p>
      <div className="flex w-full justify-end gap-2 px-5 border-t dark:border-gray-700 pt-5">
        <TransparentButton
          id="back-button"
          onClick={() => setActiveModal("create-post")}
        >
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            if (currentSelectedMedia != selectedMedia) {
              setSelectedMedia(currentSelectedMedia);
              setActiveModal("create-post");
            }
          }}
          disabled={currentSelectedMedia.length == 0}
          id="done-button"
        >
          Done
        </BlueButton>
      </div>
    </div>
  );
};

export default AddDocumentModal;
