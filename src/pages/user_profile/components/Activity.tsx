import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { openCreatePostDialog } from "@/slices/feed/createPostSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Cookies from "js-cookie";
import { PostType } from "@/types";
import { toast } from "sonner";
import { getUserPosts } from "@/endpoints/userProfile";
import moment from "moment";
import TransparentButton from "@/pages/feed/components/buttons/TransparentButton";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");
// Update the post type to match your API response
const Activity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"post" | "comment" | "video">(
    "post"
  );
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL
  console.log("id", id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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
  }, [userId]);

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

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
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
          <Button
            variant={activeTab === "post" ? "secondary" : "ghost"}
            className={`rounded-full ${
              activeTab === "post"
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("post")}
          >
            Posts
          </Button>
          <Button
            variant={activeTab === "comment" ? "secondary" : "ghost"}
            className={`rounded-full ${
              activeTab === "comment"
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("comment")}
          >
            Comments
          </Button>
          <Button
            variant={activeTab === "video" ? "secondary" : "ghost"}
            className={`rounded-full ${
              activeTab === "video"
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("video")}
          >
            Videos
          </Button>
        </div>

        {/* Scrollable Posts Container */}
        <div className="relative w-full">
          {filteredPosts.length > 1 && (
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

          {filteredPosts.length > 0 ? (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar w-full min-w-[280px] max-w-7xl"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 min-w-[320px] max-w-[400px] flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/feed/posts/${post._id}`)}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {post.author.firstName} {post.author.lastName || ""}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>{moment(post.date * 1000).fromNow()}</span>
                        {post.isEdited && (
                          <>
                            <span>•</span>
                            <span>Edited</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-gray-700 dark:text-gray-200 mb-2 break-words line-clamp-3">
                    {post.content}
                  </div>

                  {/* Media */}
                  {post.media.link && post.media.link.length > 0 && (
                    <div className="mt-4 border rounded overflow-hidden">
                      {post.media.media_type.includes("image") && (
                        <img
                          src={post.media.link[0]}
                          alt="Media preview"
                          className="w-full h-40 object-cover"
                        />
                      )}

                      {post.media.media_type.includes("video") && (
                        <div className="relative h-40 bg-gray-900 flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="bg-white/80 rounded-full p-2">
                              <Play className="h-6 w-6 text-gray-900" />
                            </div>
                          </div>
                          <video
                            className="w-full h-full object-cover"
                            poster={post.media.link[0]}
                          />
                        </div>
                      )}

                      {post.media.link.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          +{post.media.link.length - 1}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comments count */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.reacts && post.reacts.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {post.reacts.length} reactions
                        </span>
                      )}
                    </div>
                    <div>
                      {post.comments !== undefined && (
                        <span className="text-sm text-gray-500">
                          {post.comments} comments
                        </span>
                      )}
                    </div>
                  </div>
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
            to={`/user-profile/${userId}/posts`}
            className="text-blue-600 hover:underline flex items-center"
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
