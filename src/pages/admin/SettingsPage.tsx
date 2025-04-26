import React, { useState } from "react";
import AdminPanelSidebar from "./components/AdminPanel";
import Settings from "./components/Settings";


const SettingsPage: React.FC = () => {
     const [isOpen, setIsOpen] = useState(false);
    
      const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };
    
  return (
    <div className="flex h-screen">
      <AdminPanelSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Settings/>
    </div>
  );
};

export default SettingsPage;
