import React from "react";
import WithAdminPanel from "@/components/hoc/WithAdminPanel";
import ContentModeration from "./components/ContentModeration";


const ContentModerationPage: React.FC = () => {
  
    return (
        <div className="flex h-screen">
          
          <ContentModeration/>
        </div>
      );
    

};

export default  WithAdminPanel(ContentModerationPage);
