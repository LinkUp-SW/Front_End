interface UserProfilePopoverProps {
  handleLogout: () => void;
}

const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({
  handleLogout,
}) => {
  return (
    <div className="grid gap-2">
      <button
        onClick={handleLogout}
        className="w-full cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300 ease-in-out"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserProfilePopover;
