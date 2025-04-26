import React,{ useState}from "react";
import AdminPanelSidebar from "./components/AdminPanel";
import JobPostings from "./components/JobPostings";


const JobPostingsPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
      const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };
    
  return (
    <div className="flex h-screen">
      <AdminPanelSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <JobPostings/>
    </div>
  );
};

export default JobPostingsPage;
