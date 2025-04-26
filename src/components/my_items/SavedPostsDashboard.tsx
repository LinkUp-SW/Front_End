import React, { useEffect, useState, useRef } from "react";
import PostHeader from "@/pages/feed/components/PostHeader";
import { PostType } from "@/types";
import { getSavedPosts, unsavePost } from "@/endpoints/feed";
import TruncatedText from "../truncate_text/TruncatedText";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { getSaveMenuActions } from "@/pages/feed/components/Menus";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { refetchUserBio } from "@/slices/user_profile/userBioSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import DocumentPreview from "@/pages/feed/components/modals/DocumentPreview";
import LinkPreview from "@/pages/feed/components/LinkPreview";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");

const SavedPostsDashboard: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true); // Track initial loading
  const [menuOpenStates, setMenuOpenStates] = useState<Record<string, boolean>>(
    {}
  );

  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Track if fetchSavedPosts has been called
  const dispatch = useDispatch<AppDispatch>();
  const isMenuOpen = (postId: string) => !!menuOpenStates[postId];

  const setMenuOpen = (postId: string, isOpen: boolean) => {
    setMenuOpenStates((prev) => ({ ...prev, [postId]: isOpen }));
  };

  const fetchSavedPosts = async (cursor: number) => {
    if (!token) {
      toast.error("You must be logged in to add a comment.");
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const postPayload = {
        cursor,
        limit: 5, // Number of posts to fetch per page
      };

      const response = await getSavedPosts(postPayload, token);

      console.log(response);

      // Append new posts to the existing ones
      setSavedPosts((prevPosts) => [...prevPosts, ...response.posts]);
      setNextCursor(response.nextCursor); // Update the next cursor
    } catch (err) {
      console.error("Error fetching saved posts:", err);
      setError("Failed to fetch saved posts.");
    } finally {
      setLoading(false);
      setInitialLoading(false); // Mark initial loading as complete
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSavedPosts(0); // Initial fetch
      hasFetched.current = true; // Mark as fetched
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loading) {
          fetchSavedPosts(nextCursor); // Fetch next page when the user scrolls to the bottom
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [nextCursor, loading]);

  const handleUnsavePost = async (postId: string) => {
    if (!token || !userId) {
      toast.error("You must be logged in to save or unsave a post.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const loading = toast.loading("Unsaving post...");
      await unsavePost(postId, token);
      setSavedPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
      dispatch(refetchUserBio({ token, userId }));
      toast.success("Post unsaved.");
      toast.dismiss(loading);
    } catch (error) {
      console.error(`Error unsaving post:`, error);
      toast.error(`Failed to unsave the post. Please try again.`);
    }
  };

  const reportPost = () => {};

  function sendPost(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
          Saved Posts
        </h1>

        {initialLoading ? (
          // Full skeleton loader for initial loading
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border-t dark:border-t-gray-600 p-4 flex gap-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <Skeleton className="w-20 h-20 rounded-lg dark:bg-gray-700 bg-gray-300" />{" "}
                {/* Thumbnail */}
                <div className="flex flex-col space-y-2 w-full">
                  <Skeleton className="h-4 w-1/2 dark:bg-gray-700 bg-gray-300" />{" "}
                  {/* Title */}
                  <Skeleton className="h-4 w-3/4 dark:bg-gray-700 bg-gray-300" />{" "}
                  {/* Subtitle */}
                  <Skeleton className="h-4 w-full dark:bg-gray-700 bg-gray-300" />{" "}
                  {/* Content */}
                </div>
              </div>
            ))}
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="space-y-4">
            {savedPosts.map((post, index) => (
              <div key={index} className="border-t dark:border-t-gray-600 p-4">
                <div className="flex flex-col gap-3">
                  <div className="relative -left-7">
                    <PostHeader
                      user={post.author}
                      postMenuOpen={isMenuOpen(post._id)}
                      setPostMenuOpen={(isOpen) =>
                        setMenuOpen(post._id, isOpen)
                      }
                      menuActions={getSaveMenuActions(
                        () => handleUnsavePost(post._id),
                        sendPost,
                        reportPost,
                        post._id
                      )}
                      savedPostView
                      date={post.date}
                    />
                  </div>
                  <Link to={`/feed/posts/${post._id}`}>
                    <div
                      className={`flex ${
                        post.media.media_type === "pdf" ||
                        (post.media.media_type === "link" ? "flex-col" : "")
                      }`}
                    >
                      {post.media && post.media.media_type != "none" ? (
                        post.media.media_type === "image" ||
                        post.media.media_type === "images" ? (
                          <img
                            src={post.media.link[0]}
                            className="object-cover w-20 h-20 overflow-hidden shrink-0"
                            alt="Post thumbnail"
                          />
                        ) : post.media.media_type === "video" ? (
                          <div className="relative w-20 h-20 shrink-0">
                            <video
                              src={post.media.link[0]}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 text-white"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )
                      ) : null}
                      <TruncatedText
                        id="post-content"
                        content={post.content}
                        lineCount={3}
                      />
                      {post.media.media_type === "pdf" && (
                        <DocumentPreview
                          currentSelectedMedia={[
                            new File(
                              [
                                new Blob([post.media.link[0]], {
                                  type: "application/pdf",
                                }),
                              ],
                              "document.pdf",
                              { type: "application/pdf" }
                            ),
                          ]}
                        />
                      )}
                      {post.media.media_type === "link" && (
                        <LinkPreview url={post.media.link[0]} />
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            ))}

            {/* Add loading skeletons at the end */}
            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 1 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-t dark:border-t-gray-600 p-4 flex gap-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <Skeleton className="w-20 h-20 rounded-lg dark:bg-gray-700 bg-gray-300" />{" "}
                    {/* Thumbnail */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Skeleton className="h-4 w-1/2 dark:bg-gray-700 bg-gray-300" />{" "}
                      {/* Title */}
                      <Skeleton className="h-4 w-3/4 dark:bg-gray-700 bg-gray-300" />{" "}
                      {/* Subtitle */}
                      <Skeleton className="h-4 w-full dark:bg-gray-700 bg-gray-300" />{" "}
                      {/* Content */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="border-t pt-6 pb-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No saved posts yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse posts and click "Save" to add them here.
            </p>
          </div>
        )}

        {error && (
          <div className="text-center mt-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Observer Element */}
        <div ref={observerRef}></div>
      </div>
    </div>
  );
};

export default SavedPostsDashboard;
