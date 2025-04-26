import React from "react";
import WithAdminPanel from "@/components/hoc/WithAdminPanel";
import Users from "./components/Users";


const UsersPage: React.FC = () => {
    
  return (
    <div className="flex h-screen">
       
      <Users/>
    </div>
  );
};

export default WithAdminPanel(UsersPage);
