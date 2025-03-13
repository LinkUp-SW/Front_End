import { useState } from "react";
import withSidebarAd from "@/components/hoc/withSidebarAd";

const mockReceivedInvitations = [
  {
    name: "Alice Johnson",
    title: "Software Engineer at Google",
    image: "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
  {
    name: "Bob Smith",
    title: "Data Scientist at Amazon",
    image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
];

const mockSentInvitations = [
  {
    name: "Charlie Brown",
    title: "Product Manager at Facebook",
    image: "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
  },
  {
    name: "David Lee",
    title: "UX Designer at Apple",
    image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
  },
];

const ManageInvitations: React.FC = () => {
  const [activeTab, setActiveTab] = useState("received");

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all flex flex-col max-h-fit">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 text-lg font-semibold transition-colors ${
            activeTab === "received" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received Invitations
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold transition-colors ${
            activeTab === "sent" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Invitations
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 p-4 flex-grow min-h-0">
        {(activeTab === "received" ? mockReceivedInvitations : mockSentInvitations).map((user, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full border border-gray-300" />
            <div className="ml-4 flex-1">
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.title}</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors">
              {activeTab === "received" ? "Accept" : "Cancel"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default (withSidebarAd(ManageInvitations));

