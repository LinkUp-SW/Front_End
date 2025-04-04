import { Modal, WithNavBar } from "../../components";
import {
  AboutSection,
  ExperienceSection,
  ResourcesSection,
  UserInfo,
  ViewedSection,
} from "./components";
import EducationSection from "./components/EducationSection";

const UserProfilePage = () => {
  return (
    <main className="max-w-7xl mx-auto lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <UserInfo />
          <AboutSection />
          <ExperienceSection />
          <EducationSection />
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
