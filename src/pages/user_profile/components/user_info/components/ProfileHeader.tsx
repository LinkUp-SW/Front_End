// components/ProfileHeader.tsx
import { Bio, Organization } from "@/types";
import { ContactInfoModal } from "./ContactInfoModal";
import { Link } from "react-router-dom";

type ProfileHeaderProps = {
  userid: string;
  user: Bio;
  connectionsCount: number;
  intros: {
    work_experience: Organization | null;
    education: Organization | null;
  };
};

export const ProfileHeader = ({
  user,
  userid,
  connectionsCount,
  intros,
}: ProfileHeaderProps) => (
  <div className="mb-4 grid gap-1 relative">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
      {user.first_name} {user.last_name}
    </h1>
    <p className="text-gray-600 dark:text-gray-200">{user.headline}</p>
    <div className="inline-flex items-center gap-2 mt-1">
      <p className="text-sm text-gray-500 dark:text-gray-200">
        {user.location.city}, {user.location.country_region}
      </p>
      <ContactInfoModal user={user} triggerLabel={`Contact Info`} />
    </div>
    <Link
      to={`/connections/${userid}`}
      className="text-blue-600 hover:underline w-fit font-semibold dark:text-blue-400"
    >
      {connectionsCount} connections
    </Link>
    <div className="sm:grid gap-2 absolute right-0 hidden">
      {intros.work_experience && (
        <Link
          to={"#"}
          className="flex gap-2 items-center hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-all duration-300 ease-in-out"
        >
          <img
            src={intros.work_experience.logo}
            alt=""
            className="w-8 aspect-auto"
          />
          <p className="text-sm">{intros.work_experience.name}</p>
        </Link>
      )}

      {intros.education && (
        <Link
          to={"#"}
          className="flex gap-2 items-center hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-all duration-300 ease-in-out"
        >
          <img src={intros.education.logo} alt="" className="w-8 aspect-auto" />
          <p>{intros.education.name}</p>
        </Link>
      )}
    </div>
  </div>
);
