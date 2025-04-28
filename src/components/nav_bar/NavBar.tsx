import { useEffect, useState } from "react";
import linkUpLogo from "/link_up_logo.png";
import { BsChatDotsFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import NavItems from "./NavItems";
import { FaPlusSquare } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import ThemeToggle from "../theme_toggle/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";
import { userLogOut } from "@/endpoints/userAuth";
import Cookies from "js-cookie";
import { AppDispatch, RootState } from "@/store";
import { fetchUserBio } from "@/slices/user_profile/userBioSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SearchInput from "./SearchInput";
import UserProfilePopover from "./UserProfilePopover";
import { defaultProfileImage } from "@/constants";
import { openCreatePostDialog } from "@/slices/feed/createPostSlice";
import { CreatePost } from "@/pages/feed/components";

const NavBar = () => {
  // Use the correctly typed dispatch
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = Cookies.get("linkup_auth_token");
  const userId = Cookies.get("linkup_user_id");
  const [userPopOverOpen, setUserPopOverOpen] = useState(false);
  const [businessPopOverOpen, setBusinessPopOverOpen] = useState(false);

  // Make sure to use the correct state property names (loading instead of loading)
  const { data, loading, error } = useSelector(
    (state: RootState) => state.userBio
  );
  const screenWidth = useSelector((state: RootState) => state.screen.width);

  // Dispatch initial fetch on component mount if token and userId exist,
  // and only if data hasn't been loaded yet.
  useEffect(() => {
    if (token && userId && !data && !loading && !error) {
      dispatch(fetchUserBio({ token, userId }));
    }
  }, [dispatch, token, userId, data, loading, error]);

  // Display error notification if an error occurs during profile picture fetch.
  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [error]);

  useEffect(() => {
    if (screenWidth <= 1024) {
      setUserPopOverOpen(false);
      setBusinessPopOverOpen(false);
    }
  }, [screenWidth]);

  const handleLogout = async () => {
    try {
      await userLogOut();
      setTimeout(() => {
        window.location.replace("/login");
      }, 1000);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(err);
    }
  };

  const handleCreateCompany = () => {
    setBusinessPopOverOpen(false);
    navigate("/company-creation");
  };

  // Use the profile picture if available; otherwise, fall back to a default image.
  const profilePictureUrl = data?.profile_photo || defaultProfileImage;
  return (
    <header className="w-full border-b bg-white border-b-gray-400 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-center">
      <nav className="max-w-[85rem] px-5 py-2 flex lg:justify-between items-center gap-2 w-full">
        <div className="flex gap-2 items-center lg:w-fit w-full relative">
          <img src={linkUpLogo} alt="LinkUp-Logo" className="w-9 dark:invert" />

          <SearchInput />
          <CreatePost className="hidden" />
        </div>
        <div className="lg:flex items-center gap-4 hidden w-full max-w-[35rem]">
          <NavItems />
          {screenWidth > 1024 && (
            <Popover open={userPopOverOpen} onOpenChange={setUserPopOverOpen}>
              <PopoverTrigger asChild>
                <button className="hidden lg:flex flex-col items-center cursor-pointer text-gray-600 dark:text-gray-300">
                  {loading ? (
                    <div className="h-7 w-7 animate-pulse rounded-full bg-gray-300" />
                  ) : (
                    <img
                      src={profilePictureUrl}
                      alt="profile-image"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm font-semibold inline-flex items-center">
                    Me <MdArrowDropDown size={20} />
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <UserProfilePopover
                  setUserPopOverOpen={setUserPopOverOpen}
                  userProfileBioData={data}
                  handleLogout={handleLogout}
                />
              </PopoverContent>
            </Popover>
          )}

          <Popover
            open={businessPopOverOpen}
            onOpenChange={setBusinessPopOverOpen}
          >
            <PopoverTrigger asChild>
              <button className="inline-flex cursor-pointer border-l pl-2 flex-col text-gray-600 dark:text-gray-300 items-center">
                <BsFillGrid3X3GapFill size={30} />
                <span className="text-xs font-semibold inline-flex items-center">
                  Business{" "}
                  <i>
                    <MdArrowDropDown size={20} />
                  </i>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Business Option
                </h3>
                <button
                  id="create-company-button"
                  onClick={handleCreateCompany}
                  className="w-full text-left px-3 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-3 group"
                >
                  <div className="bg-blue-100 dark:bg-gray-700 p-2 rounded-md group-hover:bg-blue-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
                    <HiOutlineBuildingOffice2
                      className="text-blue-600 dark:text-blue-400"
                      size={18}
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                      Create a company page{" "}
                      <FaPlus className="ml-2 text-blue-500" size={12} />
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                      Build your professional business presence
                    </span>
                  </div>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="lg:hidden flex items-center gap-2 text-gray-500 dark:text-gray-300">
          <i onClick={handleClick}>
            <FaPlusSquare size={30} />
          </i>
          <i className="scale-x-[-1]">
            <BsChatDotsFill size={30} />
          </i>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
