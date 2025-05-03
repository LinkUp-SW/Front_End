import { BsImage } from "react-icons/bs";
import { BsPaperclip } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { setShowPopup } from "../../slices/messaging/messagingSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Cookies from "js-cookie";
import { startConversation } from "@/endpoints/messaging";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const NewMessage = () => {
  const navigate = useNavigate();
  const [textMessage, setTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("linkup_auth_token");

  const dispatch = useDispatch();
  const handleClosePopUp = () => {
    dispatch(setShowPopup(false));
  };
  const goToMessaging = () => {
    navigate("/messaging");
  };
   const user2Id = useSelector(
      (state: RootState) => state.messaging.user2IdPop
    );
    const user2Name = useSelector(
      (state: RootState) => state.messaging.user2NamePop
    );
    const user2ProfilePicture = useSelector(
        (state: RootState) => state.messaging.user2ProfilePicturePop
        );
    const user2Headline = useSelector(
        (state: RootState) => state.messaging.user2HeadlinePop
        );
        const handleStartConversation = async () => {
            if (!textMessage.trim()) {
              return;
            }
          
            setIsLoading(true);
            try {
              if (!user2Id) {
                console.error("Missing user2Id");
                return;
              }
              
              const response = await startConversation(
                token!,
                user2Id,
                textMessage
              );
              
              console.log("Conversation started with ID:", response.conversationId);
              setTextMessage("");
              dispatch(setShowPopup(false));
              goToMessaging();
            } catch (error) {
              console.error("Failed to start conversation:", error);

            } finally {
              setIsLoading(false);
            }
          };
  return (
    <div className="flex flex-col w-full h-full border-2 rounded-xl bg-white shadow-xl">
      <div
        id="part1NewMessage"
        className="flex justify-between items-center p-4 bg-white border-b-2 border-gray-200"
      >
        <h2 className="text-lg font-semibold">New Message</h2>

        <div className="hover:cursor-pointer hover:bg-gray-200 hover:rounded-full">
          <IoIosClose onClick={handleClosePopUp} size={30} />
        </div>
      </div>

      <div
        id="part2"
        className="flex justify-between items-center p-4 bg-white border-b-2 border-gray-200"
      >
        <button className="bg-[#01754ee5] font-bold text-white px-4 py-1 rounded-4xl hover:bg-[#01754e] transition duration-200 ease-in-out">
          {user2Name}
          <span>
            {" "}
            <div
              className="inline-block hover:cursor-pointer font-extrabold hover:rounded-full"
              style={{
                width: "30px",
                height: "30px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              <IoIosClose onClick={handleClosePopUp} size={30} />s
            </div>
          </span>
        </button>
      </div>

      <div
        id="part3"
        className="flex flex-col p-4 bg-white border-b-2 border-gray-200"
      >
        <div className="w-22 h-22 mb-2 rounded-full overflow-hidden mr-4 border-1 bordrer-green-500">
          <img
            src={user2ProfilePicture}
            alt="profile picture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800">{user2Name}</h3>
            <span className="mx-2 text-gray-400">·</span>
            <span className="text-gray-400 text-sm">1st</span>
          </div>
          <p className="text-gray-600 text-sm">
            {user2Headline}
          </p>
        </div>
      </div>

      <div id="part4" className="flex-1 pl-5 pt-3 bg-white">
        <textarea
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          placeholder="Write a message..."
          className="rounded-xl w-[90%] h-[95%] p-4 bg-[#f4f2ee] border-none outline-none resize-none"
        />
      </div>

      <div
        id="part5"
        className="pl-5 flex items-center justify-between p-2 bg-white border-t-2 border-gray-200"
      >
        <div className="flex items-center">
          <button className="p-2 text-gray-500">
            <BsImage />
          </button>

          <button className="p-2 text-gray-500">
            <BsPaperclip />
          </button>

          <button id="gif-btn" className="p-2 text-gray-500 font-medium">
            GIF
          </button>

          <button className="p-2 text-gray-500">
            <BsEmojiSmile />
          </button>
        </div>
        <button
          onClick={handleStartConversation}
          disabled={isLoading || !textMessage.trim()}
          className="px-6 py-2 bg-gray-200 text-gray-500 rounded-full font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default NewMessage;
