import { FaPencilAlt, FaRegCalendarAlt, FaRegImage } from "react-icons/fa";
import { Card, CardContent } from "../ui/card";
import CreatePostModal from "./CreatePostModal";
import MediaUploadModal from "./MediaUploadModal";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const CreatePost = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);

  const ButtonsList = [
    {
      title: "Media",
      icon: <FaRegImage className="mr-1 text-blue-500" />,
      callback: () => setMediaModalOpen(true),
    },
    {
      title: "Event",
      icon: <FaRegCalendarAlt className="mr-1 text-orange-500" />,
      callback: () => {}, // Add your callback function here
    },
    {
      title: "Write article",
      icon: <FaPencilAlt className="mr-1 text-red-500" />,
      callback: () => {}, // Add your callback function here
    },
  ];

  return (
    <>
      <Card className=" mb-4 w-full bg-white border-0">
        <CardContent>
          <div className="flex space-x-3 justify-start items-start">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              className="w-[90%] h-13 border p-4 hover:bg-gray-200 transition-colors hover:cursor-pointer hover:text-gray-950 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left"
              onClick={() => setPostModalOpen(true)}
            >
              <p className="w-full">Start a post</p>
            </Button>
          </div>
          <div className="flex justify-around mt-2 text-gray-500">
            {ButtonsList.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex items-center cursor-pointer transition-colors hover:bg-gray-100 hover:text-black"
                onClick={button.callback}
              >
                {button.icon} {button.title}
              </Button>
            ))}
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
