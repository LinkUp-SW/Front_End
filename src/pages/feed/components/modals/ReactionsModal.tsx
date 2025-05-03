import { getReactions } from "@/endpoints/feed";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CelebrateIcon from "@/assets/Celebrate.svg";
import LikeIcon from "@/assets/Like.svg";
import LoveIcon from "@/assets/Love.svg";
import FunnyIcon from "@/assets/Funny.svg";
import InsightfulIcon from "@/assets/Insightful.svg";
import SupportIcon from "@/assets/Support.svg";
import { PostUserType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface TabData {
  reactions: Reaction[];
  hasLoaded: boolean;
  nextCursor: number | null;
}

interface TabsCache {
  [key: string]: TabData;
}

interface Reaction {
  _id: string;
  author: PostUserType;
  reaction: string;
}

interface ReactionCounts {
  [key: string]: number;
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
  const [tabsCache, setTabsCache] = useState<TabsCache>({});
  const [currentCursor, setCurrentCursor] = useState<number | null>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const emojiMap: Record<string, string> = {
    like: LikeIcon,
    insightful: InsightfulIcon,
    funny: FunnyIcon,
    celebrate: CelebrateIcon,
    love: LoveIcon,
    support: SupportIcon,
  };

  // Memoize the grouped reactions
  // Modify the groupedReactions memoization
  const groupedReactions = useMemo<{ [key: string]: Reaction[] }>(() => {
    if (activeTab === "all") {
      return { all: reactionList };
    }

    // If we're on a specific tab, only return those reactions
    return {
      [activeTab]: reactionList.filter(
        (reaction) => reaction.reaction.toLowerCase() === activeTab
      ),
    };
  }, [reactionList, activeTab]);

  // Memoize the tabs with correct counts
  const tabs = useMemo(() => {
    return [
      { label: "All", key: "all", count: totalCount },
      ...Object.entries(reactionCounts)
        .filter(([, count]) => count > 0)
        .map(([key, count]) => ({
          label: emojiMap[key.toLowerCase()],
          key: key.toLowerCase(),
          count,
        })),
    ];
  }, [reactionCounts, totalCount]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        toast.error("You must be logged in to view reactions.");
        navigate("/login", { replace: true });
        return;
      }

      setIsLoading(true);
      try {
        const result = await getReactions(
          {
            cursor: 0,
            limit: 1,
            specificReaction: null,
            targetType: commentId ? "Comment" : "Post",
            commentId: commentId || null,
          },
          postId,
          token
        );

        const reactions = result.reactions.reactions || [];
        setReactionList(reactions);
        setReactionCounts(result.reactions.reaction_counts || {});
        setCurrentCursor(result.reactions.next_cursor || null);
        setHasMore(!!result.reactions.next_cursor);
        // Set the total count from API response
        setTotalCount(result.reactions.reactions_count || 0);

        setTabsCache({
          all: {
            reactions,
            hasLoaded: true,
            nextCursor: result.reactions.next_cursor || null,
          },
        });
      } catch (error) {
        toast.error("Failed to fetch reactions.");
        console.error("Error fetching initial reactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [postId, commentId]);

  useEffect(() => {
    const fetchReactionsByTab = async () => {
      if (tabsCache[activeTab]?.hasLoaded) {
        setReactionList(tabsCache[activeTab].reactions);
        setCurrentCursor(tabsCache[activeTab].nextCursor || null);
        setHasMore(!!tabsCache[activeTab].nextCursor);
        return;
      }

      if (!token) return;

      setIsLoading(true);
      try {
        const result = await getReactions(
          {
            cursor: 0,
            limit: 1,
            specificReaction: activeTab === "all" ? null : activeTab,
            targetType: commentId ? "Comment" : "Post",
            commentId: commentId || null,
          },
          postId,
          token
        );

        const reactions = result.reactions.reactions || [];
        setReactionList(reactions);
        setCurrentCursor(result.reactions.next_cursor || null);
        setHasMore(!!result.reactions.next_cursor);

        setTabsCache((prev) => ({
          ...prev,
          [activeTab]: {
            reactions,
            hasLoaded: true,
            nextCursor: result.reactions.next_cursor || null,
          },
        }));
      } catch (error) {
        toast.error("Failed to fetch reactions.");
        console.error("Error fetching reactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactionsByTab();
  }, [activeTab, postId, commentId]);

  const handleLoadMore = async () => {
    if (!token || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const result = await getReactions(
        {
          cursor: currentCursor,
          limit: 1,
          specificReaction: activeTab === "all" ? null : activeTab,
          targetType: commentId ? "Comment" : "Post",
          commentId: commentId || null,
        },
        postId,
        token
      );

      const newReactions = result.reactions.reactions || [];
      setReactionList((prev) => [...prev, ...newReactions]);
      setCurrentCursor(result.reactions.next_cursor || null);
      setHasMore(!!result.reactions.next_cursor);

      setTabsCache((prev) => ({
        ...prev,
        [activeTab]: {
          reactions: [...(prev[activeTab]?.reactions || []), ...newReactions],
          hasLoaded: true,
          nextCursor: result.reactions.next_cursor || null,
        },
      }));
    } catch (error) {
      toast.error("Failed to load more reactions");
      console.error("Error loading more reactions:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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

      <div className="overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full dark:bg-gray-700" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[25%] dark:bg-gray-700" />
                  <Skeleton className="h-3 w-[50%] dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : (groupedReactions[activeTab] || []).length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No reactions yet
          </div>
        ) : (
          // Now using groupedReactions for rendering
          groupedReactions[activeTab].map((reaction) => (
            <Link
              key={reaction._id}
              to={`/user-profile/${reaction?.author?.username}`}
            >
              <div className="flex cursor-pointer items-center w-full justify-between gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex">
                  <img
                    src={reaction?.author?.profile_picture}
                    alt={reaction?.author?.username}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {reaction?.author?.first_name}{" "}
                      {reaction?.author?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {reaction?.author?.headline}
                    </p>
                  </div>
                </div>

                <img
                  src={emojiMap[reaction?.reaction]}
                  className="w-8 h-8"
                ></img>
              </div>
            </Link>
          ))
        )}
        {!isLoading && hasMore && (
          <div className="p-4 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:hover:no-underline flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                "Show more results"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionsModal;
