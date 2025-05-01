import React, { useEffect, useState, useRef } from "react";
import { PostType } from "@/types";
import { getSavedPosts, unsavePost } from "@/endpoints/feed";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getSaveMenuActions } from "@/pages/feed/components/Menus";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { refetchUserBio } from "@/slices/user_profile/userBioSlice";
import PostPreview from "@/pages/feed/components/PostPreview";
import PostPreviewSkeleton from "@/pages/feed/components/PostPreviewSkeleton";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");

const SavedPostsDashboard: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [menuOpenStates, setMenuOpenStates] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  const setMenuOpen = (postId: string, isOpen: boolean) => {
    setMenuOpenStates(() => ({ ...menuOpenStates, [postId]: isOpen }));
  };

  const fetchSavedPosts = async (cursor: number) => {
    if (!token) {
      toast.error("You must be logged in to view saved posts.");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const postPayload = {
        cursor,
        limit: 5,
      };

      const response = await getSavedPosts(postPayload, token);
      setSavedPosts((prevPosts) => [...prevPosts, ...response.posts]);
      setNextCursor(response.nextCursor);
    } catch (err) {
      console.error("Error fetching saved posts:", err);
      setError("Failed to fetch saved posts.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSavedPosts(0);
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loading) {
          fetchSavedPosts(nextCursor);
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
  const sendPost = () => {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
          Saved Posts
        </h1>

        {initialLoading ? (
          // Use the PostSkeleton component for initial loading
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <PostPreviewSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="space-y-4">
            {/* Use the Post component for each saved post */}
            {savedPosts.map((post) => (
              <PostPreview
                key={post._id}
                post={post}
                menuActions={getSaveMenuActions(
                  () => handleUnsavePost(post._id),
                  sendPost,
                  reportPost,
                  post._id
                )}
                onMenuOpenChange={(isOpen) => setMenuOpen(post._id, isOpen)}
                showFooter={true}
              />
            ))}

            {/* Loading state while fetching more */}
            {loading && <PostPreviewSkeleton showHeader={false} />}
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
