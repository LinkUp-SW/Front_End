// components/CoverPhoto.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import CoverPictureModal from "../../modals/picture_modal/CoverPictureModal";
import { defaultProfileImage } from "@/constants";

type CoverPhotoProps = {
  src: string;
  isOwner: boolean;
  children: React.ReactNode;
};

export const CoverPhoto = ({ src, isOwner, children }: CoverPhotoProps) => {
  const [cover, setCover] = useState(src);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-48 bg-gray-200">
      <img
        src={cover || defaultProfileImage}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      {isOwner && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              id="edit-cover-photo"
              className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full top-3 right-3"
              aria-label="Edit cover photo"
            >
              <FaPencilAlt size={20} />
            </button>
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            className="!max-w-5xl md:!w-[43.5rem] dark:bg-gray-900 dark:border-gray-600 !w-full border-2"
          >
            <DialogHeader>
              <DialogTitle>Edit Cover Photo</DialogTitle>
            </DialogHeader>
            <CoverPictureModal
              src={cover}
              setCover={setCover}
              setIsOpen={setIsOpen}
            />
          </DialogContent>
        </Dialog>
      )}
      {children}
    </div>
  );
};
