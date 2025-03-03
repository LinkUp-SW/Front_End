import React from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "../ui/button";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/2">
        <div className="flex justify-between">
          <h3 className="font-semibold">Create a post</h3>
          <FaTimes className="cursor-pointer" onClick={onClose} />
        </div>
        <textarea
          className="w-full border p-2 mt-2 rounded-md"
          placeholder="What do you want to talk about?"
        ></textarea>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
