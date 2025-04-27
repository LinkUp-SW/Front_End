import { useState, useEffect, useRef } from "react";
import {
  WithNavBar,
  ProfileCard,
  Button,
  LinkUpFooter,
  WhosHiringImage,
} from "../../components";
import { PremiumBanner, Shortcuts, CreatePost, Post } from "./components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchSinglePost, getPostsFeed } from "@/endpoints/feed";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setPosts } from "@/slices/feed/postsSlice"; // adjust if needed

interface FeedPageProps {
  single?: boolean;
  profile?: boolean;
}
import PostSkeleton from "./components/PostSkeleton";
import { getUserPosts } from "@/endpoints/userProfile";
import { toast } from "sonner";

const FeedPage: React.FC<FeedPageProps> = ({
  single = false,
  profile = false,
}) => {
  const posts = useSelector((state: RootState) => state.posts.list);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL
  const [viewMore, setViewMore] = useState(true);
  const screenWidth = useSelector((state: RootState) => state.screen.width);
  // Add/modify these state variables at the top of your component
  const [nextCursor, setNextCursor] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const user_token = Cookies.get("linkup_auth_token");

  const loadMorePosts = async () => {
    if (!hasMore || isLoading) return;

    if (!user_token) {
      toast.error("You must be logged in to view this feed.");
      navigate("/login", { replace: true });
      return;
    }

    setIsLoading(true);
    try {
      const postPayload = {
        cursor: nextCursor,
        limit: 5,
      };

      // Updated logic to use getFeedPosts
      if (profile && id) {
        // Profile posts
        const response = await getUserPosts(user_token, id, postPayload);
        if (response && response.posts && response.posts.length > 0) {
          dispatch(setPosts([...posts, ...response.posts]));
          setNextCursor(nextCursor + response.posts.length);
          setHasMore(response.posts.length === 5);
        } else {
          setHasMore(false);
        }
      } else if (single && id) {
        // Single post
        const post = await fetchSinglePost(id, user_token);
        dispatch(setPosts([post]));
        setHasMore(false);
      } else {
        // Feed posts - now using getPostsFeed
        const response = await getPostsFeed(user_token, postPayload);
        if (response && response.posts && response.posts.length > 0) {
          dispatch(setPosts([...posts, ...response.posts]));
          setNextCursor(nextCursor + response.posts.length);
          setHasMore(response.posts.length === 5);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading, nextCursor]);

  // After successful initial fetch, add:

  useEffect(() => {
    dispatch(setPosts([]));
    const initialFetch = async () => {
      await loadMorePosts();
    };
    initialFetch();
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      setViewMore(false);
    } else {
      setViewMore(true);
    }
  }, [screenWidth]);

  return (
    <>
      <div className="flex justify-center relative w-full px-0 overflow-x-hidden ">
        <section className="flex w-full justify-center gap-4 px-0 sm:px-10 md:px-0 md:flex-row flex-col">
          {/* Left Sidebar */}
          <aside className="flex flex-col h-full w-full md:max-w-60">
            <ProfileCard />
            <Button
              variant="ghost"
              className="block md:hidden hover:cursor-pointer hover:bg-stone-200 w-full transition-colors my-2"
              onClick={() => setViewMore(!viewMore)}
            >
              <div className="flex justify-center gap-x-2 items-center">
                {!viewMore ? (
                  <>
                    <p>Show more</p>
                    <FaChevronDown />
                  </>
                ) : (
                  <>
                    <p>Show less</p>
                    <FaChevronUp />
                  </>
                )}
              </div>
            </Button>
            {viewMore && (
              <>
                <PremiumBanner />
                <Shortcuts />
              </>
            )}
          </aside>
          {/* Main Content */}
          <main className="flex flex-col w-full max-w-auto md:max-w-[27.8rem] lg:max-w-[35rem]">
            {!single && <CreatePost />}
            <div className="mt-4"></div>
            {initialLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <PostSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map((post, index) => (
                  <Post
                    key={`post-${post._id}`}
                    viewMore={viewMore}
                    postData={post}
                    action={post.activityContext}
                    order={index}
                  />
                ))}
                {isLoading && <PostSkeleton />}
                <div ref={observerRef} className="h-10" />
              </>
            ) : (
              <p className="text-center text-2xl bg-white dark:bg-gray-900 border-0 rounded-lg p-4">
                No posts to display. Start connecting to people!
              </p>
            )}
          </main>
          {/* Right Sidebar */}
          {screenWidth > 1158 && (
            <aside className="flex flex-col items-center">
              <WhosHiringImage />
              <LinkUpFooter />
            </aside>
          )}
        </section>
      </div>
    </>
  );
};

export default WithNavBar(FeedPage);
