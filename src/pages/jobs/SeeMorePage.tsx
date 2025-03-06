import React from 'react'
import { WithNavBar } from '../../components';
import JobCategoryBar from "../../components/jobs_categories/JobsBar";

const SeeMorePage = () => {
  return (
    <div>
      <JobCategoryBar />
    </div>
  )
}

export default WithNavBar(SeeMorePage);
