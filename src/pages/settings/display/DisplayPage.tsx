import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { FaSun, FaMoon } from "react-icons/fa";
import ThemeToggle from "@/components/theme_toggle/ThemeToggle";

const DisplayPage = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <SettingsLayoutPage>
      <div className="w-full max-w-4xl mx-auto py-10 px-4">
        <div
          className="
            bg-white dark:bg-gray-800 
            rounded-lg 
            shadow-md dark:shadow-lg 
            overflow-hidden 
            transition-colors duration-200
          "
        >
          <h2
            className="
              px-6 py-4 
              text-lg font-semibold 
              text-gray-800 dark:text-gray-100 
              border-b border-gray-200 dark:border-gray-700
            "
          >
            Appearance
          </h2>

          {/* Use a non-clickable container; only the Switch itself triggers */}
          <div
            className="
              w-full flex items-center justify-between 
              px-6 py-4 
              hover:bg-gray-50 dark:hover:bg-gray-800 
              transition-colors duration-150
            "
          >
            <div className="flex items-center space-x-3">
              {theme === "dark" ? (
                <FaMoon className="text-indigo-400" />
              ) : (
                <FaSun className="text-yellow-500" />
              )}

              <span className="text-gray-700 dark:text-gray-300">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default DisplayPage;
