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
import { memo, useRef, useState, useEffect } from "react"; // Added useState and useEffect
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
import LinkPreview from "../LinkPreview"; // Import the LinkPreview component
import React from "react";
import UserTagging from "@/pages/feed/components/UserTagging";
import { processTextFormatting } from "@/components/truncate_text/TruncatedText";

interface CreatePostModalProps {
  profileImageUrl: string;
  setActiveModal: (value: string) => void;
  postText: string;
  setPostText: (value: string | ((prevMessage: string) => string)) => void;
  selectedMedia: File[];
  setSelectedMedia: (images: File[]) => void;
  submitPost: (value?: string) => void;
  privacySetting: string;
  taggedUsers: { name: string; id: string }[];
  setTaggedUsers: (users: Array<{ name: string; id: string }>) => void;
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
  taggedUsers,
  setTaggedUsers,
}) => {
  const { data } = useSelector((state: RootState) => state.userBio);
  const MemoizedEmojiPicker = memo(EmojiPicker);
  const darkMode = useSelector((state: RootState) => state.theme.theme);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // State to track detected URL
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPostText(e.target.value);
    },
    [setPostText]
  );
  // Function to detect URLs in text
  const extractUrl = (text: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches && matches.length > 0 ? matches[0] : null;
  };

  const extractTaggedUsers = (text: string): { name: string; id: string }[] => {
    // Update regex to match the new format with a caret at the end
    // This will match @Any Name With Spaces:userId^ format
    const regex = /@([^:]+):([A-Za-z0-9_\-]+)\^/g;
    const users: { name: string; id: string }[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const name = match[1]; // No need to replace underscores anymore
      const id = match[2];
      users.push({ name, id });
    }

    return users;
  };

  useEffect(() => {
    setTaggedUsers(extractTaggedUsers(postText));
    console.log(taggedUsers);
  }, [postText]);

  // Detect URL when post text changes
  // Use debounce for URL detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedMedia.length === 0) {
        const url = extractUrl(postText);
        setDetectedUrl(url);
      } else {
        setDetectedUrl(null);
      }
    }, 300); // Wait 300ms after typing stops

    return () => clearTimeout(timer);
  }, [postText, selectedMedia]);

  const handleEmojiRequest = (emoji: { emoji: string }) => {
    setPostText((prevMessage: string) => prevMessage + emoji.emoji);
  };

  // Function to remove detected URL preview
  const removeUrlPreview = () => {
    setDetectedUrl(null);
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
              <p className="text-xl font-medium text-nowrap">
                {data?.bio.first_name + " " + data?.bio.last_name}
              </p>
              <FaChevronDown />
            </div>
            <p className="text-md text-nowrap">Post to {privacySetting}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full overflow-y-visible relative">
        {/* User tagging component wrapping the textarea */}
        <UserTagging
          text={postText}
          onTextChange={setPostText}
          inputRef={textareaRef}
          className="w-full"
        >
          {/* The textarea is a child of UserTagging */}
          <TextareaAutoResize
            ref={textareaRef}
            rows={4}
            placeholder="What do you want to talk about?"
            value={postText}
            onChange={handleTextChange}
            autoFocus
            draggable={false}
            className="w-full resize-none min-h-[10rem] overflow-hidden outline-0 text-xl border-0 ring-0 
              focus:ring-0 focus:border-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-gray-900"
            id="text-input"
          />
          {taggedUsers.length > 0 && (
            <div className="mt-2 mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-sm mb-1 text-gray-500 dark:text-gray-400"></p>
              <FormattedPostText text={postText} />
            </div>
          )}
        </UserTagging>

        {selectedMedia.length > 0 && (
          <div>
            {/* Media Preview */}
            <div className="flex justify-end gap-2">
              <IconButton
                onClick={() => {
                  if (selectedMedia[0].type === "application/pdf") {
                    setActiveModal("add-document");
                  } else {
                    setActiveModal("add-media");
                  }
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

        {/* Link Preview (when URL is detected and no other media is selected) */}
        {detectedUrl && selectedMedia.length === 0 && (
          <div className="mt-4 relative">
            <div className="flex justify-end">
              <IconButton
                size={"icon"}
                onClick={removeUrlPreview}
                className="absolute top-2 right-2 z-10 rounded-full dark:bg-gray-200 dark:hover:bg-neutral-400 text-white bg-gray-700 hover:bg-gray-800 dark:text-gray-900"
                id="remove-link-preview-button"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <LinkPreview url={detectedUrl} className="w-full" />
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

          {!selectedMedia.length && !detectedUrl && (
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
          <BlueButton
            onClick={async () => {
              // Extract tagged users with IDs for your API
              const taggedUsers = extractTaggedUsers(postText);
              // Get just the IDs for the API
              const taggedUserIds = taggedUsers.map((user) => user.id);

              console.log("Tagged users:", taggedUsers);
              console.log("Tagged user IDs:", taggedUserIds);

              // Format the content for display (remove the :user_id parts)
              const formattedContent = postText.replace(
                /@([A-Za-z0-9_]+):[A-Za-z0-9_-]+/g,
                (match, name) => {
                  return "@" + name.replace(/_/g, " ");
                }
              );

              if (detectedUrl && selectedMedia.length === 0) {
                submitPost(detectedUrl);
                setDetectedUrl(null);
              } else {
                submitPost();
              }
            }}
            disabled={
              postText.length === 0 &&
              selectedMedia.length === 0 &&
              !detectedUrl
            }
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

const FormattedPostText = ({ text }: { text: string }) => {
  // Use a regex that matches from @ to ^ (complete tag)
  const parts = text.split(/(@[^:]+:[A-Za-z0-9_\-]+\^)/g);

  return (
    <div className="formatted-text">
      {parts.map((part, index) => {
        // Check if this part is a tag with the new format
        if (part.match(/^@[^:]+:[A-Za-z0-9_\-]+\^$/)) {
          // Extract just the name part without the ID and the caret
          const nameMatch = part.match(/@([^:]+):/);
          if (nameMatch && nameMatch[1]) {
            const displayName = nameMatch[1]; // No need to replace underscores
            return (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 rounded px-1 py-0.5 dark:bg-blue-900 dark:text-blue-300"
              >
                @{displayName}
              </span>
            );
          }
        }
        // Regular text with rich formatting
        return (
          <React.Fragment key={index}>
            {processTextFormatting(part, index)}
          </React.Fragment>
        );
      })}
    </div>
  );
};
