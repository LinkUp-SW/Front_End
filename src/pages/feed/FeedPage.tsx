import { useState, useEffect } from "react";
import {
  WithNavBar,
  ProfileCard,
  Button,
  LinkUpFooter,
  WhosHiringImage,
} from "../../components";
import { PremiumBanner, Shortcuts, CreatePost, Post } from "./components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CommentObjectType } from "@/types";
import { fetchSinglePost } from "@/endpoints/feed";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setPosts } from "@/slices/feed/postsSlice"; // adjust if needed
import { setComments } from "@/slices/feed/commentsSlice";

interface FeedPageProps {
  single?: boolean;
}
import PostSkeleton from "./components/PostSkeleton";

const FeedPage: React.FC<FeedPageProps> = ({ single = false }) => {
  const posts = useSelector((state: RootState) => state.posts.list);
  const comments = useSelector((state: RootState) => state.comments.list);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL
  const [viewMore, setViewMore] = useState(true);
  const screenWidth = useSelector((state: RootState) => state.screen.width);

  const [isLoading, setIsLoading] = useState(false);

  const temporary_feed = [
    "6806b5a2bfb3de42b857be4c",

    "680ba14b801a855626ece75c",
    "680ba0a9801a855626ece74d",
    "680ba090801a855626ece73e",
    "680b70ca2ea9ffaf2afa7c12",
    "680ace66b57681e1e91b8d39",
    "680a6fafb57681e1e91b7c0b",
    "680a6f79b57681e1e91b7bf9",
    "680a6b3eb57681e1e91b7b52",
    "680a6702b57681e1e91b7a52",
  ];

  const user_token = Cookies.get("linkup_auth_token");

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (single && !id) {
          console.error("ID is required for single post view");
          return;
        }

        // Call both endpoints concurrently
        const [fetchedData] = await Promise.all([
          Promise.all(
            (!single || !id
              ? temporary_feed.map((postId) =>
                  fetchSinglePost(postId, user_token ?? "", 0, 10)
                )
              : [fetchSinglePost(id, user_token ?? "", 0, 10)]
            ).filter(Boolean)
          ),
        ]);
        const posts = fetchedData.map((data) => data.post);
        const comments: CommentObjectType[] = fetchedData.map(
          (data) => data.comments
        );
        console.log(fetchedData);
        console.log("Posts:", posts);
        console.log("Comments:", comments);
        comments.forEach((block) => {
          block.comments = Object.values(block.comments).reverse();
        });

        if (posts.length > 0) dispatch(setPosts(posts));
        else dispatch(setPosts([]));
        if (comments.length > 0) {
          dispatch(setComments(comments));
        } else {
          dispatch(setComments([]));
        }
        setIsLoading(false);
      } catch (error) {
        dispatch(setPosts([]));
        dispatch(setComments([]));
        console.error("Error fetching feed data", error);
      }
    };

    fetchData();
  }, [id]);

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
            {isLoading ? (
              // Skeleton loaders while loading
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <PostSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : posts.length != 0 ? (
              posts.map((post, index) => {
                return (
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
                );
              })
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
