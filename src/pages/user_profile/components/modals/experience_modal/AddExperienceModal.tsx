import React, { useRef, useState } from "react";
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
import { Experience, JobTypeEnum, Organization } from "@/types";
import { addWorkExperience, getCompaniesList } from "@/endpoints/userProfile";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

/**
 * We'll rely on user input + a generated ID to create a new Experience object
 * for the local list, because the server doesn't provide it back.
 */
const generateTempId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback if crypto.randomUUID is unavailable
  return Math.random().toString(36).substring(2, 15);
};

export interface ExperienceFormData {
  title: string;
  employmentType: string;
  organization: Organization;
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

interface AddExperienceModalProps {
  /**
   * Called when the modal should be closed, typically after a successful submission
   */
  onClose?: () => void;
  /**
   * Called on a successful experience creation; passes the newly created experience
   */
  onSuccess?: (newExperience: Experience) => void;
}

const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const authToken = Cookies.get("linkup_auth_token");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationSearch, setOrganizationSearch] = useState("");
  const [isOrgsLoading, setIsOrgsLoading] = useState(false);

  const [formData, setFormData] = useState<ExperienceFormData>({
    title: "",
    employmentType: "",
    organization: { _id: "", name: "", logo: "" },
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

  // Debounce timer for organization search
  const organizationTimer = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (field: keyof ExperienceFormData, value: unknown) => {
    // Special case for organization searching
    if (field === "organization") {
      const searchValue = value as string;
      setOrganizationSearch(searchValue);

      if (organizationTimer.current) {
        clearTimeout(organizationTimer.current);
      }

      if (searchValue === "") {
        setOrganizations([]);
        return;
      }

      setIsOrgsLoading(true);
      organizationTimer.current = setTimeout(() => {
        getCompaniesList(searchValue)
          .then((data) => {
            setOrganizations(data.data);
          })
          .catch((error) => {
            console.error("Error fetching companies:", error);
            toast.error("Failed to fetch companies.");
          })
          .finally(() => {
            setIsOrgsLoading(false);
          });
      }, 500);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSelectOrganization = (org: Organization) => {
    setFormData((prev) => ({ ...prev, organization: org }));
    setOrganizationSearch(org.name);
    setOrganizations([]);
  };

  /**
   * Submits the form data to create a new Experience.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmitting();

    // Ensure user is logged in
    if (!authToken) {
      toast.error("You need to be logged in to add experience.");
      stopSubmitting();
      return;
    }

    try {
      // Build up the new Experience data from the form
      const toBeSentFormData: Experience = {
        _id: generateTempId(), // Temporary ID for local state
        title: formData.title,
        employee_type: formData.employmentType,
        organization: formData.organization,
        is_current: formData.currentlyWorking,
        start_date: new Date(`${formData.startMonth} 1, ${formData.startYear}`),
        end_date: formData.currentlyWorking
          ? undefined
          : new Date(`${formData.endMonth} 1, ${formData.endYear}`),
        location: formData.location,
        description: formData.description,
        location_type: formData.locationType,
        skills: formData.skills,
        media: formData.media,
      };

      // We only rely on the server returning a 200 status to confirm success
      const response = await addWorkExperience(authToken, toBeSentFormData);

      // If we reach here, the request is successful (status 200)
      // The returned `response` likely has a `message` and an unrelated object
      toast.success(response?.message || "Experience added successfully!");

      // Update the parent state with the newly created experience
      onSuccess?.(toBeSentFormData);

      // Close the modal
      onClose?.();
    } catch (err) {
      console.error(err);
      const error = getErrorMessage(err);
      toast.error(`Error: ${error}`);
    } finally {
      stopSubmitting();
    }
  };

  return (
    <div
      id="add-experience-modal-container"
      className="max-w-5xl sm:w-[35rem] w-full"
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
        <div className="w-full relative">
          <FormInput
            label="Company or Organization*"
            placeholder="Ex: Microsoft"
            value={organizationSearch}
            onChange={(e) => handleChange("organization", e.target.value)}
            id="organization-name"
            name="organization"
          />
          {(isOrgsLoading || organizations.length !== 0) && (
            <div className="w-full max-h-fit p-2 bg-white dark:border-gray-400 border dark:bg-gray-800 rounded-lg z-50 absolute top-22">
              {isOrgsLoading ? (
                <OrganizationSkeleton />
              ) : (
                <ul className="space-y-2">
                  {organizations.map((org) => (
                    <li
                      key={org._id}
                      className="w-full flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                      onClick={() => handleSelectOrganization(org)}
                    >
                      <img
                        src={org.logo}
                        alt="org-logo"
                        className="h-10 w-10 object-contain rounded-lg"
                      />
                      <p>{org.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
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

        <SkillsManager
          skills={formData.skills}
          setSkills={(newSkills) => handleChange("skills", newSkills)}
          id="skills-manager"
        />

        <MediaManager
          media={formData.media}
          setMedia={(newMedia) => handleChange("media", newMedia)}
          id="media-manager"
        />

        <div id="experience-submit-container" className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            id="experience-submit-button"
            className="bg-blue-600 disabled:opacity-70 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            {isSubmitting ? "Submitting..." : "Save Experience"}
          </button>
        </div>
      </form>
    </div>
  );
};

const OrganizationSkeleton: React.FC = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div className="flex items-center gap-2" key={index}>
        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
);

export default AddExperienceModal;
