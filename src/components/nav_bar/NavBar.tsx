import linkUpLogo from "/link_up_logo.png";
import { BsChatDotsFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import NavItems from "./NavItems";
import { FaPlusSquare } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import ThemeToggle from "../theme_toggle/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";
import { userLogOut } from "@/endpoints/userAuth";

import SearchInput from "./SearchInput";

const NavBar = () => {
 

  

  
  const handleLogout = async () => {
    try {
      await userLogOut();
      // console.log(response)
      setTimeout(() => {
        window.location.replace("/login");
      }, 1000);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(err);
    }
  };

  return (
    <header className="w-full border-b bg-white border-b-gray-400 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-center">
      <nav className="max-w-[85rem] px-5 py-2 flex lg:justify-between items-center gap-2 w-full">
        <div className="flex gap-2 items-center lg:w-fit w-full relative">
          <img src={linkUpLogo} alt="LinkUp-Logo" className="w-9 dark:invert" />
          
          <SearchInput />
        </div>
        <div className="lg:flex items-center gap-4 hidden w-full max-w-[35rem]">
          <NavItems />
          <Popover>
            <PopoverTrigger asChild>
              <button className="hidden lg:flex flex-col items-center cursor-pointer text-gray-600 dark:text-gray-300">
                <img
                  src="https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png"
                  alt="profile-image"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-semibold inline-flex items-center">
                  Me <MdArrowDropDown size={20} />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="grid gap-2">
              <button
                onClick={handleLogout}
                  className="w-full cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300 ease-in-out"
              >
                Sign Out
              </button>
              </div>
            </PopoverContent>
          </Popover>
          <button className="inline-flex cursor-pointer border-l pl-2 flex-col text-gray-600 dark:text-gray-300 items-center">
            <BsFillGrid3X3GapFill size={30} />
            <span className="text-xs font-semibold inline-flex items-center">
              Business{" "}
              <i>
                <MdArrowDropDown size={20} />
              </i>
            </span>
          </button>
        </div>
        <div className="lg:hidden flex items-center gap-2 text-gray-500 dark:text-gray-300">
          <i>
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
