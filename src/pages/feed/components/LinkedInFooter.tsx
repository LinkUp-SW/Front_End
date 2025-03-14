import React from "react";
import { FOOTER_LINKS } from "@/constants";
import { FaSortDown } from "react-icons/fa";

const LinkedInFooter: React.FC = () => {
  return (
    <footer className=" text-gray-600 text-xs p-4 right-14 w-64 sticky top-18 dark:text-neutral-400">
      <div className="flex flex-wrap justify-center gap-3">
        {FOOTER_LINKS.map((link, index) => (
          <span
            key={index}
            className="cursor-pointer relative right-2 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center"
          >
            <span>{link.text}</span>
            <span>{link.hasArrow && <FaSortDown size={12} />}</span>
          </span>
        ))}
      </div>

      {/* Copyright Section */}
      <div className="mt-2 flex justify-center relative right-3 pt-2 items-center">
        <img className="w-5 h-5" src="/link_up_logo.png"></img>
        <span className="ml-2">LinkUp Corporation © 2025</span>
      </div>
    </footer>
  );
};

export default LinkedInFooter;
