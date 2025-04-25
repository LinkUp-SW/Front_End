import { getReactions } from "@/endpoints/feed";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import LoveIcon from "@/assets/Love.svg";
import FunnyIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";

interface Reaction {
  _id: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    headline: string;
  };
  reaction: string;
}

interface ReactionCounts {
  like?: number;
  love?: number;
  celebrate?: number;
  support?: number;
  insightful?: number;
  funny?: number;
}

const token = Cookies.get("linkup_auth_token");

interface ReactionsModalProps {
  postId: string;
  commentId?: string;
}

const ReactionsModal: React.FC<ReactionsModalProps> = ({
  postId,
  commentId,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [reactionList, setReactionList] = useState<Reaction[]>([]);
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReactions = async () => {
      if (!token) {
        toast.error("You must be logged in to view reactions.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const result = await getReactions(
          {
            cursor: 0,
            limit: 50,
            specificReaction: activeTab === "all" ? null : activeTab,
            targetType: commentId ? "Comment" : "Post",
            commentId: commentId || null,
          },
          postId,
          token
        );

        setReactionList(result.reactions.reactions || []);
        setReactionCounts(result.reactions.reactionCounts || {});
      } catch (error) {
        toast.error("Failed to fetch reactions.");
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [postId, commentId, activeTab]);

  const groupedReactions = reactionList.reduce<Record<string, Reaction[]>>(
    (acc, reaction) => {
      const type = reaction.reaction;
      acc[type] = acc[type] || [];
      acc[type].push(reaction);
      return acc;
    },
    { all: reactionList }
  );

  const emojiMap: Record<string, string> = {
    like: LikeIcon,
    insightful: InsightfulIcon,
    funny: FunnyIcon,
    celebrate: CelebrateIcon,
    love: LoveIcon,
    support: SupportIcon,
  };

  const tabs = [
    { label: "All", key: "all", count: reactionList.length },
    ...Object.entries(reactionCounts)
      .filter(([, count]) => count && count > 0)
      .map(([key, count]) => ({
        label: emojiMap[key],
        key,
        count,
      })),
  ];

  return (
    <div className="flex-col flex dark:bg-gray-900 h-[32rem]">
      <div className="flex border-b dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-center py-2 text-sm font-medium flex items-center justify-center gap-1 ${
              activeTab === tab.key
                ? "border-b-2 border-green-700 text-green-700 dark:border-green-500 dark:text-green-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.label === "All" ? (
              <>
                <span>All</span>
                <span>{tab.count}</span>
              </>
            ) : (
              <>
                <img src={tab.label} alt={tab.key} className="w-4 h-4" />
                <span>{tab.count}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Reactions list */}
      <div className="overflow-y-auto">
        {(groupedReactions[activeTab] || []).map((reaction) => (
          <div
            key={reaction._id}
            className="flex cursor-pointer items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <img
              src={reaction.author.profilePicture}
              alt={reaction.author.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {reaction.author.firstName} {reaction.author.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reaction.author.headline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionsModal;
