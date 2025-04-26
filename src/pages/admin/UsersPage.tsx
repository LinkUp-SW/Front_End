import React, { useState } from "react";
import AdminPanelSidebar from "./components/AdminPanel";
import Users from "./components/Users";


const UsersPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
      const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };
  return (
    <div className="flex h-screen">
       <AdminPanelSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Users/>
    </div>
  );
};

export default UsersPage;
