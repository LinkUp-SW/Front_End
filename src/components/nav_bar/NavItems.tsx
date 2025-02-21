import { useSelector } from "react-redux";
import {
  LARGE_SCREEN_NAV_ITEMS,
  SMALL_SCREEN_NAV_ITEMS,
} from "../../constants";
import { Link } from "react-router-dom";
import { RootState } from "../../store";

const NavItems = () => {
  const screenWidth = useSelector((state: RootState) => state.screen.width);
  return (
    <div className="flex justify-between lg:border-0 border-t lg:py-0 py-1 border-t-gray-400 bg-white w-full items-center px-2">
      {screenWidth >= 1024 ? (
        <>
          {LARGE_SCREEN_NAV_ITEMS.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`flex text-gray-600 hover:text-black decoration-2 hover:underline hover:underline-offset-8 transition-all duration-300 ease-in-out flex-col items-center`}
            >
              <item.icon size={25} />
              <span className="text-sm font-semibold ">{item.title}</span>
            </Link>
          ))}
        </>
      ) : (
        <>
          {SMALL_SCREEN_NAV_ITEMS.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`flex text-gray-600 hover:text-black decoration-2 hover:underline hover:underline-offset-8 transition-all duration-300 ease-in-out flex-col items-center`}
            >
              <item.icon size={25} />
              {screenWidth > 330 && (
                <span className={`text-sm font-semibold `}>{item.title}</span>
              )}
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default NavItems;
