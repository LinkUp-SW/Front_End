import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSortDown } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { SIDEBAR_MENU_ITEMS, FOOTER_LINKS } from "../../../../constants/index";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (label: string) => {
    if (label === "My jobs") {
      navigate("/my-items/saved-jobs");
    }
  };

  return (
    <div className="w-full md:w-1/4 md:sticky md:top-20 md:self-start">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-4 transition-colors">
        {SIDEBAR_MENU_ITEMS.map((item, index) => (
          <div
            key={index}
            id={`sidebar-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
            onClick={() => handleMenuItemClick(item.label)}
            role="button"
          >
            <span className="text-gray-600 dark:text-gray-300">
              {React.createElement(item.icon, { size: 20 })}
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {item.label}
            </span>
          </div>
        ))}

        <div className="border-t dark:border-gray-700 my-4"></div>

        <div
          id="post-job-btn"
          className="flex items-center gap-2 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded cursor-pointer transition-colors"
          role="button"
        >
          <FaEdit size={20} />
          <span className="font-medium">Post a free job</span>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-xs text-gray-600 dark:text-gray-400 transition-colors">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link, index) => (
            <span
              key={index}
              id={`footer-link-${index}`}
              className="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-200 flex items-center transition-colors"
              role="button"
            >
              {link.text} {link.hasArrow && <FaSortDown size={12} />}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-center items-center">
          <img className="w-5 h-5" src="/link_up_logo.png" alt="LinkUp Logo" />
          <span className="ml-2">LinkUp Corporation © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;