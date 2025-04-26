import React, { useState } from "react";
import AdminPanelSidebar from "./components/AdminPanel";
import Dashboard from "./components/Dashboard";

const DashboardPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      <AdminPanelSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
