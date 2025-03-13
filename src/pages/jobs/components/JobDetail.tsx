// src/pages/SeeMorePage/components/JobListings/JobDetail.tsx
import React from "react";
import JobHeader from "./JobHeader";
import JobContent from "./JobContent";
import { Job } from "../types";

interface JobDetailProps {
  job: Job;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  return (
    <div className="p-4 md:p-6">
      <JobHeader job={job} />
      <JobContent job={job} />
    </div>
  );
};

export default JobDetail;