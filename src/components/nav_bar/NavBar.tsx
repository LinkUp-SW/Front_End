import linkUpLogo from "/link_up_logo.png";
import SearchInput from "./SearchInput";
import NavItems from "./NavItems";
import { BsChatDotsFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaPlusSquare } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import ThemeToggle from "../theme_toggle/ThemeToggle";

const NavBar = () => {
  return (
    <header className="w-full border-b bg-white border-b-gray-400 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-center">
      <nav className="max-w-[85rem] px-5 py-2 flex lg:justify-between items-center gap-2 w-full">
        <div className="flex gap-2 items-center lg:w-fit w-full">
          <img
            src={linkUpLogo}
            alt="LinkUp-Logo"
            className="aspect-square w-9 dark:invert"
          />
          <SearchInput />
        </div>
        <div className="lg:flex items-center gap-4 hidden w-full max-w-[35rem]">
          <NavItems />
          <button className="lg:flex cursor-pointer hidden text-gray-600 dark:text-gray-300 flex-col items-center">
            <img
              src="https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png"
              alt="profile-image"
              className="w-7 rounded-full aspect-square object-fill"
            />
            <span className="text-sm font-semibold inline-flex items-center">
              Me{" "}
              <i>
                <MdArrowDropDown size={20} />
              </i>
            </span>
          </button>
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
          <ThemeToggle/>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
