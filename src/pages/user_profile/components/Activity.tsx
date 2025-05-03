import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { openCreatePostDialog } from "@/slices/feed/createPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getUserPosts } from "@/endpoints/userProfile";
import TransparentButton from "@/pages/feed/components/buttons/TransparentButton";
import PostPreview from "@/pages/feed/components/PostPreview";
import {
  getMenuActions,
  getPersonalMenuActions,
} from "@/pages/feed/components/Menus";
import BlueButton from "@/pages/feed/components/buttons/BlueButton";
import { setPosts } from "@/slices/feed/postsSlice";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");

const Activity: React.FC<{
  isMe?: boolean;
}> = ({ isMe }) => {
  const [activeTab, setActiveTab] = useState<"post" | "comment" | "video">(
    "post"
  );
  const routeLocation = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const width = useSelector((state: RootState) => state.screen.width);
  const posts = useSelector((state: RootState) => state.posts.list);

  // Fetch user posts whenever the route changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        if (!token) {
          toast.error("Authentication required");
          return;
        }
        const payload = { limit: 5, cursor: 0 };
        const response = await getUserPosts(token, id || "", payload);
        if (response?.posts) {
          dispatch(setPosts(response.posts));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [routeLocation.pathname, id]);

  // Filter posts according to tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "post") return !post.media.media_type.includes("video");
    if (activeTab === "video") return post.media.media_type.includes("video");
    return false;
  });
  useEffect(() => {}, [posts]);

  const handleCreatePost = () => dispatch(openCreatePostDialog());
  const handleSaveButton = () => setIsSaved((s) => !s);
  const handleEditPostButton = () => {};
  const deleteModal = () => {};
  const blockPost = () => {};
  const reportPost = () => {};
  const unfollow = () => {};

  if (posts.length === 0) return null;

  return (
    <section className="bg-white p-4 dark:bg-gray-900 rounded-lg shadow-md max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Activity
        </h1>
        {isMe && (
          <TransparentButton onClick={handleCreatePost}>
            Create a post
          </TransparentButton>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {activeTab === "post" ? (
          <BlueButton onClick={() => setActiveTab("post")}>Posts</BlueButton>
        ) : (
          <TransparentButton onClick={() => setActiveTab("post")}>
            Posts
          </TransparentButton>
        )}
        {activeTab === "video" ? (
          <BlueButton onClick={() => setActiveTab("video")}>Videos</BlueButton>
        ) : (
          <TransparentButton onClick={() => setActiveTab("video")}>
            Videos
          </TransparentButton>
        )}
      </div>

      {/* Grid of Posts */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[320px] animate-pulse"
            >
              {/* ...skeleton markup stays the same... */}
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {width * 0.063 >= 48 ? (
            <>
              {filteredPosts.slice(0, 2).map((post) => (
                <PostPreview
                  key={post._id}
                  post={post}
                  // no width override—let the grid control sizing
                  menuActions={
                    id === userId
                      ? getPersonalMenuActions(
                          handleSaveButton,
                          handleEditPostButton,
                          deleteModal,
                          post._id,
                          isSaved
                        )
                      : getMenuActions(
                          handleSaveButton,
                          blockPost,
                          reportPost,
                          unfollow,
                          post._id,
                          isSaved
                        )
                  }
                  showFooter
                />
              ))}
            </>
          ) : (
            <>
              {filteredPosts.slice(0, 1).map((post) => (
                <PostPreview
                  key={post._id}
                  post={post}
                  // no width override—let the grid control sizing
                  menuActions={
                    id === userId
                      ? getPersonalMenuActions(
                          handleSaveButton,
                          handleEditPostButton,
                          deleteModal,
                          post._id,
                          isSaved
                        )
                      : getMenuActions(
                          handleSaveButton,
                          blockPost,
                          reportPost,
                          unfollow,
                          post._id,
                          isSaved
                        )
                  }
                  showFooter
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No {activeTab}s to display
        </div>
      )}

      {/* Show All Posts Link */}
      <div className="flex justify-center mt-8">
        <Link
          to={`/user-profile/${id}/posts`}
          className="text-blue-600 dark:text-blue-300 hover:underline"
        >
          Show all posts →
        </Link>
      </div>
    </section>
  );
};

export default Activity;
