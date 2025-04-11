// components/CoverPhoto.tsx
import { FaPencilAlt } from "react-icons/fa";

type CoverPhotoProps = {
  src: string;
  isOwner: boolean;
  children: React.ReactNode;
};

export const CoverPhoto = ({ src, isOwner, children }: CoverPhotoProps) => (
  <div className="relative h-48 bg-gray-200">
    <img src={src} alt="Cover" className="w-full h-full object-cover" />
    {isOwner && (
      <>
        <button
          className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full top-3 right-3"
          aria-label="Edit cover photo"
        >
          <FaPencilAlt size={20} />
        </button>
      </>
    )}
    {children}
  </div>
);
