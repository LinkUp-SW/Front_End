import { useState } from "react";

const NetworkNavBar = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [activeTab, setTab] = useState("grow");

  const handleTabClick = (tab: string) => {
    setTab(tab);
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 mb-4">
      <button
        onClick={() => handleTabClick("grow")}
        className={`w-1/2 py-2 text-center font-semibold transition cursor-pointer 
          ${
            activeTab === "grow"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          } 
          hover:bg-blue-100 hover:text-blue-700`}
      >
        Grow
      </button>

      <button
        onClick={() => handleTabClick("catch-up")}
        className={`w-1/2 py-2 text-center font-semibold transition cursor-pointer
          ${
            activeTab === "catch-up"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          } 
          hover:bg-blue-100 hover:text-blue-700`}
      >
        Catch Up
      </button>
    </div>
  );
};

export default NetworkNavBar;
