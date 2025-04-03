// components/ProfileHeader.tsx
import { Bio } from "@/types";
import { ContactInfoModal } from "./ContactInfoModal";
import { Link } from "react-router-dom";

type ProfileHeaderProps = {
  user: Bio;
  connectionsCount: number;
};

export const ProfileHeader = ({
  user,
  connectionsCount,
}: ProfileHeaderProps) => (
  <div className="mb-4 grid gap-1">
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
    <Link to={'/connections'} className="text-blue-600 hover:underline font-semibold dark:text-blue-400">
      {connectionsCount} connections
    </Link>
  </div>
);
