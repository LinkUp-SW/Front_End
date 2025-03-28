import React, { useState } from 'react';
import { WithNavBar } from '../../components';
import JobFilterBar from "../../components/jobs_categories/JobFilterBar";
import JobListings from "./components/seeMorePageComponents/JobListings";
import { JobFilters } from './types';

const SeeMorePage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    locations: [],
    company: [],
    experienceLevels: [],
    workModes: [],
    salaryRanges: []
  });

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <JobFilterBar onFiltersChange={handleFiltersChange} /> 
      <JobListings filters={filters} />
    </div>
  );
};

export default WithNavBar(SeeMorePage);