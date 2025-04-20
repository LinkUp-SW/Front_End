import { defaultProfileImage } from "@/constants";
import { UserProfileBio } from "@/types";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

interface UserProfilePopoverProps {
  handleLogout: () => void;
  setUserPopOverOpen: (open: boolean) => void;
  userProfileBioData: UserProfileBio | null;
}

const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({
  handleLogout,
  userProfileBioData,
  setUserPopOverOpen,
}) => {
  const userId = Cookies.get("linkup_user_id");
  return (
    <div className="grid gap-2 text-gray-700 dark:text-gray-300">
      <section className="grid gap-2">
        <div className="flex gap-2">
          <img
            src={userProfileBioData?.profile_photo || defaultProfileImage}
            alt="user-profile picture"
            className="w-14 h-14 rounded-full"
          />
          <div className="flex flex-col justify-center">
            <h2 className="capitalize font-semibold">
              {userProfileBioData?.bio.first_name}{" "}
              {userProfileBioData?.bio.last_name}
            </h2>
            {userProfileBioData?.bio.headline && (
              <p className="break-words whitespace-normal  max-w-[200px]">
                {userProfileBioData?.bio.headline}
              </p>
            )}
          </div>
        </div>
        <Link
          onClick={() => setUserPopOverOpen(false)}
          to={`/user-profile/${userId}`}
          className="w-full text-center rounded-full text-white affirmativeBtn"
        >
          View Profile
        </Link>
      </section>
      <section>
        <div className="h-[0.05rem] w-full bg-gray-500 dark:bg-gray-300" />
        <h2 className="pt-1 font-semibold">Account</h2>
        <Link
          to={"/settings/account"}
          className="text-sm text-gray-500 dark:text-gray-400 p-2 hover:underline"
        >
          settings & privacy
        </Link>
      </section>
      <section className="flex flex-col">
        <div className="h-[0.05rem] w-full bg-gray-500 dark:bg-gray-300" />
        <h2 className="pt-1 font-semibold">Manage</h2>
        <Link
          to={"#"}
          className="text-sm px-2 pt-2 text-gray-500 dark:text-gray-400 hover:underline"
        >
          Posts & Activities
        </Link>
        <Link
          to={"#"}
          className="text-sm text-gray-500 dark:text-gray-400 p-2 hover:underline"
        >
          Saved Items
        </Link>
      </section>
      <footer>
        <div className="h-[0.05rem] w-full bg-gray-500 dark:bg-gray-300" />
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer text-sm text-gray-700 dark:text-gray-300 mt-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300 ease-in-out"
        >
          Sign Out
        </button>
      </footer>
    </div>
  );
};

export default UserProfilePopover;
