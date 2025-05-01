import { useState } from "react";
import { Modal, WithNavBar } from "../../components";
import {
  // AboutSection,
  EducationSection,
  ExperienceSection,
  LicenseSection,
  ResourcesSection,
  SkillsSection,
  UserInfo,
  ViewedSection,
} from "./components";
// import Activity from "./components/Activity";

const UserProfilePage = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  return (
    <main className="max-w-7xl mx-auto  lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <UserInfo setIsProfileVisible={setIsProfileVisible} />
          {isProfileVisible && (
            <>
              {/* <AboutSection /> */}
              {/* <Activity /> */}
              <ExperienceSection />
              <EducationSection />
              <LicenseSection />
              <SkillsSection />
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <ViewedSection />
          <ResourcesSection />
        </div>
      </div>
      <Modal />
    </main>
  );
};

export default WithNavBar(UserProfilePage);
