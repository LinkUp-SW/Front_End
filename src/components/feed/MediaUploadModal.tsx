import { Button } from "../ui/button";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MediaUploadModal = ({ isOpen, onClose }: MediaUploadModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/2 text-center">
        <h3 className="font-semibold">Select files to begin</h3>
        <p className="text-gray-600">
          Share images or a single video in your post.
        </p>
        <Button className="mt-4">Upload from computer</Button>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;
