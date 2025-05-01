import React from "react";
import withAdminPanel from "@/components/hoc/WithAdminPanel";
import JobPostings from "./components/JobPostings";


const JobPostingsPage: React.FC = () => {
    
    
  return (
    <div className="flex h-screen">
      
      <JobPostings/>
    </div>
  );
};

export default withAdminPanel(JobPostingsPage);
