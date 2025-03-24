import withSidebarAd from "@/components/hoc/withSidebarAd";
import { useState, useCallback } from "react";
import {
  fetchFollowers,
  fetchFollowing,
  FollowingFollowers as User,
} from "@/endpoints/myNetwork";

const FollowingFollowers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    "following"
  );
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);

  // Fetch following
  const loadFollowing = useCallback(async () => {
    try {
      const data = await fetchFollowing();
      setFollowing(data);
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
  }, []);

  // Fetch followers
  const loadFollowers = useCallback(async () => {
    try {
      const data = await fetchFollowers();
      setFollowers(data);
    } catch (error) {
      console.error("Error fetching followers list:", error);
    }
  }, []);

  // Initial manual triggers with useState callbacks
  useState(() => {
    loadFollowing();
    loadFollowers();
  });

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all flex flex-col max-h-fit">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 text-lg font-semibold transition-colors ${
            activeTab === "following"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold transition-colors ${
            activeTab === "followers"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 p-4 flex-grow min-h-0">
        {(activeTab === "following" ? following : followers).map(
          (user, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <div className="ml-4 flex-1">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.title}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors">
                {activeTab === "following" ? "Following" : "Follow"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default withSidebarAd(FollowingFollowers);
