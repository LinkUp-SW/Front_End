import { useState, useEffect } from "react";
import { WithNavBar, ProfileCard, Button, Modal } from "../../components";
import {
  StatsCard,
  PremiumBanner,
  Shortcuts,
  CreatePost,
  Post,
  LinkedInFooter,
} from "./components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const FeedPage = () => {
  const [viewMore, setViewMore] = useState(true);
  const screenWidth = useSelector((state: RootState) => state.screen.width);

  useEffect(() => {
    if (screenWidth < 768) {
      setViewMore(false);
    } else {
      setViewMore(true);
    }
  }, [screenWidth]);

  return (
    <>
      <div className="flex justify-center w-full px-0 xl:px-[10%]">
        <div className="flex w-full gap-4 md:flex-row flex-col">
          {/* Left Sidebar */}
          <div className="flex flex-col h-full w-full md:max-w-60">
            <ProfileCard profile={exampleProfile} />
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
                {screenWidth > 800 && <LinkedInFooter />}
              </>
            )}
          </div>
          {/* Main Content */}
          <div className="flex flex-col w-full md:max-w-[34.8rem]">
            <CreatePost profileImageUrl={exampleProfile.profileImage} />
            {examplePosts.map((post, index) => (
              <Post
                key={index}
                user={post.user}
                post={post.post}
                stats={post.stats}
                action={post.action}
              />
            ))}
          </div>
          {/* Right Sidebar */}
        </div>
      </div>
    </>
  );
};

export default WithNavBar(FeedPage);

const exampleProfile = {
  fullWidth: true,
  coverImage:
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  profileImage: "https://github.com/shadcn.png",
  name: "Amr Doma",
  headline:
    "Ex-SWE Intern at Valeo | Ex-Clinical Engineering Intern at As-Salam International Hospital",
  location: "Qesm el Maadi, Cairo",
  university: "Cairo University",
};

const examplePosts = [
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
  {
    user: {
      name: "Abdelrahman Elsayed",
      headline:
        "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      degree: "Following",
    },
    post: {
      content: `
    University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university...`,
      date: 0,
      public: true,
      edited: true,
    },
    stats: {
      likes: 15,
      love: 2,
      support: 1,
      celebrate: 1,
      comments: 4,
    },
    action: {
      name: "Panda",
      action: "like" as "like",
      profileImage:
        "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    },
  },
];
