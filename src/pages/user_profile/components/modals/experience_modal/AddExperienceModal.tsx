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
import { Experience, JobTypeEnum } from "@/types";
import { addWorkExperience } from "@/endpoints/userProfile";
import Cookies from "js-cookie";

export interface ExperienceFormData {
  title: string;
  employmentType: string;
  organization: string;
  currentlyWorking: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  location: string;
  locationType: string;
  description: string;
  skills: string[];
  media: MediaItem[];
}

const AddExperienceModal: React.FC = () => {
  const authToken=Cookies.get('linkup_auth_token')
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: "",
    employmentType: "",
    organization: "",
    currentlyWorking: false,
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    location: "",
    locationType: "",
    description: "",
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
    if(!authToken) return
    try {
      const toBeSentFormData:Experience={
        title:formData.title,
          employee_type: formData.employmentType,
          organization: {
            _id:'67e6bb09dc0675f19ad10880',
            logo:'',
            name:'hello'
          },
          is_current: formData.currentlyWorking,
          start_date: new Date(`${formData.startMonth} 1, ${formData.startYear}`),
          end_date: formData.currentlyWorking?undefined:new Date(`${formData.endMonth} 1, ${formData.endYear}`),
          location: formData.location,
          description: formData.description,
          location_type: formData.locationType,
          skills: formData.skills, 
          media: formData.media,
      }
      // Example: simulate a network request
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Submitted form data:", toBeSentFormData);
      const response=await addWorkExperience(authToken,toBeSentFormData)
      console.log(response)
      // ... handle success, close modal, etc.
    } catch (err) {
      console.error(err);
    } finally {
      stopSubmitting();
    }
  };

  return (
    <div
      id="add-experience-modal-container"
      className="max-w-5xl sm:w-[35rem]  w-full"
    >
      <form
        id="experience-form"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <FormInput
          label="Title*"
          placeholder="Ex: Retail Sales Manager"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          id="experience-job-title"
          name="experienceJobTitle"
        />
        <FormSelect
          label="Employment Type*"
          placeholder="Select Employment Type"
          value={formData.employmentType}
          onValueChange={(value) => handleChange("employmentType", value)}
          options={Object.values(JobTypeEnum)}
          id="employment-type"
          name="employmentType"
        />
        <FormInput
          label="Company or Organization*"
          placeholder="Ex: Microsoft"
          value={formData.organization}
          onChange={(e) => handleChange("organization", e.target.value)}
          id="organization-name"
          name="organization"
        />
        <FormCheckbox
          label="I am currently working in this role"
          checked={formData.currentlyWorking}
          onCheckedChange={(checked) =>
            handleChange("currentlyWorking", checked)
          }
          id="currently-working"
          name="currentlyWorking"
        />
        <DatePicker
          label="Start date*"
          month={formData.startMonth}
          year={formData.startYear}
          onMonthChange={(value) => handleChange("startMonth", value)}
          onYearChange={(value) => handleChange("startYear", value)}
          id="start-date"
        />
        <DatePicker
          label="End date*"
          month={formData.endMonth}
          year={formData.endYear}
          onMonthChange={(value) => handleChange("endMonth", value)}
          onYearChange={(value) => handleChange("endYear", value)}
          disabled={formData.currentlyWorking}
          id="end-date"
        />
        <FormInput
          label="Location"
          placeholder="Ex: London, United Kingdom"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          id="job-location"
          name="jobLocation"
        />
        <FormSelect
          label="Location type"
          placeholder="Select Location Type"
          value={formData.locationType}
          onValueChange={(value) => handleChange("locationType", value)}
          options={["remote", "hybrid", "onsite", "flexible"]}
          id="location-type"
          name="locationType"
        />
        <FormTextarea
          label="Description"
          placeholder="List your major duties and successes, highlighting specific projects"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={2000}
          id="job-description"
          name="jobDescription"
        />



        {/* Skills Manager */}
        <SkillsManager
          skills={formData.skills}
          setSkills={(newSkills) => handleChange("skills", newSkills)}
          id="skills-manager"
        />

        {/* Media Manager */}
        <MediaManager
          media={formData.media}
          setMedia={(newMedia) => handleChange("media", newMedia)}
          id="media-manager"
        />

        {/* Submit Button with Loading State */}
        <div id="experience-submit-container" className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            id="experience-submit-button"
            className="bg-blue-600 disabled:opacity-70 cursor-pointer ease-in-out text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            {isSubmitting ? "Submitting..." : "Save Experience"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExperienceModal;
