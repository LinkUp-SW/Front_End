import { useDispatch } from "react-redux";
import { sendMessage } from "../../slices/messaging/messagingSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FaRegImage } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const SendingMessages = () => {
  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );
  const dispatch = useDispatch();
  /* const [selectedImage, setSelectedMessages] = useState("");*/
  const [selectedEmoji, setSelectedEmoji] = useState(false);
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState(false);

  const handleEmojiRequest = (emoji: { emoji: string }) => {
    setText((prevMessage) => prevMessage + emoji.emoji);
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

  const handleSendMessage = () => {
    if (!text.trim()) return;
    const newMessage = {
      id: new Date().toISOString(),
      Img: "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      name: "You", // You can adjust this based on logged-in user
      message: text,
      date: Date.now(),
    };

    dispatch(
      sendMessage({
        senderID: "10",
        profileImg:
          "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        convID: selectedConvID,
        message: newMessage,
      })
    );

    setText("");
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
                  <FaFileAlt
                    size={20}
                    className=" text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   "
                  />
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message.."
            className="bg-[#f5f3f0] w-[92%] h-[85%] border border-gray-300 rounded-md p-3 overflow-y-auto"
          />
        </div>

        <div className="h-1/2 border-1 border-[#e8e8e8] flex relative justify-between">
          <div className=" flex p-5">
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

          <button
            onClick={handleSendMessage}
            disabled={!text.trim()}
            className={`m-5 h-5 w-15 align-middle rounded-md text-white ${
              text.trim() ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            send
          </button>
        </div>
      </div>
    </>
  );
};

export default SendingMessages;
