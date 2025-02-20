import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import { toggleTheme } from "../../slices/theme/themeSlice";

const ThemeToggle = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
    >
      <span className="sr-only">Theme Toggle</span>
      <div className="absolute transition-opacity duration-300">
        {theme === "light" ? (
          <FaRegMoon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <MdOutlineWbSunny className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
