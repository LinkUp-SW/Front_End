import { FaRegImage } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { handleRequest } from "msw";

const SendingMessages = () => {
  const [selectedImage, setSelectedMessages] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState(false);

  const handleEmojiRequest = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setSelectedEmoji(false);
  };

  const handleFileRequest = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(file)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  return (
    <>
      {files.length > 0 && (
        <div>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white p-2 rounded shadow-sm mb-1"
            >
              <div>
                <div className="relative inline-block h-10 w-10 mr-2 bg-[#56687a]">
                  <FaFileAlt size={20} className=" text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   " />
                </div>
                <div className="inline-block">
                  <p>
                    {file.name} •{(file.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-xs">Attached</p>
                </div>
              </div>

              <IoIosClose
                size={30}
                className="inline-block hover:cursor-pointer hover:bg-gray-200 hover:rounded-full"
                onClick={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="h-1/2 border-1 border-[#e8e8e8]">
        <div className="h-1/2 border border-[#e8e8e8] flex justify-center items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message.."
            className="bg-[#f5f3f0] w-[92%] h-[85%] border border-gray-300 rounded-md p-3 overflow-y-auto"
          />
        </div>

        <div className="h-1/2 border-1 border-[#e8e8e8] flex relative">
          <FaRegImage />
          <label htmlFor="uploadFolder">
            <MdAttachFile onClick={() => setSelectedFile(!selectedFile)} />
          </label>
          {selectedFile ? (
            <input
              type="file"
              multiple
              id="uploadFolder"
              onChange={handleFileRequest}
              className="hidden"
            ></input>
          ) : (
            ""
          )}

          <MdOutlineEmojiEmotions
            onClick={() => setSelectedEmoji(!selectedEmoji)}
          />
          {selectedEmoji ? (
            <div className="absolute bottom-30 left-10 h-50 overflow-auto">
              <EmojiPicker onEmojiClick={handleEmojiRequest} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default SendingMessages;
