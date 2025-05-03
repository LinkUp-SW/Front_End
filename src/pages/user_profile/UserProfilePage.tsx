import { useState } from "react";
import whoIsHiringImage from "@/assets/whoIsHiring.jpg";

import { LinkUpFooter, Modal, WithNavBar } from "../../components";
import {
  AboutSection,
  EducationSection,
  ExperienceSection,
  LicenseSection,
  ProfileStrength,
  ProfileUrlSection,
  SkillsSection,
  UserInfo,
} from "./components";
import Activity from "./components/Activity";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { checkIsMe } from "@/endpoints/userProfile";

const UserProfilePage = () => {
  const token = Cookies.get("linkup_auth_token");
  const { id } = useParams<{ id: string }>();

  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const { data } = useFetchData(
    async () => (token && id ? checkIsMe(token, id) : Promise.resolve(null)),
    [id]
  );

  return (
    <main className="max-w-7xl mx-auto  lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <UserInfo setIsProfileVisible={setIsProfileVisible} />
          {isProfileVisible && (
            <>
              <AboutSection />
              <Activity isMe={data?.is_me} />
              <ExperienceSection />
              <EducationSection />
              <LicenseSection />
              <SkillsSection />
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4 flex flex-col items-center">
          <ProfileUrlSection />
          {data?.is_me && <ProfileStrength />}
          <div className="mt-4 cursor-pointer h-fit w-full hidden lg:block">
            <img
              src={whoIsHiringImage}
              alt="Promotional Banner"
              className="rounded-lg shadow-lg w-full aspect-square object-fill object-center"
            />
          </div>
          <div className="hidden lg:block">
            <LinkUpFooter />
          </div>
        </div>
      </div>
      <Modal />
    </main>
  );
};

export default WithNavBar(UserProfilePage);
