import React from "react";
import WithAdminPanel from "@/components/hoc/WithAdminPanel";
import Users from "./components/Users";


const UsersPage: React.FC = () => {
    
  return (
   
       
      <Users/>
    
  );
};

export default WithAdminPanel(UsersPage);
