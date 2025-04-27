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
import { fetchSinglePost } from "@/endpoints/feed";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setPosts } from "@/slices/feed/postsSlice"; // adjust if needed
import { setComments } from "@/slices/feed/commentsSlice";

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
  const comments = useSelector((state: RootState) => state.comments.list);
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

  const temporary_feed = [
    "6806b5a2bfb3de42b857be4c",

    "680ba14b801a855626ece75c",
    "680ba0a9801a855626ece74d",
    "680ba090801a855626ece73e",
    "680b70ca2ea9ffaf2afa7c12",
    "680ace66b57681e1e91b8d39",
  ];

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

      const fetchedData = await Promise.all(
        profile && id
          ? [getUserPosts(user_token, id, postPayload)]
          : !single || !id
          ? temporary_feed
              .slice(nextCursor, nextCursor + 5)
              .map((postId) =>
                fetchSinglePost(postId, user_token ?? "", nextCursor, 5)
              )
          : [fetchSinglePost(id, user_token ?? "", nextCursor, 5)]
      );

      const newPosts = profile
        ? fetchedData[0].posts
        : fetchedData.map((data) => data.post);
      const newComments = fetchedData.map((data) => data.comments);

      if (!profile) {
        newComments.forEach((block) => {
          block.comments = Object.values(block.comments);
        });
      }

      if (newPosts.length > 0) {
        dispatch(setPosts([...posts, ...newPosts]));
        dispatch(setComments([...comments, ...newComments]));
        setNextCursor(nextCursor + 5);
      } else {
        setHasMore(false);
      }
      if (single) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts", error);
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
    console.log("Initial");
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
      <div className="flex justify-center relative w-full px-0 ">
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
                    comments={comments[index]}
                    action={post.action}
                    posts={posts}
                    allComments={comments}
                    order={index}
                  />
                ))}
                {isLoading && <PostSkeleton />}
                <div ref={observerRef} className="h-10" />
              </>
            ) : (
              <p className="text-center text-2xl bg-white border rounded-lg p-4">
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
