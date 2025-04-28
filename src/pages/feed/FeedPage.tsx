import { useState, useEffect } from "react";
import {
  WithNavBar,
  ProfileCard,
  Button,
  LinkUpFooter,
  WhosHiringImage,
} from "../../components";
import { PremiumBanner, Shortcuts, CreatePost } from "./components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import PostList from "./components/PostList"; // <-- Import PostList
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface FeedPageProps {
  single?: boolean;
  profile?: string;
}

const FeedPage: React.FC<FeedPageProps> = ({
  single = false,
  profile = "",
}) => {
  const screenWidth = useSelector((state: RootState) => state.screen.width);
  const [viewMore, setViewMore] = useState(screenWidth >= 768);

  const { posts, observerRef, isLoading, initialLoading } = useFeedPosts(
    single,
    profile
  );

  useEffect(() => {
    setViewMore(screenWidth >= 768);
  }, [screenWidth]);

  return (
    <div className="flex justify-center w-full overflow-x-hidden">
      <section className="flex w-full justify-center gap-4 flex-col md:flex-row px-0 sm:px-10 md:px-0">
        {/* Left Sidebar */}
        <aside className="flex flex-col w-full md:max-w-60">
          <ProfileCard />
          <Button
            variant="ghost"
            className="block md:hidden w-full transition-colors my-2"
            onClick={() => setViewMore(!viewMore)}
          >
            <div className="flex justify-center items-center gap-x-2">
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
        <main className="flex flex-col w-full md:max-w-[27.8rem] lg:max-w-[35rem]">
          {!single && <CreatePost />}
          <div className="mt-4" />
          <PostList
            posts={posts}
            viewMore={viewMore}
            isLoading={isLoading}
            initialLoading={initialLoading}
            observerRef={observerRef}
          />
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
  );
};

export default WithNavBar(FeedPage);
