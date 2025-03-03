import React, { useState } from "react";
import { UserList, WithNavBar } from "../../components";
import ProfileCard from "@/components/feed/ProfileCard";
import StatsCard from "@/components/feed/StatsCard";
import PremiumBanner from "@/components/feed/PremiumBanner";
import Shortcuts from "@/components/feed/Shortcuts";
import CreatePost from "@/components/feed/CreatePost";
import Post from "@/components/feed/Post";
import LinkedInNews from "@/components/feed/LinkedInNews";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FeedPage = () => {
  const [viewMore, setViewMore] = useState(false);
  return (
    <>
      <div className="hidden md:flex px-0 xl:px-[10%] gap-x-[2%] w-full">
        <div className="flex flex-col w-full max-w-60">
          <ProfileCard />
          <StatsCard />
          <PremiumBanner />
          <Shortcuts />
        </div>
        <div className="flex flex-col w-full">
          <CreatePost />
          <Post name={"Doma"} content={"Hi"} />
        </div>
        <div className="hidden lg:flex flex-col w-[40rem] ">
          <LinkedInNews />
        </div>
      </div>

      {/* COMPACT VIEW */}
      <div className="md:hidden flex px-0 xl:px-[10%] gap-x-[2%] w-full">
        <div className="flex flex-col w-full">
          <ProfileCard fullWidth />
          {!viewMore ? (
            <>
              <StatsCard />
              <PremiumBanner />
              <Shortcuts />
            </>
          ) : (
            <></>
          )}
          <Button
            variant="ghost"
            className="hover:cursor-pointer hover:bg-stone-200 w-full transition-colors my-2"
            onClick={() => setViewMore(!viewMore)}
          >
            <div className="flex justify-between gap-x-2 items-center">
              {viewMore ? (
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

          <CreatePost />

          <Post name={"Doma"} content={"Hi"} />
        </div>
      </div>
    </>
  );
};

export default WithNavBar(FeedPage);
