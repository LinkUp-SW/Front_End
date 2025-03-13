import React from 'react';
import { WithNavBar } from '../../components';
import JobCategoryBar from "../../components/jobs_categories/JobsBar";
import JobListings from "./components/JobListings";

const SeeMorePage = () => {
  return (
    <div>
      <JobCategoryBar />
      <JobListings />
    </div>
  );
};

export default WithNavBar(SeeMorePage);
