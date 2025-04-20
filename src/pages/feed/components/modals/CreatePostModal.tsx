import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { RootState } from "@/store";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { memo, useRef } from "react";
import TextareaAutoResize from "react-textarea-autosize";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";
import { GoFileMedia as MediaIcon } from "react-icons/go";
import BlueButton from "../buttons/BlueButton";
import IconButton from "../buttons/IconButton";
import { IoDocumentOutline as DocumentIcon } from "react-icons/io5";
import PostImages from "../PostImages";
import { MdModeEdit as EditIcon } from "react-icons/md";
import { IoClose as CloseIcon } from "react-icons/io5";
import DocumentPreview from "./DocumentPreview";

interface CreatePostModalProps {
  profileImageUrl: string;
  setActiveModal: (value: string) => void;
  postText: string;
  setPostText: (value: string | ((prevMessage: string) => string)) => void;
  selectedMedia: File[];
  setSelectedMedia: (images: File[]) => void;
  submitPost: () => void;
  privacySetting: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  profileImageUrl,
  setActiveModal,
  postText,
  setPostText,
  selectedMedia,
  setSelectedMedia,
  submitPost,
  privacySetting,
}) => {
  const MemoizedEmojiPicker = memo(EmojiPicker);

  const darkMode = useSelector((state: RootState) => state.theme.theme);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiRequest = (emoji: { emoji: string }) => {
    setPostText((prevMessage: string) => prevMessage + emoji.emoji);
  };

  return (
    <div className="flex flex-col relative items-start gap-4 w-full px-4 ">
      <div className="bg-white dark:bg-gray-900 w-full z-10 h-[5rem] pt-2 sticky -top-4">
        <div
          onClick={() => setActiveModal("settings")}
          id="post-settings-button"
          className="flex w-fit z-0 p-2  gap-4  hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-2xl"
        >
          <Avatar className="h-12 w-12 pl-0">
            <AvatarImage src={profileImageUrl} alt="Profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col  text-black dark:text-neutral-200 ">
            <div className="flex items-center gap-3">
              <p className="text-xl font-medium text-nowrap">Amr Doma</p>
              <FaChevronDown />
            </div>
            <p className="text-md text-nowrap">Post to {privacySetting}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full overflow-y-visible">
        {/* Text Area */}
        <TextareaAutoResize
          rows={4}
          placeholder="What do you want to talk about?"
          value={postText}
          onChange={(e) => {
            setPostText(e.target.value);

            // Auto-resize the textarea
            const textarea = e.target;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
          autoFocus
          draggable={false}
          className="w-full resize-none min-h-[10rem] overflow-hidden outline-0 text-xl border-0 ring-0 focus:ring-0 focus:border-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-gray-900"
          id="text-input"
        />

        {selectedMedia.length > 0 && (
          <div>
            {/* Media Preview */}

            <div className="flex justify-end gap-2">
              <IconButton
                onClick={() => {
                  selectedMedia[0].type === "application/pdf"
                    ? setActiveModal("add-document")
                    : setActiveModal("add-media");
                }}
                size={"icon"}
                className="text-white bg-gray-700 dark:hover:bg-neutral-400 hover:bg-gray-800 dark:text-neutral-700 dark:bg-neutral-200"
                id="edit-button"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size={"icon"}
                onClick={() => {
                  setSelectedMedia([]);
                }}
                className=" rounded-full dark:bg-gray-200 dark:hover:bg-neutral-400  text-white bg-gray-700 hover:bg-gray-800 dark:text-gray-900"
                id="remove-media-button"
              >
                <CloseIcon />
              </IconButton>
            </div>

            {selectedMedia[0].type.startsWith("image/") ? (
              <PostImages
                className="flex-shrink-0 -z-50"
                images={selectedMedia.map((file) => URL.createObjectURL(file))}
                isLandscape={false}
              ></PostImages>
            ) : selectedMedia[0].type.startsWith("video/") ? (
              <div className="flex justify-center items-center">
                <video
                  src={URL.createObjectURL(selectedMedia[0])}
                  className="w-1/2 self-center border"
                  controls
                />
              </div>
            ) : (
              <DocumentPreview currentSelectedMedia={selectedMedia} />
            )}
          </div>
        )}
      </div>
      <div className="sticky -bottom-4 py-5 w-full  z-40 bg-white dark:bg-gray-900">
        <div className="flex justify-start items-center">
          <TooltipProvider>
            <Tooltip>
              <Popover>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <IconButton id="emoji-button">
                      <MdOutlineEmojiEmotions />
                    </IconButton>
                  </TooltipTrigger>
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
              <TooltipContent>
                <p>Open Emoji keyboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!selectedMedia.length && (
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => {
                      fileInputRef.current?.click();
                      setActiveModal("add-media");
                    }}
                    asChild
                  >
                    <IconButton id="add-media-button">
                      <MediaIcon />
                    </IconButton>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Add media</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => setActiveModal("add-document")}
                    asChild
                  >
                    <IconButton className="text-black" id="add-document-button">
                      <DocumentIcon></DocumentIcon>
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
            </div>
          )}
        </div>

        <div className="flex w-full justify-end border-t dark:border-gray-600 pt-4 gap-2">
          {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton>
                <FaRegClock />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule for later</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

          <BlueButton
            onClick={submitPost}
            disabled={postText.length == 0 && selectedMedia.length == 0}
            id="post-button"
          >
            Post
          </BlueButton>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
