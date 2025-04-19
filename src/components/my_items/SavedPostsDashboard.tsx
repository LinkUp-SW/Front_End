import React, { useEffect, useState } from "react";
import PostHeader from "@/pages/feed/components/PostHeader";
import { PostType } from "@/types";
import { getFeedPosts } from "@/endpoints/feed";
import TruncatedText from "../truncate_text/TruncatedText";
import { getMenuActions } from "@/pages/feed/components/Menus";

const JobsDashboard: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [postMenu, setPostMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call both endpoints concurrently
        const [fetchedPosts] = await Promise.all([getFeedPosts()]);
        if (fetchedPosts)
          setSavedPosts(
            Array.isArray(fetchedPosts) ? fetchedPosts : [fetchedPosts]
          );
        else setSavedPosts([]);

        return fetchedPosts;
      } catch (error) {
        console.error("Error fetching feed data", error);
      }
    };

    fetchData();
  }, []);

  const menuActions = getMenuActions();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
          Saved Posts
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            id="saved-jobs-tab"
            className="bg-green-600 font-medium hover:bg-green-500 text-neutral-200 dark:text-black px-4 py-1 rounded-full"
          >
            All
          </button>
        </div>

        {savedPosts.length > 0 ? (
          <div className="space-y-4">
            {savedPosts.map((post, index) => (
              <div key={index} className="border-t dark:border-t-gray-600 p-4">
                <div className="flex flex-col gap-3">
                  <div className="relative -left-7">
                    <PostHeader
                      user={post.user}
                      postMenuOpen={postMenu}
                      setPostMenuOpen={setPostMenu}
                      menuActions={menuActions}
                      post={post.post}
                      savedPostView
                    />
                  </div>
                  <div className="flex">
                    {post.post.images || post.post.video ? (
                      post.post.images ? (
                        <img
                          src={post.post.images[0]}
                          className="object-cover w-20 h-20 overflow-hidden shrink-0"
                          alt="Post thumbnail"
                        />
                      ) : (
                        <div className="relative w-20 h-20 shrink-0">
                          <video
                            src={post.post.video}
                            className=" object-cover "
                            poster={post.post.video} // Use the first frame as the poster
                            controls={false} // Disable controls for the thumbnail
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-opacity cursor-pointer"
                            onClick={() => {
                              // Handle play action (e.g., open a modal or play the video)
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-12 h-12"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 3l14 9-14 9V3z"
                              />
                            </svg>
                          </div>
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                    <TruncatedText
                      id="post-content"
                      content={post.post.content}
                      lineCount={3}
                    />
                  </div>
                  {post.post.pdf ? (
                    <div className="h-20 w-full bg-white"></div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t pt-6 pb-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No saved jobs yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse jobs and click "Save" to add them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsDashboard;
