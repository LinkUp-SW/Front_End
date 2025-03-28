import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosStarOutline } from "react-icons/io";

const ChatingScreen = () => {
  const selectedConvID = useSelector(
    (state: RootState) => state.messaging.selectedMessages
  );

  // Find conversation based on selected ID
  const conversation = useSelector((state: RootState) =>
    state.messaging.conversations.find(
      (conv) => conv.conversationID === selectedConvID
    )
  );

  const messages = conversation ? conversation.messages : [];

  const shouldShowProfile = (index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    const currentMessage = messages[index];

    if (!prevMessage || !currentMessage) return true;

    const prevMsgTime = new Date(prevMessage.date).getTime();
    const currentMsgTime = new Date(currentMessage.date).getTime();
    return currentMsgTime - prevMsgTime > 60 * 1000;
  };

  return (
    <>
      <div className="h-1/2">
        {/* Chat Header */}
        <div className="h-1/5 border border-[#e8e8e8] flex justify-between items-center px-3 py-6">
          <div>
            <p className="font-semibold">Mohanad Tarek</p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
          <div className="flex space-x-4">
            <HiOutlineDotsHorizontal
              size={30}
              className="hover:rounded-full hover:bg-gray-200 hover:cursor-pointer"
            />
            <IoIosStarOutline
              size={30}
              className="hover:rounded-full hover:bg-gray-200 hover:cursor-pointer"
            />
          </div>
        </div>

        {/* Messages Section */}
        <div className="h-4/5 border border-[#e8e8e8] overflow-y-auto p-3">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id}>
                {shouldShowProfile(index) ? (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <img
                        className="rounded-full w-10 h-10"
                        src={msg.Img}
                        alt="Profile"
                      />
                      <p className="pl-3 font-semibold">
                        {msg.name}
                        <span className="text-xs text-gray-500">
                          {" "}
                          · {new Date(msg.date).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                    <div className="ml-14 hover:bg-gray-200 p-2 rounded-lg">
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div className="ml-14 hover:bg-gray-200 p-2 rounded-lg">
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
