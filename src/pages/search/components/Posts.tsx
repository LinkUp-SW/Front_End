import { useState, useEffect } from "react";
import PostList from "@/pages/feed/components/PostList";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface PostsProps {
  query: string;
  setPostsFound: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const Posts: React.FC<PostsProps> = ({ query, setPostsFound }) => {
  const screenWidth = useSelector((state: RootState) => state.screen.width);
  const [viewMore, setViewMore] = useState(screenWidth >= 768);

  const {
    posts,
    observerRef,
    isLoading: postsLoading,
    initialLoading,
  } = useFeedPosts(false, "", "", query);

  useEffect(() => {
    setViewMore(screenWidth >= 768);
  }, [screenWidth]);

  useEffect(() => {
    setPostsFound(posts.length > 0);
  }, [posts, setPostsFound]);

  if (posts.length === 0) return null;

  return (
    <div className="flex justify-center mt-6">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Posts</h1>
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
