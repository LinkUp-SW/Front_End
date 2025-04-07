import React, { useEffect, useRef, useState } from "react";
import TransparentButton from "../buttons/TransparentButton";
import BlueButton from "../buttons/BlueButton";
import { toast } from "sonner";
import { FaCopy, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { RiDeleteBin6Fill as GarbageIcon } from "react-icons/ri";
import IconButton from "../buttons/IconButton";

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
      const images = fileArray.filter((file) => file.type.startsWith("image/"));
      const videos = fileArray.filter((file) => file.type.startsWith("video/"));

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
      setCurrentSelectedMedia([...currentSelectedMedia, ...fileArray]);
    }
  };

  return (
    <div className="flex flex-col  dark:bg-gray-800 !h-[30rem]">
      {/* Selected Media Preview */}

      <div className="flex gap-4 w-full h-full justify-center">
        {/* Left: Selected Media */}
        <div className="flex  h-[30rem] w-[45rem] items-center justify-center dark:border-gray-700 rounded-lg">
          {currentSelectedMedia.length > 0 ? (
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
                {
                  <img
                    src={`../../../../public/feed_upload_media_${darkMode}.svg`}
                    alt="Upload Media"
                    className=""
                  />
                }
              </div>
              <p className="dark:text-neutral-200 pt-2 text-center text-xl font-medium w-full h-full">
                Select files to begin
              </p>
              <p className="dark:text-gray-400 text-sm">
                Share images or a single video in your post.
              </p>
              <div className="pb-5 pt-3">
                {" "}
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
            <div className="flex gap-2 mt-2 items-center justify-center">
              <IconButton
                onClick={handleDuplicate}
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                title="Duplicate"
              >
                <FaCopy />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                className=" text-white !p-0 w-10 h-10  rounded-full"
                title="Delete"
              >
                <GarbageIcon></GarbageIcon>
              </IconButton>
              <IconButton
                onClick={triggerFileInput}
                className="p-2 h-10 w-10 border-1 text-white rounded-full"
                title="Add"
              >
                <FaPlus />
              </IconButton>
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
      <div className="flex w-full justify-end gap-2 px-5 mt-8 absolute top-[31.8rem] right-[0.01rem]">
        <TransparentButton onClick={() => setActiveModal("create-post")}>
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            setSelectedMedia(currentSelectedMedia);
            setActiveModal("create-post");
          }}
          disabled={currentSelectedMedia.length === 0}
        >
          Next
        </BlueButton>
      </div>
    </div>
  );
};

export default UploadMediaModal;
