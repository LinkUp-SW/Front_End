import { RootState } from "@/store";
import React from "react";
import { FaBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
interface LeftSidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedPage,
  setSelectedPage,
}) => {
  const { data } = useSelector((state: RootState) => state.userBio);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow py-4 pr-0">
      <h2 className="font-medium text-gray-600  dark:text-gray-200 mb-4 flex items-center pl-4">
        <FaBookmark className="mr-2" />
        <span>My items</span>
      </h2>

      <div className="mt-2">
        <div
          className={`flex justify-between items-center py-2 border-t pl-4 dark:border-t-gray-600 hover:cursor-pointer hover:underline ${
            selectedPage === "saved-jobs"
              ? "border-l-4 border-l-blue-500"
              : "border-l-transparent"
          }`}
          onClick={() => setSelectedPage("saved-jobs")}
        >
          <button
            id="my-jobs-btn"
            className={`${
              selectedPage === "saved-jobs"
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            My jobs
          </button>
          {/* <span
            className={`
              "text-gray-600 dark:text-gray-400
              text-sm pr-4`}
          >
            {data?.number_of_saved_jobs}
          </span> */}
        </div>

        <div
          className={`flex justify-between items-center py-2 border-t dark:border-t-gray-600 pl-4 hover:cursor-pointer hover:underline  ${
            selectedPage === "saved-posts"
              ? "border-l-4 border-l-blue-500 "
              : "border-l-transparent"
          }`}
          onClick={() => setSelectedPage("saved-posts")}
        >
          <button
            id="saved-posts-btn"
            className={`${
              selectedPage === "saved-posts"
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-400"
            } text-left line-clamp-1 text-ellipsis`}
          >
            Saved posts and articles
          </button>
          <span
            className={`
            "text-gray-600 dark:text-gray-400
            text-sm pr-4`}
          >
            {data?.number_of_saved_posts}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
