import React from "react";

interface RadioButtonProps {
  icon: React.ReactNode; // Icon component (e.g., an SVG or FontAwesome icon)
  title: string; // Title text
  subtitle?: string; // Optional subtitle text
  isSelected: boolean; // Whether the radio button is selected
  onClick: () => void; // Click handler
}

const RadioButton: React.FC<RadioButtonProps> = ({
  icon,
  title,
  subtitle,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-4 py-4 justify-between cursor-pointer ${
        isSelected ? "" : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4 px-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-13 h-13 bg-black text-white rounded-full">
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <span className="text-md font-medium text-black dark:text-white">
            {title}
          </span>
          {subtitle && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Radio Button */}
      <div
        className={`w-5 h-5 border-6 mr-5 rounded-full flex items-center justify-center ${
          isSelected
            ? "border-green-600"
            : "border-gray-400 dark:border-gray-600"
        }`}
      >
        {isSelected && (
          <>
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default RadioButton;
