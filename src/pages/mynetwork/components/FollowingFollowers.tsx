import { useState, useEffect, useCallback } from "react";
import {
  fetchFollowing,
  Following,
  Followers,
  fetchFollowers,
  UnfollowUser,
  FollowUser,
} from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import withSidebarAd from "@/components/hoc/withSidebarAd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components";
import UnfollowUserModal from "./modals/UnfollowUserModal";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

const FollowingFollowers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [following, setFollowing] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Followers[]>([]);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("linkup_auth_token");

  // Load following & followers
  const loadFollowingFollowers = useCallback(async () => {
    if (!token) {
      console.error("No authentication token found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const [followingRes, followersRes] = await Promise.all([
        fetchFollowing(token),
        fetchFollowers(token),
      ]);

      if (followingRes?.following && Array.isArray(followingRes.following)) {
        setFollowing(followingRes.following);
      } else {
        setFollowing([]);
      }

      if (followersRes?.followers && Array.isArray(followersRes.followers)) {
        setFollowers(
          followersRes.followers.map((user) => ({
            ...user,
            isFollowing: followingRes.following.some((f) => f.user_id === user.user_id),
          }))
        );
      } else {
        setFollowers([]);
      }
    } catch (error) {
      console.error("Error fetching following or followers:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Call function on component mount and when activeTab changes
  useEffect(() => {
    loadFollowingFollowers();
  }, [loadFollowingFollowers]);

  // Handle Unfollow
  const handleUnfollowUser = useCallback(async (userId: string) => {
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await UnfollowUser(token, userId);
      // Re-fetch data after unfollowing
      loadFollowingFollowers();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  }, [token, loadFollowingFollowers]);

  // Handle Follow
  const handleFollowUser = useCallback(async (userId: string) => {
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await FollowUser(token, userId);
      // Re-fetch data after following
      loadFollowingFollowers();
    } catch (error) {
      console.error("Error following user:", error);
    }
  }, [token, loadFollowingFollowers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all flex flex-col max-h-fit">
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

      <div className="space-y-4 p-4 flex-grow min-h-0">
        {(activeTab === "followers" ? followers : following).map((user) => (
          <div
            key={user.user_id}
            className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-12 h-12 rounded-full border border-gray-300"
            />
            <div className="ml-4 flex-1">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.headline}
              </p>
            </div>
            {activeTab === "following" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600 transition-colors">
                    Unfollow
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <UnfollowUserModal
                    userData={{ userName: user.name, userId: user.user_id }}
                    onConfirm={() => handleUnfollowUser(user.user_id)}
                  />
                <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
            ) : (user as Followers).following ?  (
              <Dialog>
                <DialogTrigger asChild>
                  <span>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600 transition-colors">
                      Unfollow
                    </button>
                  </span>
                </DialogTrigger>
                <DialogContent>
                  <UnfollowUserModal
                    userData={{ userName: user.name, userId: user.user_id }}
                    onConfirm={() => handleUnfollowUser(user.user_id)}
                  />
                  <DialogHeader>
                    <DialogTitle>Unfollow {user.name}?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to unfollow {user.name}?
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                onClick={() => handleFollowUser(user.user_id)}
              >
                Follow
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withSidebarAd(FollowingFollowers);
