import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchFollowing,
  Following,
  Followers,
  fetchFollowers,
  unfollowUser,
  followUser,
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LIMIT = 100; // Number of items per page

const FollowingFollowers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    "following"
  );
  const [following, setFollowing] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Followers[]>([]);
  const [nextCursorFollowing, setNextCursorFollowing] = useState<string | null>(
    null
  );
  const [nextCursorFollowers, setNextCursorFollowers] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const navigateToUser = (user_id: string) => {
    return navigate(`/user-profile/${user_id}`);
  };

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
        fetchFollowing(token, null, LIMIT),
        fetchFollowers(token, null, LIMIT),
      ]);

      if (followingRes?.following) {
        setFollowing(followingRes.following);
        setNextCursorFollowing(followingRes.nextCursor || null);
      }

      if (followersRes?.followers) {
        setFollowers(
          followersRes.followers.map((user) => ({
            ...user,
            isFollowing: followingRes.following.some(
              (f) => f.user_id === user.user_id
            ),
          }))
        );
        setNextCursorFollowers(followersRes.nextCursor || null);
      }
    } catch (error) {
      console.error("Error fetching following or followers:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch more data when scrolling reaches bottom
  const loadMoreData = useCallback(async () => {
    if (!token || loading || !hasMore) return;

    setLoading(true);
    try {
      if (activeTab === "following" && nextCursorFollowing) {
        const res = await fetchFollowing(token, nextCursorFollowing, LIMIT);
        setFollowing((prev) => [...prev, ...res.following]);
        setNextCursorFollowing(res.nextCursor || null);
        if (!res.nextCursor) setHasMore(false);
      } else if (activeTab === "followers" && nextCursorFollowers) {
        const res = await fetchFollowers(token, nextCursorFollowers, LIMIT);
        setFollowers((prev) => [...prev, ...res.followers]);
        setNextCursorFollowers(res.nextCursor || null);
        if (!res.nextCursor) setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    token,
    activeTab,
    nextCursorFollowing,
    nextCursorFollowers,
    loading,
    hasMore,
  ]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadMoreData]);

  useEffect(() => {
    loadFollowingFollowers();
  }, [loadFollowingFollowers]);

  // Handle Unfollow
  const handleUnfollowUser = useCallback(
    async (userId: string) => {
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        await unfollowUser(token, userId);
        toast.success("You unfollowed the user successfully!");
        // Re-fetch data after unfollowing
        loadFollowingFollowers();
      } catch (error) {
        console.error("Error unfollowing user:", error);
        toast.error("Failed to unfollow the user.");
      }
    },
    [token, loadFollowingFollowers]
  );

  // Handle Follow
  const handleFollowUser = useCallback(
    async (userId: string) => {
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        await followUser(token, userId);
        toast.success("You followed the user successfully!");
        // Re-fetch data after following
        loadFollowingFollowers();
      } catch (error) {
        console.error("Error following user:", error);
        toast.error("Failed to follow the user.");
      }
    },
    [token, loadFollowingFollowers]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-4 transition-all flex flex-col h-full overflow-hidden">
      <div className="flex border-b">
        <button
          id="following-tab-button"
          className={`px-3 py-2 sm:px-4 text-sm sm:text-lg font-semibold transition-colors ${
            activeTab === "following"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => {
            setActiveTab("following");
            setHasMore(true);
          }}
        >
          Following
        </button>
        <button
          id="followers-tab-button"
          className={`px-3 py-2 sm:px-4 text-sm sm:text-lg font-semibold transition-colors ${
            activeTab === "followers"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => {
            setActiveTab("followers");
            setHasMore(true);
          }}
        >
          Followers
        </button>
      </div>

      <div className="space-y-3 p-2 sm:p-4 flex-grow overflow-y-auto">
        {(activeTab === "followers" ? followers : following).map((user) => (
          <div
            key={user.user_id}
            className="flex items-center p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 cursor-pointer"
              onClick={() => navigateToUser(user.user_id)}
            />
            <div className="ml-3 flex-1 min-w-0">
              <p
                className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white cursor-pointer truncate"
                onClick={() => navigateToUser(user.user_id)}
                id="user-name-link"
              >
                {user.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                {user.headline}
              </p>
            </div>
            {activeTab === "following" ? (
              <Dialog
                open={openDialogUserId === user.user_id}
                onOpenChange={(open) => {
                  if (!open) setOpenDialogUserId(null);
                }}
              >
                <DialogTrigger asChild>
                  <button
                    id="unfollow-button-1"
                    className="px-2 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600 transition-colors text-xs sm:text-base whitespace-nowrap"
                    onClick={() => setOpenDialogUserId(user.user_id)}
                  >
                    Unfollow
                  </button>
                </DialogTrigger>
                <DialogContent
                  id="unfollow-dialog1-content"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-4 sm:p-6"
                >
                  <UnfollowUserModal
                    userData={{ userName: user.name, userId: user.user_id }}
                    onConfirm={() => {
                      handleUnfollowUser(user.user_id);
                      setOpenDialogUserId(null);
                    }}
                    onCancel={() => setOpenDialogUserId(null)}
                  />
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (user as Followers).following ? (
              <Dialog
                open={openDialogUserId === user.user_id}
                onOpenChange={(open) => {
                  if (!open) setOpenDialogUserId(null);
                }}
              >
                <DialogTrigger asChild>
                  <button
                    id="unfollow-button-2"
                    className="px-2 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600 transition-colors text-xs sm:text-base whitespace-nowrap"
                    onClick={() => setOpenDialogUserId(user.user_id)}
                  >
                    Unfollow
                  </button>
                </DialogTrigger>
                <DialogContent
                  id="unfollow-dialog2-content"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-4 sm:p-6"
                >
                  <UnfollowUserModal
                    userData={{ userName: user.name, userId: user.user_id }}
                    onConfirm={() => {
                      handleUnfollowUser(user.user_id);
                      setOpenDialogUserId(null);
                    }}
                    onCancel={() => setOpenDialogUserId(null)}
                  />
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (
              <button
                id="follow-button-3"
                className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-base whitespace-nowrap"
                onClick={() => handleFollowUser(user.user_id)}
              >
                Follow
              </button>
            )}
          </div>
        ))}
        <div ref={observerRef}></div> {/* Infinite Scroll Trigger */}
      </div>
    </div>
  );
};

export default withSidebarAd(FollowingFollowers);
