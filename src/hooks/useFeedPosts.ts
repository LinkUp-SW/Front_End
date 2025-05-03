import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import {
  fetchSinglePost,
  getCompanyPosts,
  getPostsFeed,
  getSearchPosts,
} from "@/endpoints/feed";
import { getUserPosts } from "@/endpoints/userProfile";
import { setPosts } from "@/slices/feed/postsSlice";
import { RootState } from "@/store";
import { toast } from "sonner";

export function useFeedPosts(
  single: boolean = false,
  profile: string = "",
  company: string = "", // Add new parameter
  search: string = "" // Add search parameter
) {
  const posts = useSelector((state: RootState) => state.posts.list);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const user_token = Cookies.get("linkup_auth_token");

  const [nextCursor, setNextCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadMorePosts = async (force = false) => {
    if ((!hasMore || isLoading) && !force) return;

    setIsLoading(true);

    if (!user_token) {
      toast.error("You must be logged in to view this feed.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const payload = { cursor: nextCursor, limit: 5 };

      let fetchedPosts = [];
      console.log("COMPANY", company);
      if (search) {
        // Add search posts case
        const response = await getSearchPosts(user_token, {
          query: search,
          cursor: nextCursor,
          limit: 5,
        });
        fetchedPosts = response?.posts || [];
      } else if (company) {
        // Add company posts case
        const response = await getCompanyPosts(user_token, company);
        fetchedPosts = response?.posts || [];
        console.log("Company Fetched POsts", fetchedPosts);
      } else if (profile && id) {
        const response = await getUserPosts(user_token, id, payload);
        fetchedPosts = response?.posts || [];
      } else if (single && id) {
        const post = await fetchSinglePost(id, user_token);
        fetchedPosts = post ? [post] : [];
      } else {
        const response = await getPostsFeed(user_token, payload);
        fetchedPosts = response?.posts || [];
      }

      if (nextCursor === 0) {
        // 👈 First page (after reset): REPLACE posts
        dispatch(setPosts(fetchedPosts));
      } else {
        // 👈 Subsequent pages: APPEND posts
        dispatch(setPosts([...posts, ...fetchedPosts]));
      }

      setNextCursor((prev) => prev + fetchedPosts.length);
      setHasMore(fetchedPosts.length === 5);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    const ref = observerRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    dispatch(setPosts([]));
    setNextCursor(0);
    setHasMore(true);
    setInitialLoading(true);
  }, [routeLocation.pathname, id]);

  useEffect(() => {
    if (initialLoading) {
      loadMorePosts(true);
    }
  }, [initialLoading]);

  return {
    posts,
    observerRef,
    isLoading,
    initialLoading,
  };
}
