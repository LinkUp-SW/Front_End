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

type ProfileAvatarProps = {
  src: string;
  isOwner: boolean;
  onEdit: () => void;
};

export const ProfileAvatar = ({ src, isOwner, onEdit }: ProfileAvatarProps) => {
  const [pic,setPic]=useState(src);
  const [isOpen,setIsOpen]=useState(false)
  return (
  <div className="absolute -bottom-16 left-4">
    <img
      src={pic}
      alt="Avatar"
      className="w-32 h-32 rounded-full border-4 border-white"
    />
    {isOwner && (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full -bottom-2 right-0"
            onClick={onEdit}
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
          <ProfilePictureModal setIsOpen={setIsOpen} setPic={setPic} src={src} />
        </DialogContent>
      </Dialog>
    )}
  </div>
)};
