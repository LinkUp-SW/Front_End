import { useState } from "react";
import { WithNavBar, ProfileCard, Button } from "../../components";
import {
  StatsCard,
  PremiumBanner,
  Shortcuts,
  CreatePost,
  Post,
  LinkedInFooter,
} from "./components";
//import {Avatar} from ".."
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

const FeedPage = () => {
  const [viewMore, setViewMore] = useState(false);
  return (
    <>
      <div className="hidden md:flex px-0 xl:px-[10%] gap-x-[2%] w-full">
        <div className="flex flex-col h-full w-full max-w-60 relative">
          <ProfileCard profile={exampleProfile} />
          <StatsCard profileViewers={27} postImpressions={22} />
          <PremiumBanner />
          <Shortcuts />
          <div className="relative right-3.5">
            <LinkedInFooter />
          </div>
        </div>
        <div className="flex flex-col w-full ">
          <CreatePost profileImageUrl={exampleProfile.profileImage} />
          <Post
            user={{
              name: "Abdelrahman Elsayed",
              headline:
                "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
              profileImage:
                "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg", // Replace with actual image
              degree: "Following",
            }}
            post={{
              content: `
              University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university. It's a donation website called Herzenbrücke, built using HTML, CSS, JavaScript, and React. This project focuses on the front-end development.

Our project had three main roles: Donor, Organization Representative, and Admin. My colleagues Abdelrahman Mohamed, Ahmed Waleed, and I focused on the Donor part. Adham Hatem handled the Organization Representative role, and Abdullah Sherif managed the Admin role.

his project was a collaborative effort, and each of us brought our skills and expertise to create a functional and user-friendly donation platform. The Donor role allows users to make donations easily ,browse different organizations and see pickup and other notifications, while the Organization Representative can manage donation campaigns, and the Admin oversees the entire system.

Working on Herzenbrücke was a fantastic learning experience, and it gave us valuable insights into front-end web development and teamwork. Thank you for watching, and I look forward to any feedback or questions you might have!
`,
              date: 0,
              public: true,
              edited: true,
            }}
            stats={{
              likes: 15,
              love: 2,
              support: 1,
              celebrate: 1,
              comments: 4,
            }}
            action={{
              name: "Panda",
              action: "like",
              profileImage:
                "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg", // Replace with actual image
            }}
          />
          <Post
            user={{
              name: "Abdelrahman Elsayed",
              headline:
                "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
              profileImage:
                "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg", // Replace with actual image
              degree: "Following",
            }}
            post={{
              content: `
              University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university. It's a donation website called Herzenbrücke, built using HTML, CSS, JavaScript, and React. This project focuses on the front-end development.

Our project had three main roles: Donor, Organization Representative, and Admin. My colleagues Abdelrahman Mohamed, Ahmed Waleed, and I focused on the Donor part. Adham Hatem handled the Organization Representative role, and Abdullah Sherif managed the Admin role.

his project was a collaborative effort, and each of us brought our skills and expertise to create a functional and user-friendly donation platform. The Donor role allows users to make donations easily ,browse different organizations and see pickup and other notifications, while the Organization Representative can manage donation campaigns, and the Admin oversees the entire system.

Working on Herzenbrücke was a fantastic learning experience, and it gave us valuable insights into front-end web development and teamwork. Thank you for watching, and I look forward to any feedback or questions you might have!
`,
              date: 0,
              public: true,
              edited: true,
            }}
            stats={{
              likes: 15,
              love: 2,
              support: 1,
              celebrate: 1,
              comments: 4,
              reposts: 4,
            }}
          />
          <Post
            user={{
              name: "Abdelrahman Elsayed",
              headline:
                "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
              profileImage:
                "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg", // Replace with actual image
              degree: "Following",
            }}
            post={{
              content: `
              University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university. It's a donation website called Herzenbrücke, built using HTML, CSS, JavaScript, and React. This project focuses on the front-end development.

Our project had three main roles: Donor, Organization Representative, and Admin. My colleagues Abdelrahman Mohamed, Ahmed Waleed, and I focused on the Donor part. Adham Hatem handled the Organization Representative role, and Abdullah Sherif managed the Admin role.

his project was a collaborative effort, and each of us brought our skills and expertise to create a functional and user-friendly donation platform. The Donor role allows users to make donations easily ,browse different organizations and see pickup and other notifications, while the Organization Representative can manage donation campaigns, and the Admin oversees the entire system.

Working on Herzenbrücke was a fantastic learning experience, and it gave us valuable insights into front-end web development and teamwork. Thank you for watching, and I look forward to any feedback or questions you might have!
`,
              date: 0,
              public: true,
              edited: true,
            }}
            stats={{
              likes: 15,
              love: 2,
              support: 1,
              celebrate: 1,
              comments: 4,
              reposts: 4,
            }}
          />
          <Post
            user={{
              name: "Abdelrahman Elsayed",
              headline:
                "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
              profileImage:
                "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg", // Replace with actual image
              degree: "Following",
            }}
            post={{
              content: `
              University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university. It's a donation website called Herzenbrücke, built using HTML, CSS, JavaScript, and React. This project focuses on the front-end development.

Our project had three main roles: Donor, Organization Representative, and Admin. My colleagues Abdelrahman Mohamed, Ahmed Waleed, and I focused on the Donor part. Adham Hatem handled the Organization Representative role, and Abdullah Sherif managed the Admin role.

his project was a collaborative effort, and each of us brought our skills and expertise to create a functional and user-friendly donation platform. The Donor role allows users to make donations easily ,browse different organizations and see pickup and other notifications, while the Organization Representative can manage donation campaigns, and the Admin oversees the entire system.

Working on Herzenbrücke was a fantastic learning experience, and it gave us valuable insights into front-end web development and teamwork. Thank you for watching, and I look forward to any feedback or questions you might have!
`,
              date: 0,
              public: true,
              edited: true,
            }}
            stats={{
              likes: 15,
              love: 2,
              support: 1,
              celebrate: 1,
              comments: 4,
              reposts: 4,
            }}
          />
        </div>
      </div>

      {/* COMPACT VIEW */}
      <div className="md:hidden flex px-0 xl:px-[10%] gap-x-[2%] w-full">
        <div className="flex flex-col w-full">
          <ProfileCard profile={exampleProfile} fullWidth />
          {viewMore ? (
            <>
              <StatsCard profileViewers={27} postImpressions={22} />
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

          <CreatePost profileImageUrl={exampleProfile.profileImage} />

          <Post
            user={{
              name: "Abdelrahman Elsayed",
              headline:
                "Student at German University in cairo Student at German University in cairo Student at German University in cairo",
              profileImage:
                "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg", // Replace with actual image
              degree: "Following",
            }}
            post={{
              content: `
              University Project Showcase: Herzenbrücke Donation Website

Hi everyone, I'm excited to share a project my team and I recently completed for our university. It's a donation website called Herzenbrücke, built using HTML, CSS, JavaScript, and React. This project focuses on the front-end development.

Our project had three main roles: Donor, Organization Representative, and Admin. My colleagues Abdelrahman Mohamed, Ahmed Waleed, and I focused on the Donor part. Adham Hatem handled the Organization Representative role, and Abdullah Sherif managed the Admin role.

his project was a collaborative effort, and each of us brought our skills and expertise to create a functional and user-friendly donation platform. The Donor role allows users to make donations easily ,browse different organizations and see pickup and other notifications, while the Organization Representative can manage donation campaigns, and the Admin oversees the entire system.

Working on Herzenbrücke was a fantastic learning experience, and it gave us valuable insights into front-end web development and teamwork. Thank you for watching, and I look forward to any feedback or questions you might have!
`,
              date: 0,
              public: true,
              edited: true,
            }}
            stats={{
              likes: 15,
              love: 2,
              comments: 4,
              reposts: 4,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default WithNavBar(FeedPage);
