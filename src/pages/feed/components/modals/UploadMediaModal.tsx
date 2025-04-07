import React, { useEffect, useRef, useState } from "react";
import TransparentButton from "../buttons/TransparentButton";
import BlueButton from "../buttons/BlueButton";
import { toast } from "sonner";
import { FaCopy, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { RiDeleteBin6Fill as GarbageIcon } from "react-icons/ri";
import IconButton from "../buttons/IconButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";

interface UploadMediaModalProps {
  setActiveModal: (value: string) => void;
  selectedMedia: File[];
  setSelectedMedia: (images: File[]) => void;
}

const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  setActiveModal,
  selectedMedia,
  setSelectedMedia,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentSelectedMedia, setCurrentSelectedMedia] = useState<File[]>([]);
  const isMounted = useRef(true);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (isMounted.current && !selectedMedia.length) {
      triggerFileInput();
      isMounted.current = false;
    } else {
      setCurrentSelectedMedia(selectedMedia);
    }
  }, []);

  const darkMode = useSelector((state: RootState) => state.theme.theme);

  const handleDuplicate = () => {
    if (currentSelectedMedia) {
      setCurrentSelectedMedia([
        ...currentSelectedMedia.slice(0, selectedIndex),
        currentSelectedMedia[selectedIndex],
        ...currentSelectedMedia.slice(selectedIndex),
      ]);
    }
  };

  const handleDelete = () => {
    setCurrentSelectedMedia(
      currentSelectedMedia?.filter(
        (_, mediaIndex) => mediaIndex !== selectedIndex
      ) || []
    );
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0)); // Adjust selected index
  };

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const maxFileSizeInMB = 10;
      const maxFileSize = maxFileSizeInMB * 1048576; // 10 MB
      const maxFiles = 10;

      if (fileArray.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} files.`);
        return;
      }
      const validFiles = fileArray.filter((file) => {
        if (file.size > maxFileSize) {
          toast.error(
            `File "${file.name}" exceeds the maximum size of ${maxFileSizeInMB} MB.`
          );
          return false;
        }
        return file.type.startsWith("image/") || file.type.startsWith("video/");
      });
      if (validFiles.length) {
        setSelectedIndex(0);
      }
      const images = validFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      const videos = validFiles.filter((file) =>
        file.type.startsWith("video/")
      );

      if (
        videos.length > 1 ||
        (videos.length > 0 &&
          currentSelectedMedia.some((file) => file.type.startsWith("video/")))
      ) {
        toast.error("You can only upload one video at a time.");
        return;
      }

      if (videos.length > 0 && images.length > 0) {
        toast.error("You cannot upload images and a video together.");
        return;
      }

      setSelectedIndex(currentSelectedMedia.length);
      setCurrentSelectedMedia([...currentSelectedMedia, ...validFiles]);
    }
  };

  return (
    <div className="flex flex-col  dark:bg-gray-800 h-auto !lg:h-[30rem]">
      {/* Selected Media Preview */}

      <div className="flex gap-4 w-full h-full justify-center">
        {/* Left: Selected Media */}
        <div className="flex  lg:h-[30rem] lg:w-[45rem] items-center justify-center dark:border-gray-700 rounded-lg">
          {currentSelectedMedia.length > 0 &&
          currentSelectedMedia[selectedIndex] ? (
            currentSelectedMedia[selectedIndex].type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(currentSelectedMedia[selectedIndex])}
                alt={`Selected Preview`}
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                src={URL.createObjectURL(currentSelectedMedia[selectedIndex])}
                controls
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div>
                <img
                  src={`../../../../public/feed_upload_media_${darkMode}.svg`}
                  alt="Upload Media"
                  className=""
                />
              </div>
              <p className="dark:text-neutral-200 pt-2 text-center text-xl font-medium w-full h-full">
                Select files to begin
              </p>
              <p className="dark:text-gray-400 text-sm">
                Share images or a single video in your post.
              </p>
              <div className="pb-5 pt-3">
                <BlueButton onClick={() => triggerFileInput()} size={"sm"}>
                  Upload from computer
                </BlueButton>
              </div>
            </div>
          )}
        </div>

        {/* Right: Media List */}
        {currentSelectedMedia.length > 0 && (
          <div className="flex flex-col">
            {selectedIndex + 1} of {currentSelectedMedia.length}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-700 overflow-y-scroll h-[20rem] p-4 rounded-lg">
              {currentSelectedMedia.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative flex flex-col items-center justify-center border rounded-lg cursor-pointer p-2 ${
                    index === selectedIndex
                      ? "border-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  {/* "Selected" Label */}
                  {index === selectedIndex && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                      Selected
                    </div>
                  )}

                  {/* Media Preview */}
                  {currentSelectedMedia.length != 0 &&
                  media.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(media)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(media)}
                      className="w-full h-1/2 object-center"
                    />
                  )}

                  {/* Index Display */}
                  <p className="text-sm text-gray-300 mt-2">0{index + 1}</p>

                  {/* Action Buttons */}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2 pt-10 items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={handleDuplicate} asChild>
                    <IconButton
                      className="p-2 dark:bg-gray-800 dark:text-white rounded-full dark:hover:bg-gray-700"
                      title="Duplicate"
                    >
                      <FaCopy />
                    </IconButton>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Duplicate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={handleDelete} asChild>
                    <IconButton
                      className=" dark:text-white !p-0 w-10 h-10  rounded-full"
                      title="Delete"
                    >
                      <GarbageIcon></GarbageIcon>
                    </IconButton>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={triggerFileInput} asChild>
                    <IconButton
                      className="p-2 h-10 w-10 border-1 hover:border-2 light:border-neutral-700 dark:text-white rounded-full"
                      title="Add"
                    >
                      <FaPlus />
                    </IconButton>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Add</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleAdd}
        multiple
        className="hidden"
      />

      {/* Footer Buttons */}
      <div className="flex w-full justify-end gap-2 px-5 mt-8 absolute top-[28.8rem] lg:top-[31.8rem] lg:right-[0.01rem]">
        <TransparentButton
          id="back-button"
          onClick={() => setActiveModal("create-post")}
        >
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            setSelectedMedia(currentSelectedMedia);
            setActiveModal("create-post");
          }}
          disabled={currentSelectedMedia.length === 0}
          id="next-button"
        >
          Next
        </BlueButton>
      </div>
    </div>
  );
};

export default UploadMediaModal;
