// components/ProfileAvatar.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { FcAddImage } from "react-icons/fc";
import Header from "../../modals/components/Header";
import ProfilePictureModal from "../../modals/picture_modal/ProfilePictureModal";
import { useState } from "react";
import { defaultProfileImage } from "@/constants";
import premiumLogo from "@/assets/linkup_premium.png";
type ProfileAvatarProps = {
  src: string;
  isOwner: boolean;
  isPremium: boolean;
};

export const ProfileAvatar = ({
  src,
  isOwner,
  isPremium,
}: ProfileAvatarProps) => {
  const [pic, setPic] = useState(src);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute -bottom-16 left-4">
      <img
        src={pic || defaultProfileImage}
        alt="Avatar"
        className="w-32 h-32 rounded-full border-4 border-white"
      />
      {isOwner && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full -bottom-2 right-0"
              aria-label="Edit profile"
              id="edit-profile-button"
            >
              <FcAddImage size={20} />
            </button>
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            className="!max-w-5xl md:!w-[43.5rem] dark:bg-gray-900 dark:border-gray-600 !w-full border-2"
          >
            <DialogTitle className="hidden"></DialogTitle>

            <DialogHeader id="about-section-dialog-header">
              <Header title="Profile Photo" />
            </DialogHeader>
            <ProfilePictureModal
              setIsOpen={setIsOpen}
              setPic={setPic}
              src={src}
            />
          </DialogContent>
        </Dialog>
      )}
      {isPremium && (
        <img
          src={premiumLogo}
          className={`absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-1 rounded-md z-20 w-7 h-7 ${
            isOwner ? "-bottom-1 left-[0.4rem]" : "-bottom-1 right-[0.26rem]"
          }`}
        />
      )}
    </div>
  );
};
