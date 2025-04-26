// pages/admin/AnalyticsPage.tsx
import React from "react";
import WithAdminPanel from "@/components/hoc/WithAdminPanel";
import Analytics from "./components/Analytics";

const AnalyticsPage: React.FC = () => {
    return (
        <div className="flex h-screen">
          
          <Analytics/>
        </div>
      );
};

export default WithAdminPanel(AnalyticsPage);
