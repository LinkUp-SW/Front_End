import { useDispatch } from "react-redux";
import {
  setEditingMessageId,
} from "../../slices/messaging/messagingSlice";
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
import { editMessage } from "@/endpoints/messaging";
import Cookies from "js-cookie";
import {
  setEditText,
  clearEditingState,
  setChatData,
  setEditedMessageIds,
} from "../../slices/messaging/messagingSlice";
import { toast } from "sonner";
import { socketService } from "@/services/socket";
import { useParams } from "react-router-dom";
import { MessageChat } from "@/endpoints/messaging";

const SendingMessages = () => {
  const { id } = useParams();
  let typingTimeout: NodeJS.Timeout;
  const token = Cookies.get("linkup_auth_token");
  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );
  const selectedUser2ID = useSelector(
    (state: RootState) => state.messaging.user2Id
  );
  const editingMessageId = useSelector(
    (state: RootState) => state.messaging.editingMessageId
  );

  const editText = useSelector((state: RootState) => state.messaging.editText);
  const dataChat = useSelector((state: RootState) => state.messaging.chatData);
  const editedMessageIds = useSelector(
    (state: RootState) => state.messaging.setEditedMessageIds
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

    const newMsg: MessageChat = {
      messageId: `temp-${Date.now()}`,
      senderId: id!,
      senderName: "YOU",
      message: text,
      media: [],
      timestamp: new Date().toISOString(),
      reacted: false,
      isSeen: false,
      isOwnMessage: true,
      isDeleted: false,
      isEdited: false,
    };

    dispatch(
      setChatData({
        ...dataChat!,
        messages: [...(dataChat?.messages || []), newMsg],
      })
    );
    socketService.sendPrivateMessage(selectedUser2ID, text, []);
    setText("");
  };

  const handleEditingMsgSave = async () => {
    if (!editText.trim()) return;
    try {
      await editMessage(token!, selectedConvID, editingMessageId, editText);
      dispatch(clearEditingState());
      dispatch(setEditedMessageIds([...editedMessageIds, editingMessageId]));
      dispatch(
        setChatData({
          ...dataChat,
          messages: dataChat.messages.map((msg) =>
            msg.messageId === editingMessageId
              ? { ...msg, message: editText, isEdited: true }
              : msg
          ),
        })
      );

      toast.success("Message updated successfully");
    } catch (error) {
      console.error("Error editing message:", error);
      toast.error("Failed to update message");
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    socketService.sendTypingIndicator(selectedConvID);

    // Clear previous timer and start a new one to emit stop typing after a delay
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socketService.sendStopTypingIndicator(selectedConvID);
    }, 3000);
  };
  return (
    <>
      {/* File attachments UI */}
      {files.length > 0 && (
        <div className="px-4 space-y-2 mb-2 flex-shrink-0">
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

      <div className="border-t border-gray-200 flex flex-col flex-shrink-0 bg-[#f4f2ee]">
        {editingMessageId ? (
          <div className="w-full p-7">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Edit message
            </p>

            <div className="pl-3 pt-3 pb-3 pr-15 border-1 bg-white">
              <textarea
                id="edit-text-message"
                value={editText}
                onChange={(e) => dispatch(setEditText(e.target.value))}
                placeholder="Edit your message..."
                className="bg-[#f4f2ee] w-full min-h-[80px]  text-gray-800 p-3 rounded-md resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <button
                id="emoji-btn"
                onClick={() => setSelectedEmoji(!selectedEmoji)}
                className="text-gray-500 hover:text-blue-600"
                title="Add Emoji"
              >
                <BsEmojiSmile size={22} />
              </button>

              <div className="space-x-2">
                <button
                  id="cancel-edit-message"
                  onClick={() => {
                    dispatch(setEditingMessageId(""));
                    setEditText("");
                  }}
                  className="px-4 py-1 rounded-full text-sm  border border-blue-700 text-blue-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  id="save-edit-message"
                  onClick={handleEditingMsgSave}
                  disabled={!editText.trim()}
                  className={`px-4 py-1 rounded-full text-sm ${
                    editText.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white  dark:bg-gray-800 pt-3s">
            <div className="px-4 pt-2 pb-1">
              <textarea
                id="text-message"
                value={text}
                onChange={handleInputChange}
                placeholder="Write a message..."
                className="w-full min-h-16 max-h-24 bg-[#f4f2ee] text-gray-700 p-3 rounded-md resize-none outline-none border-none"
              />
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
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
        )}
      </div>
    </>
  );
};

export default SendingMessages;
