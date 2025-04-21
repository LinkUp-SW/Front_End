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
import { CommentType, PostType, ReactionType } from "@/types";
import { fetchSinglePost, getPostReactions } from "@/endpoints/feed";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import SortDown from "./components/SortDown";

interface FeedPageProps {
  single?: boolean;
}

const FeedPage: React.FC<FeedPageProps> = ({ single = false }) => {
  const { id } = useParams<{ id: string }>(); // Extract the 'id' parameter from the URL
  const [viewMore, setViewMore] = useState(true);
  const screenWidth = useSelector((state: RootState) => state.screen.width);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [reactions, setReactions] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const temporary_feed = [
    "6806a2058db9403282340f23",
    "6806a76c8db9403282340f47",
    "6806b5a2bfb3de42b857be4c",
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
        const [fetchedData, fetchedReactions] = await Promise.all([
          Promise.all(
            (!single || !id
              ? temporary_feed.map((postId) =>
                  fetchSinglePost(postId, user_token ?? "", 0, 10)
                )
              : [fetchSinglePost(id, user_token ?? "", 0, 10)]
            ).filter(Boolean)
          ),
          getPostReactions(),
        ]);
        const posts = fetchedData.map((data) => data.post);
        const comments = fetchedData.map((data) => data.comments);
        console.log("Posts:", posts);
        console.log("Comments:", comments);

        if (posts.length > 0) setPosts(posts);
        else setPosts([]);
        if (comments.length > 0) {
          setComments(comments);
        } else {
          setComments([]);
        }
        if (fetchedReactions) setReactions(fetchedReactions);
        else setReactions([]);
        console.log(fetchedReactions);
      } catch (error) {
        console.error("Error fetching feed data", error);
      }
    };

    fetchData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      setViewMore(false);
    } else {
      setViewMore(true);
    }
  }, [screenWidth]);

  if (isLoading) {
    return <>Loading...</>;
  }

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
            {!single && <CreatePost posts={posts} setPosts={setPosts} />}
            <SortDown />
            {posts.length != 0 ? (
              posts.map((post, index) => (
                <Post
                  key={index}
                  viewMore={viewMore}
                  postData={post}
                  comments={[comments[index]]}
                  reactions={reactions}
                  action={post.action}
                />
              ))
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
