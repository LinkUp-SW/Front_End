// components/ProfileHeader.tsx
import { Bio, Organization } from "@/types";
import { ContactInfoModal } from "./ContactInfoModal";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { FaPencilAlt } from "react-icons/fa";
import EditUserBioModal from "../../modals/edit_user_bio_modal/EditUserBioModal";
import { useState } from "react";
import premiumLogo from "@/assets/linkup_premium.png";

type ProfileHeaderProps = {
  userid: string;
  user: Bio;
  connectionsCount: number;
  intros: {
    work_experience: Organization | null;
    education: Organization | null;
  };
  isOwner: boolean;
  isInConnection?: boolean;
  isPremium: boolean;
};

export const ProfileHeader = ({
  user,
  userid,
  connectionsCount,
  intros,
  isOwner,
  isInConnection,
  isPremium,
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
    {isOwner || isInConnection ? (
      <Link
        to={`/connections/${userid}`}
        className="text-blue-600 hover:underline w-fit font-semibold dark:text-blue-400"
      >
        {connectionsCount} connections
      </Link>
    ) : (
      <p className="text-gray-600  w-fit font-semibold dark:text-gray-400">
        {connectionsCount} connections
      </p>
    )}

    {isPremium && (
      <img
        src={premiumLogo}
        className={`absolute hover:opacity-85 transition-all duration-300 cursor-pointer rounded-md z-20 w-7 h-7 ${
          isOwner
            ? "right-[2rem] top-[-4.1rem]"
            : "right-[-0.7rem] top-[-4.2rem]"
        }`}
      />
    )}
    {isOwner && <EditUserBio user={user} userid={userid} intros={intros} />}
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

const EditUserBio: React.FC<Partial<ProfileHeaderProps>> = ({
  user,
  userid,
  intros,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute right-[-1rem] top-[-4.5rem] flex gap-2 items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="edit-user-bio"
            className="hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full"
            aria-label="Edit User Bio"
          >
            <FaPencilAlt size={20} />
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="!max-w-5xl md:!w-[40rem] max-h-[40rem] overflow-y-auto dark:bg-gray-900 dark:border-gray-600 !w-full border-2"
        >
          <DialogHeader>
            <DialogTitle>Edit User Bio</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <EditUserBioModal
            setOpenEditDialog={setOpen}
            userData={user as Bio}
            userId={userid as string}
            intros={
              intros as {
                work_experience: Organization | null;
                education: Organization | null;
              }
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
