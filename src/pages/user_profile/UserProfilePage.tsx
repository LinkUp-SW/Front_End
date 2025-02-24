import { WithNavBar } from "../../components";
import {
  AboutSection,
  AnalyticsSection,
  ExperienceSection,
  ResourcesSection,
  UserInfo,
  ViewedSection,
} from "./components";

const UserProfilePage = () => {
  return (
    <main className="max-w-7xl mx-auto lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <UserInfo />
          <AnalyticsSection />
          <AboutSection />
          <ExperienceSection />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <ViewedSection />
          <ResourcesSection />
        </div>
      </div>
    </main>
  );
};

export default WithNavBar(UserProfilePage);
