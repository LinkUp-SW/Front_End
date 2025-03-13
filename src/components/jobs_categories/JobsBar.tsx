import React, { useState } from "react";
import { PiCaretCircleLeftThin, PiCaretCircleRightThin } from "react-icons/pi";
import { 
  FaStar, FaBriefcase, FaLaptop, FaClock, FaBuilding, 
  FaCode, FaLeaf, FaUniversity, FaNotesMedical, 
  FaFlask, FaChartLine, FaHardHat, FaUserTie, 
  FaGraduationCap, FaPills, FaShieldAlt, FaIndustry, 
  FaHotel, FaHandHoldingHeart, FaStore, 
  FaHome, FaUniversity as FaHigherEd, FaTruck, 
  FaRoad, FaUsers, FaHandsHelping, FaChartPie, 
  FaNewspaper, FaCoffee, FaClipboardList, 
  FaBalanceScale, FaTshirt, FaShoppingBag, 
  FaPaw, FaShieldVirus 
} from "react-icons/fa";

const ICONS = {
  "For You": FaStar,
  "Easy Apply": FaBriefcase,
  "Remote": FaLaptop,
  "Part-time": FaClock,
  "Hybrid": FaBuilding,
  "IT": FaCode,
  "Sustainability": FaLeaf,
  "Government": FaUniversity,
  "Healthcare": FaNotesMedical,
  "Biotech": FaFlask,
  "Finance": FaChartLine,
  "Construction": FaHardHat,
  "HR": FaUserTie,
  "Education": FaGraduationCap,
  "Pharma": FaPills,
  "Defense & Space": FaShieldAlt,
  "Manufacturing": FaIndustry,
  "Hospitality": FaHotel,
  "Social Impact": FaHandHoldingHeart,
  "Small Biz": FaStore,
  "Real Estate": FaHome,
  "Higher Ed": FaHigherEd,
  "Logistics": FaTruck,
  "Civil Eng": FaRoad,
  "Human Services": FaUsers,
  "Non-Profit": FaHandsHelping,
  "Career Growth": FaChartPie,
  "Media": FaNewspaper,
  "Food & Bev": FaCoffee,
  "Recruiting": FaClipboardList,
  "Work Life Balance": FaBalanceScale,
  "Marketing": FaTshirt,
  "Fashion": FaTshirt,
  "Retail": FaShoppingBag,
  "Veterinary Med": FaPaw,
  "Digital Security": FaShieldVirus
};

const JobCategoryBar: React.FC = () => {
  const categories = [
    "For You", "Easy Apply", "Remote", "Part-time", "Hybrid", "IT", "Sustainability",
    "Government", "Healthcare", "Biotech", "Finance", "Construction", "HR", "Education",
    "Pharma", "Defense & Space", "Manufacturing", "Hospitality", "Social Impact",
    "Small Biz", "Real Estate", "Higher Ed", "Logistics", "Civil Eng", "Human Services",
    "Non-Profit", "Career Growth", "Media", "Food & Bev", "Recruiting", "Work Life Balance",
    "Marketing", "Fashion", "Retail", "Veterinary Med", "Digital Security"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCategories = 5;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      Math.min(prevIndex + 1, categories.length - visibleCategories)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      Math.max(prevIndex - 1, 0)
    );
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center fixed top-15 left-0 z-15">
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev} 
          className="text-gray-600 hover:text-blue-600 px-2"
        >
          <PiCaretCircleLeftThin size={24} />
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
          {categories.map((category) => {
            const Icon = ICONS[category as keyof typeof ICONS] || FaBriefcase;
            return (
              <div 
                key={category} 
                className="flex-shrink-0 flex flex-col items-center justify-center cursor-pointer group"
                style={{
                  width: `${100 / visibleCategories}%`
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center mb-1">
                  <Icon 
                    className="text-gray-600 group-hover:text-blue-600 transition-colors" 
                    size={20} 
                  />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors text-center">
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
          className="text-gray-600 hover:text-blue-600 px-2"
        >
          <PiCaretCircleRightThin size={24} />
        </button>
      )}
    </div>
  );
};

export default JobCategoryBar;