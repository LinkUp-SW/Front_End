import { useState, useEffect } from "react";
import {
  WithNavBar,
  ProfileCard,
  Button,
  LinkUpFooter,
  WhosHiringImage,
} from "../../components";
import {
  StatsCard,
  PremiumBanner,
  Shortcuts,
  CreatePost,
  Post,
} from "./components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CommentType, PostType } from "@/types";
import {
  getFeedPosts,
  getPostComments,
  getSingleComments,
  getSinglePost,
} from "@/endpoints/feed";
import { useParams } from "react-router-dom";

interface FeedPageProps {
  single?: boolean;
}

const FeedPage: React.FC<FeedPageProps> = ({ single = false }) => {
  const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL
  const [viewMore, setViewMore] = useState(true);
  const screenWidth = useSelector((state: RootState) => state.screen.width);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (single && !id) {
          console.error("ID is required for single post view");
          return;
        }

        // Call both endpoints concurrently
        const [fetchedPosts, fetchedComments] = await Promise.all([
          !single || !id ? getFeedPosts() : getSinglePost(id),

          !single || !id ? getPostComments() : getSingleComments(id),
        ]);
        if (fetchedPosts)
          setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : [fetchedPosts]);
        else setPosts([]);
        if (fetchedComments) setComments(fetchedComments);
        else setComments([]);
        return fetchedPosts;
      } catch (error) {
        console.error("Error fetching feed data", error);
      }
    };

    fetchData();
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
                <StatsCard profileViewers={27} postImpressions={22} />
                <PremiumBanner />
                <Shortcuts />
              </>
            )}
          </aside>
          {/* Main Content */}
          <main className="flex flex-col w-full max-w-auto md:max-w-[27.8rem] lg:max-w-[35rem]">
            {!single && <CreatePost />}
            {posts.map((post, index) => (
              <Post
                key={index}
                viewMore={viewMore}
                postData={post}
                comments={comments}
              />
            ))}
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
