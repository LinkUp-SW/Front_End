import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { openCreatePostDialog } from "@/slices/feed/createPostSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Cookies from "js-cookie";
import { PostType } from "@/types";
import { toast } from "sonner";
import { getUserPosts } from "@/endpoints/userProfile";
import TransparentButton from "@/pages/feed/components/buttons/TransparentButton";
import PostPreview from "@/pages/feed/components/PostPreview";
import {
  getMenuActions,
  getPersonalMenuActions,
} from "@/pages/feed/components/Menus";
import BlueButton from "@/pages/feed/components/buttons/BlueButton";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");
// Update the post type to match your API response
const Activity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"post" | "comment" | "video">(
    "post"
  );
  const routeLocation = useLocation();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [menuOpenStates, setMenuOpenStates] = useState<Record<string, boolean>>(
    {}
  );
  const setMenuOpen = (postId: string, isOpen: boolean) => {
    setMenuOpenStates(() => ({ ...menuOpenStates, [postId]: isOpen }));
  };
  const [isSaved, setIsSaved] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL
  console.log("id", id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        if (!token) {
          toast.error("Authentication required");
          return;
        }
        const payload = {
          limit: 5,
          cursor: 0,
        };

        // Call the getUserPosts API function
        const response = await getUserPosts(token, id || "", payload);
        console.log("response", response);
        if (response && response.posts) {
          setPosts(response.posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [routeLocation.pathname]);

  // Filter posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "post") return !post.media.media_type.includes("video");
    if (activeTab === "comment") return false; // Handle comments separately if needed
    if (activeTab === "video") return post.media.media_type.includes("video");
    return true;
  });

  // Scroll handlers
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Handler for post creation
  const handleCreatePost = () => {
    console.log("here");
    dispatch(openCreatePostDialog());
  };

  const handleSaveButton = () => {
    setIsSaved(!isSaved);
  };
  const handleEditPostButton = () => {};
  const deleteModal = () => {};
  const blockPost = () => {};
  const reportPost = () => {};
  const unfollow = () => {};

  return (
    <section className="bg-white p-4 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Activity
          </h1>
          <TransparentButton onClick={handleCreatePost}>
            Create a post
          </TransparentButton>
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
          {activeTab === "comment" ? (
            <BlueButton onClick={() => setActiveTab("comment")}>
              Comments
            </BlueButton>
          ) : (
            <TransparentButton onClick={() => setActiveTab("comment")}>
              Comments
            </TransparentButton>
          )}
        </div>

        {/* Scrollable Posts Container */}
        <div className="relative w-full overflow-hidden">
          {filteredPosts.length > 2 && (
            <>
              <Button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700"
                size="icon"
                variant="ghost"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700"
                size="icon"
                variant="ghost"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {isLoading ? (
            // Show loading skeleton for posts - exactly 2 columns
            <div className="grid grid-cols-2 gap-4 w-full">
              {[1, 2].map((index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[320px] animate-pulse"
                >
                  {/* Skeleton content stays the same */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3" />
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    </div>
                  </div>
                  <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredPosts.map((post) => (
                <div
                  key={`post-${post._id}`}
                  className="snap-start"
                  style={{
                    minWidth: "calc(50% - 8px)",
                    maxWidth: "calc(50% - 8px)",
                    flexBasis: "calc(50% - 8px)",
                  }}
                >
                  <PostPreview
                    post={post}
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
                    onMenuOpenChange={(isOpen) => setMenuOpen(post._id, isOpen)}
                    showFooter={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No {activeTab}s to display
            </div>
          )}
        </div>

        {/* Show All Posts */}
        <div className="flex justify-center mt-8">
          <Link
            to={`/user-profile/${id}/posts`}
            className="text-blue-600 dark:text-blue-300 hover:underline flex items-center"
          >
            Show all posts →
          </Link>
        </div>
      </div>
    </section>
  );
};

// Add this CSS to your global styles or component
const style = document.createElement("style");
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);

export default Activity;
