import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { RootState } from "@/store";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { memo, useRef, useState } from "react";
import { FaChevronDown, FaRegClock } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import UploadMediaModal from "./UploadMediaModal";
import BlueButton from "../buttons/BlueButton";
import IconButton from "../buttons/IconButton";

interface CreatePostModalProps {
  profileImageUrl: string;
  setIsSettings: (value: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  profileImageUrl,
  setIsSettings,
}) => {
  const [postText, setPostText] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>();
  const MemoizedEmojiPicker = memo(EmojiPicker);

  const darkMode = useSelector((state: RootState) => state.theme.theme);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiRequest = (emoji: any) => {
    setPostText((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImages([file]);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 w-full ">
      <div
        onClick={() => setIsSettings(true)}
        className="flex p-2 gap-4 hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 rounded-2xl"
      >
        <Avatar className="h-12 w-12 pl-0">
          <AvatarImage src={profileImageUrl} alt="Profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-black dark:text-neutral-200">
          <div className="flex items-center gap-3">
            <p className="text-xl font-medium">Amr Doma</p>
            <FaChevronDown />
          </div>
          <p className="text-md">Post to Anyone</p>
        </div>
      </div>
      <textarea
        placeholder="What do you want to talk about?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        autoFocus
        draggable={false}
        className="min-h-[20rem] w-full resize-none outline-0 text-xl border-0 ring-0 focus:ring-0 focus:border-0  focus-visible:border-0 focus-visible:ring-0 dark:bg-gray-900"
      ></textarea>
      <div className="flex justify-start items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className=" hover:cursor-pointer rounded-full dark:hover:bg-gray-800 dark:hover:text-neutral-200"
            >
              <MdOutlineEmojiEmotions />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            forceMount
            className="dark:bg-gray-900 w-fit p-0 dark:border-gray-600"
          >
            <MemoizedEmojiPicker
              className="dark:bg-gray-900 w-full p-0"
              theme={darkMode === "dark" ? Theme.DARK : Theme.LIGHT}
              width={"full"}
              onEmojiClick={handleEmojiRequest}
            />
          </PopoverContent>
        </Popover>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className=" hover:cursor-pointer rounded-full dark:hover:bg-gray-800 dark:hover:text-neutral-200"
            >
              <MediaIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-900 dark:border-0">
            <UploadMediaModal />
          </DialogContent>
        </Dialog>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex w-full justify-end border-t dark:border-gray-600 pt-4 gap-2">
        <IconButton className="dark:hover:bg-gray-700 rounded-full hover:cursor-pointer">
          <FaRegClock />
        </IconButton>
        <BlueButton disabled={postText.length == 0}>Post</BlueButton>
      </div>
    </div>
  );
};

export default CreatePostModal;
