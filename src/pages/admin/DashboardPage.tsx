import React from "react";
import Dashboard from "./components/Dashboard";
import WithAdminPanel from "@/components/hoc/WithAdminPanel";

const DashboardPage: React.FC = () => {
  return <Dashboard />;
};

export default WithAdminPanel(DashboardPage);
