import { useState, useEffect } from "react";
import PostList from "@/pages/feed/components/PostList";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const Posts = ({ query }: { query: string }) => {
  const screenWidth = useSelector((state: RootState) => state.screen.width);
  const [viewMore, setViewMore] = useState(screenWidth >= 768);

  // Use the useFeedPosts hook with search parameter
  const {
    posts,
    observerRef,
    isLoading: postsLoading,
    initialLoading,
  } = useFeedPosts(
    false, // single
    "", // profile
    "", // company
    query // search
  );

  // Update viewMore based on screen width
  useEffect(() => {
    setViewMore(screenWidth >= 768);
  }, [screenWidth]);

  return (
    posts.length !== 0 && (
      <div className="flex justify-center mt-6">
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
          {/* Main content area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Posts
              </h1>

              <main className="flex flex-col w-full">
                <PostList
                  posts={posts}
                  viewMore={viewMore}
                  isLoading={postsLoading}
                  initialLoading={initialLoading}
                  observerRef={observerRef}
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Posts;
