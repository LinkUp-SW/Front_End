import React, { useState } from 'react';
import { WithNavBar } from '../../components';
// import JobCategoryBar from "../../components/jobs_categories/JobsBar";
import  JobFilterBar from "../../components/jobs_categories/JobFilterBar";
import JobListings from "./components/seeMorePageComponents/JobListings";

const SeeMorePage: React.FC = () => {
  // const [selectedCategory, setSelectedCategory] = useState<string>("For You");

  // const handleCategorySelect = (category: string): void => {
  //   setSelectedCategory(category);
  // };



  return (
    <div>
      {/* <JobCategoryBar selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} /> */}
      {/* {selectedCategory === "For You" && <JobListings />} */}
      <JobFilterBar /> 
      <JobListings />
    </div>
  );
};

export default WithNavBar(SeeMorePage);