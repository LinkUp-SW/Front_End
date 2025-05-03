import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import { toggleTheme } from "../../slices/theme/themeSlice";

const ThemeToggle = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  // sunrise vs. midnight gradients
  const bgClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-400 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-500"
      : "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 hover:from-blue-800 hover:via-indigo-800 hover:to-purple-800";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full 
        ${bgClasses} 
        text-white 
        transition-all duration-300
      `}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FaRegMoon className="w-5 h-5 drop-shadow-md" />
      ) : (
        <MdOutlineWbSunny className="w-5 h-5 drop-shadow-md" />
      )}
    </button>
  );
};

export default ThemeToggle;
