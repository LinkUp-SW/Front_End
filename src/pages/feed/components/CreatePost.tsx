import { FaPencilAlt, FaRegCalendarAlt, FaRegImage } from "react-icons/fa";
import { Card, CardContent } from "../../../components/ui/card";
import CreatePostModal from "./CreatePostModal";
import MediaUploadModal from "./MediaUploadModal";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { useDispatch } from "react-redux";
import { handleOpenModalType } from "@/utils";
import { Modal } from "@/components";

interface CreatePostProps {
  profileImageUrl: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ profileImageUrl }) => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    console.log("Opoen");
    dispatch(handleOpenModalType("create_post")); // Dispatch a string identifier or an object with modal details
  };

  const ButtonsList = [
    {
      title: "Media",
      icon: <FaRegImage className="mr-1 text-blue-500" />,
      callback: handleOpenModal,
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
      <Card className="mb-4 w-full bg-white border-0 pr-4 dark:bg-zinc-900 ">
        <CardContent>
          <div className="flex space-x-3 justify-start items-start">
            <Avatar className="h-12 w-12 pl-0">
              <AvatarImage src={profileImageUrl} alt="Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              className="w-[90%] h-11 border p-4 hover:bg-gray-200 transition-colors hover:cursor-pointer hover:text-gray-950 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
              onClick={handleOpenModal}
            >
              <p className="w-full">Start a post</p>
            </Button>
          </div>
          <div className="flex justify-around mt-2 text-gray-500 dark:text-neutral-300">
            {ButtonsList.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`flex items-center ${
                  index == 0 ? "" : "hidden sm:flex"
                } cursor-pointer transition-colors hover:bg-gray-100 hover:text-black`}
                onClick={button.callback}
              >
                {button.icon} {button.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Modal />
    </>
  );
};

export default CreatePost;
