import { Card, CardContent } from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
// import { useDispatch } from "react-redux";
// import { handleOpenModalType } from "@/utils";
import { Dialog, DialogContent, DialogTrigger, Modal } from "@/components";
import { Link } from "react-router-dom";
import CreatePostModal from "./modals/CreatePostModal";
import { useState } from "react";
import PostSettingsModal from "./modals/PostSettingsModal";

interface CreatePostProps {
  profileImageUrl: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ profileImageUrl }) => {
  // const dispatch = useDispatch();

  // const handleOpenModal = () => {
  //   console.log("Opoen");
  //   dispatch(handleOpenModalType("create_post")); // Dispatch a string identifier or an object with modal details
  // };
  const [isSettingsModal, setIsSettingsModal] = useState<Boolean>(false);

  return (
    <>
      <Card className="mb-4 w-full bg-white border-0 pr-4 dark:bg-gray-900 ">
        <CardContent>
          <div className="flex space-x-3 justify-start items-start">
            <Link to={"#"}>
              <Avatar className="h-12 w-12 pl-0">
                <AvatarImage src={profileImageUrl} alt="Profile" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <Dialog>
              <DialogTrigger asChild className="w-full">
                <Button
                  variant="ghost"
                  className="w-[90%] h-11 border p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors hover:cursor-pointer hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
                >
                  <p className="w-full">Start a post</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-900 dark:border-gray-700 w-[70rem]">
                {isSettingsModal ? (
                  <PostSettingsModal setIsSettingsModal={setIsSettingsModal} />
                ) : (
                  <CreatePostModal
                    profileImageUrl={profileImageUrl}
                    setIsSettings={setIsSettingsModal}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Modal />
    </>
  );
};

export default CreatePost;
