import React , { useState }from "react";
import AdminPanelSidebar from "./components/AdminPanel";
import ContentModeration from "./components/ContentModeration";


const ContentModerationPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
      const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };
  return (
    <div className="flex h-screen">
       <AdminPanelSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <ContentModeration/>
    </div>
  );
};

export default ContentModerationPage;
