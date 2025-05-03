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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Search Results
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Results for "{query}"
              </p>
            </div>

            {/* Search filters could go here */}
            <nav className="mb-4">
              <ul className="py-1">
                <li>
                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Most Recent
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Most Relevant
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

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
  );
};

export default Posts;
