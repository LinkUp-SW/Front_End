import React from "react";

const LinkedInFooter: React.FC = () => {
  return (
    <footer className=" text-gray-600 text-xs p-4 right-3 w-64 sticky top-0">
      <div className="flex flex-wrap justify-center gap-3">
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Accessibility
        </a>
        <a href="#" className="hover:underline">
          Help Center
        </a>
        <a href="#" className="hover:underline">
          Privacy & Terms
        </a>
        <a href="#" className="hover:underline">
          Ad Choices
        </a>
        <a href="#" className="hover:underline">
          Advertising
        </a>
        <a href="#" className="hover:underline">
          Business Services
        </a>
        <a href="#" className="hover:underline">
          Get the LinkUp app
        </a>
        <a href="#" className="hover:underline">
          More
        </a>
      </div>

      {/* Copyright Section */}
      <div className="mt-2 flex justify-center items-center">
        <img className="w-5 h-5" src="../../../public/link_up_logo.png"></img>
        <span className="ml-2">LinkUp Corporation © 2025</span>
      </div>
    </footer>
  );
};

export default LinkedInFooter;
