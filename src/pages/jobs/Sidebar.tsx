import React from 'react';
import { FaSortDown } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { SIDEBAR_MENU_ITEMS, FOOTER_LINKS } from '../../constants/index';

const Sidebar: React.FC = () => {
  return (
    <div className="w-full md:w-1/4 md:sticky md:top-20 md:self-start">
      <div className="bg-white rounded-lg shadow p-4">
        {SIDEBAR_MENU_ITEMS.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <span className="text-gray-600">
              {React.createElement(item.icon, { size: 20 })}
            </span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
        
        <div className="border-t my-4"></div>
        
        <div className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
          <FaEdit size={20} />
          <span className="font-medium">Post a free job</span>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="mt-6 text-xs text-gray-600">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link, index) => (
            <span key={index} className="cursor-pointer hover:underline flex items-center">
              {link.text} {link.hasArrow && <FaSortDown  size={12} />}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex items-center">
          <span className="text-blue-600 font-bold">Linkedup</span>
          <span className="ml-1">Linkedup Corporation © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;