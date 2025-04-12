import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";

const ChatingScreen = () => {
  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );

  const user2Name = useSelector(
    (state: RootState) => state.messaging.user2Name
  );

  const userStatus = useSelector(
    (state: RootState) => state.messaging.userStatus
  );
  // Find conversation based on selected ID
  const conversation = useSelector((state: RootState) =>
    state.messaging.conversations.find(
      (conv) => conv.conversationID === selectedConvID
    )
  );

  const starredConversations = useSelector(
    (state: RootState) => state.messaging.starredConversations
  );
  const isCurrentConversationStarred =
    starredConversations.includes(selectedConvID);

  const messages = conversation ? conversation.user1_sent_messages : [];

  const shouldShowProfile = (index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    const currentMessage = messages[index];

    if (!prevMessage || !currentMessage) return true;

    const prevMsgTime = new Date(prevMessage.timestamp).getTime();
    const currentMsgTime = new Date(currentMessage.timestamp).getTime();
    return currentMsgTime - prevMsgTime > 10 * 1000;
  };

  return (
    <>
      <div className=" flex-column h-full">
        {/* Chat Header */}
        <div className=" border border-[#e8e8e8] flex justify-between items-center px-3 py-3">
          <div>
            <p id="user2Name" className="font-semibold">
              {user2Name}
            </p>
            <p id="userStatuse" className="text-xs text-gray-500">
              {userStatus}
            </p>
          </div>
          <div className="flex space-x-4">
            <HiOutlineDotsHorizontal
              id="dots-chat"
              size={25}
              className="hover:rounded-full hover:bg-gray-200 hover:cursor-pointer"
            />
            {isCurrentConversationStarred ? (
              <FaStar
                id="star"
                size={25}
                className="hover:rounded-full hover:cursor-pointer text-[#c37d16]"
              />
            ) : (
              <IoIosStarOutline
                id="unfilled-star"
                size={25}
                className="hover:rounded-full hover:cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div className=" border border-[#e8e8e8] overflow-y-auto p-3">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id}>
                {shouldShowProfile(index) ? (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <img
                        id="user1-img"
                        className="rounded-full w-10 h-10"
                        src={msg.user1_img}
                        alt="Profile"
                      />
                      <p id="user1-name" className="pl-3 font-semibold">
                        {msg.user1_name}
                        <span className="text-xs text-gray-500">
                          {" "}
                          · {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                    <div className="w-full hover:bg-gray-200 pl-14 ">
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div className="w-full hover:bg-gray-200 pl-14 ">
                    {msg.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ChatingScreen;
