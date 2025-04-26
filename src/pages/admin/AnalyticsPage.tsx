import React, { useState }  from "react";
import AdminPanelSidebar from "./components/AdminPanel";
import Analytics from "./components/Analytics";


const AnalyticsPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
      const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };
  return (
    <div className="flex h-screen">
       <AdminPanelSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Analytics/>
    </div>
  );
};

export default AnalyticsPage;
