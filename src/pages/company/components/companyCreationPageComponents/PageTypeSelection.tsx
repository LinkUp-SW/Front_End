import { useState, useEffect } from "react";
import companyImg from "@/assets/company.png";
import institutionImg from "@/assets/institution.png";
import laptopImg from "@/assets/laptop.png";
import mobileImg from "@/assets/mobile.png";
interface PageTypeSelectionProps {
  onSelectType: (type: "company" | "education") => void;
}

export const PageTypeSelection: React.FC<PageTypeSelectionProps> = ({
  onSelectType,
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay to make the transition more noticeable
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleTypeSelection = (type: "company" | "education") => {
    onSelectType(type);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12 max-w-3xl mx-auto pt-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Create a LinkUp Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with clients, employees, and the LinkUp community. To get
          started, choose a page type.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto mb-12">
        {/* Company Button */}
        <button
          id="company-page-btn"
          onClick={() => handleTypeSelection("company")}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center"
        >
          <div className="mb-4 h-16 w-16 flex items-center justify-center">
            <img
              src={companyImg}
              alt="Company icon"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Company
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Small, medium, and large businesses
          </p>
        </button>

        {/* Educational Institution Button */}
        <button
          id="educational-institution-btn"
          onClick={() => handleTypeSelection("education")}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center"
        >
          <div className="mb-4 h-16 w-16 flex items-center justify-center">
            <img
              src={institutionImg}
              alt="Educational institution icon"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Educational institution
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Schools and universities
          </p>
        </button>
      </div>

      <div className="relative w-full max-w-4xl flex justify-center mx-auto overflow-hidden">
        <div
          className={`transform ${
            imagesLoaded
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          } 
          transition-all duration-1000 ease-out`}
        >
          <img
            src={laptopImg}
            alt="Laptop with LinkUp page"
            className="w-full max-w-2xl dark:opacity-90"
          />
        </div>

        <div
          className={`absolute bottom-0 right-8 transform ${
            imagesLoaded
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          } 
          transition-all duration-1000 delay-300 ease-out`}
        >
          <img
            src={mobileImg}
            alt="Mobile with LinkUp page"
            className="w-36 h-64 dark:opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default PageTypeSelection;
