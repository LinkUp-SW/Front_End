import React, { useEffect, useState } from "react";
import { FormInput, FormSelect } from "@/components";
import { JobTypeEnum, UserStarterInterface } from "@/types";

interface ExperienceFormData {
  jobTitle: string;
  employeeType: string;
  recentCompany: string;
}

interface JobFormProps {
  setPartialUserStarterData: React.Dispatch<
    React.SetStateAction<Partial<UserStarterInterface>>
  >;
}

const JobForm: React.FC<JobFormProps> = ({ setPartialUserStarterData }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    employeeType: "",
    recentCompany: "",
  });

  // Update form data
  const handleChange = (field: keyof ExperienceFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setPartialUserStarterData(formData);
  }, [formData]);

  return (
    <section className="flex w-full py-2 flex-col items-center">
      <FormInput
        label="Job Title*"
        placeholder="Enter your job title"
        value={formData.jobTitle}
        onChange={(e) => handleChange("jobTitle", e.target.value)}
        extraClassName="w-full"
        id="job-title"
        name="jobTitle"
      />
      {formData.jobTitle.length !== 0 && (
        <>
          <FormSelect
            label="Employment Type*"
            placeholder="Select Employment Type"
            value={formData.employeeType}
            onValueChange={(value) => handleChange("employeeType", value)}
            options={Object.values(JobTypeEnum)}
            extraClassName="w-full"
            id="employee-type"
            name="employeeType"
          />
          <FormInput
            label="Most Recent Company*"
            placeholder="Enter your job title"
            value={formData.recentCompany}
            onChange={(e) => handleChange("recentCompany", e.target.value)}
            extraClassName="w-full"
            id="recent-company"
            name="recentCompany"
          />
        </>
      )}
    </section>
  );
};

export default JobForm;
