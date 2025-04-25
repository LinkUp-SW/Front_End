import React, { useEffect, useState, useRef } from "react";
import PostHeader from "@/pages/feed/components/PostHeader";
import { PostType } from "@/types";
import { getFeedPosts, getSavedPosts, unsavePost } from "@/endpoints/feed";
import TruncatedText from "../truncate_text/TruncatedText";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { getSaveMenuActions } from "@/pages/feed/components/Menus";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { refetchUserBio } from "@/slices/user_profile/userBioSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");

const SavedPostsDashboard: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      { threshold: 1.0 }
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

        {savedPosts.length > 0 ? (
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
                    <div className="flex">
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
                              className="w-full h-full"
                              poster={post.media.link[0]}
                              controls={false}
                            />
                          </div>
                        ) : (
                          <div>PDF</div>
                        )
                      ) : null}
                      <TruncatedText
                        id="post-content"
                        content={post.content}
                        lineCount={3}
                      />
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
                    className="border-t dark:border-t-gray-600 p-4 flex gap-4"
                  >
                    <Skeleton className="w-20 h-20 rounded-lg" />{" "}
                    {/* Thumbnail */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Skeleton className="h-4 w-1/2" /> {/* Title */}
                      <Skeleton className="h-4 w-3/4" /> {/* Subtitle */}
                      <Skeleton className="h-4 w-full" /> {/* Content */}
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
        <div ref={observerRef} className="h-10"></div>
      </div>
    </div>
  );
};

export default SavedPostsDashboard;
