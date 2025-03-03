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
    <div className="flex px-[10%]">
      <div className="flex flex-col">
        <ProfileCard />
        <StatsCard />
        <PremiumBanner />
        <Shortcuts />
      </div>
      <div className="flex flex-col">
        <CreatePost />
        <Post name={"Doma"} content={"Hi"} />
      </div>
      <div className="flex flex-col">
        <LinkedInNews />
      </div>
    </div>
  );
};

export default WithNavBar(FeedPage);
