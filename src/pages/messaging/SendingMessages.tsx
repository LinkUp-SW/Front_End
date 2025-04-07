import { useDispatch } from "react-redux";
import { sendMessage } from "../../slices/messaging/messagingSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsImage } from "react-icons/bs";
import { BsPaperclip } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

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
      message: text,
      media: [],
      media_type: [],
      timestamp: new Date(),
      reacted: false,
      is_seen: true,
      user1_img:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      user2_img:
        "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
      user1_name: "7amada",
      user2_name: "ayhaga2",
    };

    dispatch(
      sendMessage({
        convID: selectedConvID,
        senderID: "user_101",
        user2ID: "user_202",
        user2Name: "ALI",
        lastTextMessage: newMessage.message,
        date: new Date(),
        profileImg:
          "https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg",
        message: newMessage,
      })
    );

    setText("");
  };
  return (
    <>
      {/* File attachments UI */}
      {files.length > 0 && (
        <div className="px-4 space-y-2 mb-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-md border border-gray-200"
            >
              <div className="flex items-center">
                <div className="relative inline-block h-10 w-10 mr-2 bg-gray-200 rounded">
                  <FaFileAlt
                    size={20}
                    className="text-gray-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <div className="inline-block">
                  <p className="text-sm font-medium text-gray-700">
                    {file.name} • {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-xs text-gray-500">Attached</p>
                </div>
              </div>

              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1"
              >
                <IoIosClose id="close-file" size={24} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 flex flex-col">
        {/* Message input area */}
        <div className="px-4 pt-4 pb-2">
          <textarea
            id="text-message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="w-full min-h-24 bg-gray-50 text-gray-700 p-4 rounded-md resize-none outline-none border-none"
          />
        </div>

        {/* Bottom action bar with icons and send button */}
        <div className="flex items-start justify-between px-4 pt-3 pb-15 border-t border-gray-200">
          <div className="flex space-x-4">
            <button
              id="send-message-image"
              className="text-gray-500 hover:text-gray-700"
            >
              <BsImage size={20} />
            </button>

            <label htmlFor="upload-folder" className="cursor-pointer">
              <BsPaperclip
                size={20}
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedFile(!selectedFile)}
              />
              <input
                id="upload-folder"
                type="file"
                multiple
                onChange={handleFileRequest}
                className="hidden"
              />
            </label>

            <button
              id="gif-btn"
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              GIF
            </button>

            <button
              id="emoji-btn"
              onClick={() => setSelectedEmoji(!selectedEmoji)}
              className="text-gray-500 hover:text-gray-700 relative"
            >
              <BsEmojiSmile size={20} />
            </button>

            {selectedEmoji && (
              <div className="absolute bottom-14 left-4 z-10 shadow-lg rounded-lg">
                <EmojiPicker onEmojiClick={handleEmojiRequest} />
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <button
              id="send-message"
              onClick={handleSendMessage}
              disabled={!text.trim()}
              className={`px-4 py-1 rounded-full text-sm ${
                text.trim()
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Send
            </button>

            <button
              id="sending-msg-dots"
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <BsThreeDots size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendingMessages;
