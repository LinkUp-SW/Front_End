import { FaPencilAlt, FaRegCalendarAlt, FaRegImage } from "react-icons/fa";
import { Card, CardContent } from "../ui/card";
import CreatePostModal from "./CreatePostModal";
import MediaUploadModal from "./MediaUploadModal";
import { useState } from "react";

const CreatePost = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);

  return (
    <>
      <Card className="p-4 mb-4">
        <CardContent>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Start a post"
              className="w-full border p-2 rounded-md focus:outline-none"
              onClick={() => setPostModalOpen(true)}
            />
          </div>
          <div className="flex justify-between mt-2 text-gray-500">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setMediaModalOpen(true)}
            >
              <FaRegImage className="mr-1 text-blue-500" /> Media
            </div>
            <div className="flex items-center cursor-pointer">
              <FaRegCalendarAlt className="mr-1 text-orange-500" /> Event
            </div>
            <div className="flex items-center cursor-pointer">
              <FaPencilAlt className="mr-1 text-red-500" /> Write article
            </div>
          </div>
        </CardContent>
      </Card>
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setPostModalOpen(false)}
      />
      <MediaUploadModal
        isOpen={isMediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
      />
    </>
  );
};

export default CreatePost;
