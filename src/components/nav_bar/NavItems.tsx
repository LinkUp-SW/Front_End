import { useSelector } from "react-redux";
import {
  LARGE_SCREEN_NAV_ITEMS,
  SMALL_SCREEN_NAV_ITEMS,
} from "../../constants";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import Cookies from "js-cookie";

const NavItems = () => {
  const screenWidth = useSelector((state: RootState) => state.screen.width);
  const userId = Cookies.get("linkup_user_id");
  return (
    <div className="flex justify-between lg:border-0 border-t lg:py-0 py-2 border-t-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 w-full items-center px-2">
      {screenWidth >= 1024
        ? LARGE_SCREEN_NAV_ITEMS.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="flex text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-8  transition-all duration-300 ease-in-out flex-col items-center"
            >
              <item.icon size={25} />
              <span className="text-sm font-semibold">{item.title}</span>
            </Link>
          ))
        : SMALL_SCREEN_NAV_ITEMS.map((item, i) => (
            <Link
              key={i}
              to={
                item.title === "Profile" ? `${item.path}/${userId}` : item.path
              }
              className="flex text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-2 transition-all duration-300 ease-in-out flex-col items-center"
            >
              <item.icon size={25} />
              {screenWidth > 330 && (
                <span className="text-sm font-semibold">{item.title}</span>
              )}
            </Link>
          ))}
    </div>
  );
};

export default NavItems;
