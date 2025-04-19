import React, { useState } from "react";

interface Reaction {
  id: number;
  name: string;
  title: string;
  profileImage: string;
  reactionType: string; // e.g., "like", "love", "insightful", etc.
}

interface ReactionsModalProps {
  reactions: Reaction[];
}

const ReactionsModal: React.FC<ReactionsModalProps> = ({ reactions }) => {
  const [activeTab, setActiveTab] = useState("all");

  // Group reactions by type
  const groupedReactions = reactions.reduce<Record<string, Reaction[]>>(
    (acc, reaction) => {
      acc[reaction.reactionType] = acc[reaction.reactionType] || [];
      acc[reaction.reactionType].push(reaction);
      return acc;
    },
    { all: reactions }
  );

  const tabs = [
    { label: `All ${groupedReactions.all.length}`, key: "all" },
    { label: `❤️ ${groupedReactions.like?.length || 0}`, key: "like" },
    {
      label: `💡 ${groupedReactions.insightful?.length || 0}`,
      key: "insightful",
    },
    { label: `😂 ${groupedReactions.funny?.length || 0}`, key: "funny" },
  ];

  return (
    <div className="flex-col flex dark:bg-gray-900 h-[32rem]">
      <div className="flex border-b dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-center py-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-green-700 text-green-700 dark:border-green-500 dark:text-green-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className=" overflow-y-auto ">
        {groupedReactions[activeTab]?.map((reaction) => (
          <div
            key={reaction.id}
            className="flex cursor-pointer items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={() => {}}
          >
            <img
              src={reaction.profileImage}
              alt={reaction.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {reaction.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reaction.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionsModal;
