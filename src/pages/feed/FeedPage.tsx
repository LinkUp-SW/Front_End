import React from "react";
import { UserList, WithNavBar } from "../../components";
import ProfileCard from "@/components/feed/ProfileCard";
import StatsCard from "@/components/feed/StatsCard";
import PremiumBanner from "@/components/feed/PremiumBanner";
import Shortcuts from "@/components/feed/Shortcuts";
import CreatePost from "@/components/feed/CreatePost";
import Post from "@/components/feed/Post";
import LinkedInNews from "@/components/feed/LinkedInNews";

const FeedPage = () => {
  return (
    <>
      <div className="hidden md:flex px-0 xl:px-[10%] gap-x-[2%] w-full">
        <div className="flex flex-col w-60">
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
          <CreatePost />
          <Post name={"Doma"} content={"Hi"} />
        </div>
      </div>
    </>
  );
};

export default WithNavBar(FeedPage);
