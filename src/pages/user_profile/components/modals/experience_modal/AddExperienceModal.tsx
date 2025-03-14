import React, { useState } from "react";
import {
  DatePicker,
  FormCheckbox,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components";
import { useFormStatus } from "@/hooks/useFormStatus";
import SkillsManager from "./components/SkillsManager";
import MediaManager from "./components/MediaManager";
import { MediaItem } from "./types";
import Header from "../components/Header";

enum JobTypeEnum {
  full_time = "Full-time",
  part_time = "Part-time",
  contract = "Contract",
  temporary = "Temporary",
  other = "Other",
  volunteer = "Volunteer",
  internship = "Internship",
}

export interface ExperienceFormData {
  title: string;
  employmentType: string;
  company: string;
  currentlyWorking: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  location: string;
  locationType: string;
  description: string;
  profileHeadline: string;
  jobSource: string;
  skills: string[];
  media: MediaItem[];
}

const AddExperienceModal: React.FC = () => {
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: "",
    employmentType: "",
    company: "",
    currentlyWorking: false,
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    location: "",
    locationType: "",
    description: "",
    profileHeadline: "",
    jobSource: "",
    skills: [],
    media: [],
  });

  // Update form data
  const handleChange = (field: keyof ExperienceFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Simulate an async submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmitting();
    try {
      // Example: simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Submitted form data:", formData);
      // ... handle success, close modal, etc.
    } catch (err) {
      // ... handle error
      console.error(err);
    } finally {
      stopSubmitting();
    }
  };
  return (
    <div className="max-w-5xl sm:w-[35rem] w-full">
      <form onSubmit={handleSubmit}>
        <Header title="Add Experience" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          *Indicates required
        </p>

        <FormInput
          label="Title*"
          placeholder="Ex: Retail Sales Manager"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <FormSelect
          label="Employment Type*"
          placeholder="Select Employment Type"
          value={formData.employmentType}
          onValueChange={(value) => handleChange("employmentType", value)}
          options={Object.values(JobTypeEnum)}
        />
        <FormInput
          label="Company or Organization*"
          placeholder="Ex: Microsoft"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />
        <FormCheckbox
          label="I am currently working in this role"
          checked={formData.currentlyWorking}
          onCheckedChange={(checked) =>
            handleChange("currentlyWorking", checked)
          }
        />
        <DatePicker
          label="Start date*"
          month={formData.startMonth}
          year={formData.startYear}
          onMonthChange={(value) => handleChange("startMonth", value)}
          onYearChange={(value) => handleChange("startYear", value)}
        />
        <DatePicker
          label="End date*"
          month={formData.endMonth}
          year={formData.endYear}
          onMonthChange={(value) => handleChange("endMonth", value)}
          onYearChange={(value) => handleChange("endYear", value)}
          disabled={formData.currentlyWorking}
        />
        <FormInput
          label="Location"
          placeholder="Ex: London, United Kingdom"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <FormSelect
          label="Location type"
          placeholder="Select Location Type"
          value={formData.locationType}
          onValueChange={(value) => handleChange("locationType", value)}
          options={["remote", "hybrid", "onsite", "flexible"]}
        />
        <FormTextarea
          label="Description"
          placeholder="List your major duties and successes, highlighting specific projects"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={2000}
        />
        <FormInput
          label="Profile headline"
          placeholder=""
          value={formData.profileHeadline}
          onChange={(e) => handleChange("profileHeadline", e.target.value)}
          helperText="Appears below your name at the top of the profile"
        />
        <FormSelect
          label="Where did you find this job?"
          placeholder="Please select"
          value={formData.jobSource}
          onValueChange={(value) => handleChange("jobSource", value)}
          options={["linkedin", "company-website", "referral", "other"]}
        />

        {/* Skills Manager */}
        <SkillsManager
          skills={formData.skills}
          setSkills={(newSkills) => handleChange("skills", newSkills)}
        />

        {/* Media Manager */}
        <MediaManager
          media={formData.media}
          setMedia={(newMedia) => handleChange("media", newMedia)}
        />

        {/* Submit Button with Loading State */}
        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 disabled:opacity-70 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            {isSubmitting ? "Submitting..." : "Save Experience"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExperienceModal;
