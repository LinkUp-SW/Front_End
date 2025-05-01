import React from "react";
import withAdminPanel from "@/components/hoc/WithAdminPanel";
import Settings from "./components/Settings";


const SettingsPage: React.FC = () => {
    
  return (
    <div className="flex h-screen">
      
      <Settings/>
    </div>
  );
};

export default withAdminPanel(SettingsPage);
