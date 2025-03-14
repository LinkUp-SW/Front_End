import { useState } from "react";
import withSidebarAd from "@/components/hoc/withSidebarAd";

const mockReceivedInvitations = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Software Engineer at Google",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
    mutualConnections: 2,
  },
  {
    id: 2,
    name: "Bob Smith",
    title: "Data Scientist at Amazon",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
    mutualConnections: 5,
  },
];

const mockSentInvitations = [
  {
    id: 3,
    name: "Charlie Brown",
    title: "Product Manager at Facebook",
    image:
      "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
    sentDate: "Sent 1 week ago",
  },
  {
    id: 4,
    name: "David Lee",
    title: "UX Designer at Apple",
    image:
      "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
    sentDate: "Sent 2 weeks ago",
  },
];

const ManageInvitations: React.FC = () => {
  const [activeTab, setActiveTab] = useState("received");

  const ignoreInvitation = (id: number) => {
    console.log(`Ignored invitation with ID: ${id}`);
  };

  const acceptInvitation = (id: number) => {
    console.log(`Accepted invitation with ID: ${id}`);
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all flex flex-col max-h-fit">
      {/* Heading inside card */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Manage Invitations
      </h2>

      {/* Tabs */}
      <div className="flex border-b-2 border-gray-300">
        <button
          className={`w-1/2 text-center py-2 text-sm sm:text-base font-semibold cursor-pointer ${
            activeTab === "received"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received Invitations
        </button>
        <button
          className={`w-1/2 text-center py-2 text-sm sm:text-base font-semibold cursor-pointer ${
            activeTab === "sent"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Invitations
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 p-4 flex-grow min-h-0 cursor-pointer">
        {activeTab === "received"
          ? mockReceivedInvitations.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col sm:flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <img
                  src={invite.image}
                  alt={invite.name}
                  className="w-14 h-14 rounded-full border border-gray-300"
                />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                    {invite.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {invite.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {invite.mutualConnections} mutual connections
                  </p>
                  <a
                    href="#"
                    className="text-blue-500 text-xs sm:text-sm hover:underline"
                  >
                    Message
                  </a>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0 sm:ml-auto">
                  <button
                    onClick={() => ignoreInvitation(invite.id)}
                    className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer text-sm sm:text-base"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => acceptInvitation(invite.id)}
                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          : mockSentInvitations.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col sm:flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <img
                  src={invite.image}
                  alt={invite.name}
                  className="w-14 h-14 rounded-full border border-gray-300"
                />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                    {invite.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {invite.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {invite.sentDate}
                  </p>
                </div>
                <div className="flex justify-center w-full sm:justify-start sm:w-auto sm:ml-auto">
                  <button className="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 cursor-pointer text-sm sm:text-base">
                    Withdraw
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default withSidebarAd(ManageInvitations);
