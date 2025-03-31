// components/ProfileAvatar.tsx
import { FaPencilAlt } from "react-icons/fa";

type ProfileAvatarProps = {
  src: string;
  isOwner: boolean;
  onEdit: () => void;
};

export const ProfileAvatar = ({ src, isOwner, onEdit }: ProfileAvatarProps) => (
  <div className="absolute -bottom-16 left-4">
    <img
      src={src}
      alt="Avatar"
      className="w-32 h-32 rounded-full border-4 border-white"
    />
    {isOwner && (
      <button
        className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full -bottom-2 right-0"
        onClick={onEdit}
        aria-label="Edit profile"
      >
        <FaPencilAlt size={20} />
      </button>
    )}
  </div>
);
