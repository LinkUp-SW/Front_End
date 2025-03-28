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
import { CommentType, PostType, ProfileCardType } from "@/types";
import { getFeedPosts, getPostComments } from "@/endpoints/feed";
import { getProfileCardData } from "@/endpoints/userProfile";

const FeedPage = () => {
  const [viewMore, setViewMore] = useState(true);
  const screenWidth = useSelector((state: RootState) => state.screen.width);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [profile, setProfile] = useState<ProfileCardType>();
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call both endpoints concurrently
        const [fetchedPosts, fetchedProfile, fetchedComments] =
          await Promise.all([
            getFeedPosts(),
            getProfileCardData(),
            getPostComments(),
          ]);
        setPosts(fetchedPosts);
        setProfile(fetchedProfile);
        setComments(fetchedComments);
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
      <div className="flex justify-center w-full px-0 ">
        <section className="flex w-full justify-center gap-4 lg:flex-row flex-col">
          {/* Left Sidebar */}
          <aside className="flex flex-col h-full w-full lg:max-w-60">
            {profile && <ProfileCard />}
            <Button
              variant="ghost"
              className="block lg:hidden hover:cursor-pointer hover:bg-stone-200 w-full transition-colors my-2"
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
          <main className="flex flex-col w-full lg:max-w-[34.8rem]">
            <CreatePost profileImageUrl={profile?.profileImage || ""} />
            {posts.map((post, index) => (
              <Post key={index} postData={post} comments={comments} />
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
