import React, { useState, useEffect } from "react";
import { IoChevronBackCircleOutline, IoChevronForwardCircleOutline } from "react-icons/io5";
import { 
  IoStar, IoBriefcase, IoLaptopOutline, IoTimeOutline, IoBusinessOutline,
  IoCodeSlashOutline, IoLeafOutline, IoSchoolOutline, IoMedicalOutline,
  IoFlaskOutline, IoTrendingUpOutline, IoHammerOutline, IoPeopleOutline,
  IoBookOutline, IoMedkitOutline, IoRocketOutline, IoConstructOutline,
  IoRestaurantOutline, IoHeartOutline, IoStorefrontOutline,
  IoHomeOutline, IoLibraryOutline, IoCarOutline,
  IoCompassOutline, IoPersonOutline, IoHandLeftOutline, IoBarChartOutline,
  IoNewspaperOutline, IoCafeOutline, IoDocumentTextOutline,
  IoScaleOutline, IoMegaphoneOutline, IoShirtOutline, IoCartOutline,
  IoPawOutline, IoShieldOutline
} from "react-icons/io5";

const ICONS = {
  "For You": IoStar,
  "Easy Apply": IoBriefcase,
  "Remote": IoLaptopOutline,
  "Part-time": IoTimeOutline,
  "Hybrid": IoBusinessOutline,
  "IT": IoCodeSlashOutline,
  "Sustainability": IoLeafOutline,
  "Government": IoSchoolOutline,
  "Healthcare": IoMedicalOutline,
  "Biotech": IoFlaskOutline,
  "Finance": IoTrendingUpOutline,
  "Construction": IoHammerOutline,
  "HR": IoPeopleOutline,
  "Education": IoBookOutline,
  "Pharma": IoMedkitOutline,
  "Defense & Space": IoRocketOutline,
  "Manufacturing": IoConstructOutline,
  "Hospitality": IoRestaurantOutline,
  "Social Impact": IoHeartOutline,
  "Small Biz": IoStorefrontOutline,
  "Real Estate": IoHomeOutline,
  "Higher Ed": IoLibraryOutline,
  "Logistics": IoCarOutline,
  "Civil Eng": IoCompassOutline,
  "Human Services": IoPersonOutline,
  "Non-Profit": IoHandLeftOutline,
  "Career Growth": IoBarChartOutline,
  "Media": IoNewspaperOutline,
  "Food & Bev": IoCafeOutline,
  "Recruiting": IoDocumentTextOutline,
  "Work Life Balance": IoScaleOutline,
  "Marketing": IoMegaphoneOutline,
  "Fashion": IoShirtOutline,
  "Retail": IoCartOutline,
  "Veterinary Med": IoPawOutline,
  "Digital Security": IoShieldOutline
};

// Define type for the icons object
type IconsType = typeof ICONS;

// Define the props interface for the component
interface JobCategoryBarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const JobCategoryBar: React.FC<JobCategoryBarProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const categories: string[] = [
    "For You", "Easy Apply", "Remote", "Part-time", "Hybrid", "IT", "Sustainability",
    "Government", "Healthcare", "Biotech", "Finance", "Construction", "HR", "Education",
    "Pharma", "Defense & Space", "Manufacturing", "Hospitality", "Social Impact",
    "Small Biz", "Real Estate", "Higher Ed", "Logistics", "Civil Eng", "Human Services",
    "Non-Profit", "Career Growth", "Media", "Food & Bev", "Recruiting", "Work Life Balance",
    "Marketing", "Fashion", "Retail", "Veterinary Med", "Digital Security"
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const visibleCategories: number = 5;

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => 
      Math.min(prevIndex + 1, categories.length - visibleCategories)
    );
  };

  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) => 
      Math.max(prevIndex - 1, 0)
    );
  };

 

  // Function to find category index
  const findCategoryIndex = (category: string): number => {
    return categories.indexOf(category);
  };

  // Ensure selected category is visible
  useEffect(() => {
    const selectedIndex = findCategoryIndex(selectedCategory);
    if (selectedIndex !== -1) {
      if (selectedIndex < currentIndex) {
        setCurrentIndex(selectedIndex);
      } else if (selectedIndex >= currentIndex + visibleCategories) {
        setCurrentIndex(selectedIndex - visibleCategories + 1);
      }
    }
  }, [selectedCategory]);

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center fixed top-15 left-0 z-15">
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev} 
          className="text-gray-600 hover:text-blue-600 px-2 transition-colors duration-200"
          aria-label="Previous categories"
        >
          <IoChevronBackCircleOutline size={26} />
        </button>
      )}
      
      <div className="flex items-center flex-grow overflow-x-hidden">
        <div 
          className="flex items-center"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCategories)}%)`,
            transition: 'transform 0.3s ease'
          }}
        >
          {categories.map((category: string) => {
            const Icon = ICONS[category as keyof IconsType] || IoBriefcase;
            const isSelected = category === selectedCategory;
            
            return (
              <div 
                key={category} 
                className={`flex-shrink-0 flex flex-col items-center justify-center cursor-pointer group px-2 py-1 ${
                  isSelected ? 'text-blue-600' : ''
                }`}
                style={{
                  width: `${100 / visibleCategories}%`
                }}
                onClick={() => onCategorySelect(category)}
              >
                <div className={`w-10 h-10 flex items-center justify-center mb-1 rounded-full ${
                  isSelected 
                    ? 'bg-blue-100' 
                    : 'bg-gray-50 group-hover:bg-blue-50'
                } transition-colors duration-200`}>
                  <Icon 
                    className={`${
                      isSelected 
                        ? 'text-blue-600' 
                        : 'text-gray-600 group-hover:text-blue-600'
                    } transition-colors duration-200`} 
                    size={22} 
                  />
                </div>
                <span className={`text-xs ${
                  isSelected 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 group-hover:text-blue-600'
                } transition-colors duration-200 text-center`}>
                  {category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {currentIndex < categories.length - visibleCategories && (
        <button 
          onClick={handleNext} 
          className="text-gray-600 hover:text-blue-600 px-2 transition-colors duration-200"
          aria-label="Next categories"
        >
          <IoChevronForwardCircleOutline size={26} />
        </button>
      )}
    </div>
  );
};

export default JobCategoryBar;