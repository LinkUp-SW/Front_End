import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  DatePicker,
  FormCheckbox,
  FormInput,
  FormSelect,
  FormTextarea,
  OrganizationSearch,
} from "@/components";
import SkillsManager from "../components/SkillsManager";
import MediaManager from "../components/MediaManager";
import { MediaItem } from "../components/types";
import { Experience, JobTypeEnum, Organization } from "@/types";
import {
  updateWorkExperience,
  getCompaniesList,
} from "@/endpoints/userProfile";
import { v4 as uuid } from "uuid";
import { useFormStatus } from "@/hooks/useFormStatus";
import { getErrorMessage } from "@/utils/errorHandler";
import FormSpinner from "@/components/form/form_spinner/FormSpinner";
import { extractMonthAndYear, isSkillResponse } from "@/utils";
import { useDispatch } from "react-redux";
import {
  removeOrganizationFromSkills,
  updateExperienceSkills,
} from "@/slices/skills/skillsSlice";

interface EditExperienceModalProps {
  /** The existing experience to edit. */
  experience: Experience;
  /** Called when the modal should be closed, typically after a successful edit */
  onClose?: () => void;
  /** Called with the updated experience after a successful edit */
  onSuccess?: (updatedExp: Experience) => void;
}

interface ExperienceFormData {
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

/**
 * A modal that lets the user edit an existing experience.
 * Pre-populates fields from props.experience.
 */
const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  onClose,
  onSuccess,
}) => {
  // Grab existing values for month/year
  const { month: startMonth, year: startYear } = extractMonthAndYear(
    experience.start_date
  );
  const { month: endMonth, year: endYear } = extractMonthAndYear(
    experience.end_date
  );

  // Auth token check
  const authToken = Cookies.get("linkup_auth_token");
  const dispatch = useDispatch();

  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  // Local form state (pre-fill with the existing experience)
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: experience.title,
    employmentType: experience.employee_type,
    organization: {
      _id: experience.organization?._id || "",
      name: experience.organization?.name || "",
      logo: experience.organization?.logo || "",
    },
    currentlyWorking: experience.is_current,
    startMonth,
    startYear,
    // If they're currently working, we might not have an end date
    endMonth: experience.is_current ? "" : endMonth,
    endYear: experience.is_current ? "" : endYear,
    location: experience.location || "",
    locationType: experience.location_type || "",
    description: experience.description || "",
    skills: experience.skills || [],
    media: experience.media.map((m) => ({ ...m, id: uuid() })) || [],
  });

  /**
   * Generic change handler for most fields
   */
  const handleChange = (field: keyof ExperienceFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * If user clicks a listed organization
   */
  const handleSelectOrganization = (org: Organization) => {
    setFormData((prev) => ({ ...prev, organization: org }));
  };

  /**
   * Validate required fields and date constraints.
   * Returns true if valid; false otherwise.
   */
  const validateForm = (): boolean => {
    const {
      title,
      employmentType,
      organization,
      currentlyWorking,
      startMonth,
      startYear,
      endMonth,
      endYear,
    } = formData;

    // Title is required
    if (!title.trim()) {
      toast.error("Title is required.");
      return false;
    }

    // Employment Type is required
    if (!employmentType) {
      toast.error("Employment type is required.");
      return false;
    }

    // Organization is required. If the user hasn't picked from the list, _id might still be empty
    if (!organization._id) {
      toast.error("Organization is required. Please select from the dropdown.");
      return false;
    }

    // Start month/year are required
    if (!startMonth || !startYear) {
      toast.error("Start date is required (month and year).");
      return false;
    }

    // If user is NOT currently working, end month/year are required
    if (!currentlyWorking) {
      if (!endMonth || !endYear) {
        toast.error("End date is required if not currently working.");
        return false;
      }
    }

    // Compare dates to ensure start is not after end
    const startDate = new Date(`${startMonth} 1, ${startYear}`);
    let endDate: Date | undefined;

    if (!currentlyWorking) {
      endDate = new Date(`${endMonth} 1, ${endYear}`);
      // Check for invalid date range
      if (startDate > endDate) {
        toast.error("Start date cannot be after the end date.");
        return false;
      }
    }

    return true;
  };

  /**
   * Submits the updated form data to the server
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmitting();
    if (!authToken) {
      toast.error("You need to be logged in to edit experience.");
      stopSubmitting();
      return;
    }

    try {
      // -- Perform local validations first --
      if (!validateForm()) {
        stopSubmitting();
        return;
      }

      const updatedExperience: Experience = {
        _id: experience._id, // keep the same ID
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

      // Make a request to your "updateWorkExperience" endpoint
      // This is an example; adjust to match your actual API method
      const res = await updateWorkExperience(
        authToken,
        experience._id as string,
        updatedExperience
      );

      // Typically the server returns an object with {message: string} or similar
      toast.success(res.message || "Experience updated successfully!");

      // Let the parent component update the local experiences list
      onSuccess?.(updatedExperience);

      if (res.experience.skills.length === 0) {
        dispatch(
          removeOrganizationFromSkills({ orgId: res.experience._id as string })
        );
      } else {
        res.experience.skills.forEach((skill) => {
          if (isSkillResponse(skill)) {
            dispatch(
              updateExperienceSkills({
                experience: {
                  _id: res.experience._id as string,
                  name: res.experience.title,
                  logo: res.experience.organization.logo,
                },
                newSkills: res.experience.skills as unknown as {
                  _id: string;
                  name: string;
                }[],
              })
            );
          }
        });
      }

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
    <div className="max-w-5xl sm:w-[35rem] w-full">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Prevent Enter from accidentally submitting if the user is in a text field
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <FormInput
          label="Title*"
          placeholder="Ex: Retail Sales Manager"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          id="edit-experience-title"
          name="editExperienceTitle"
        />

        <FormSelect
          label="Employment Type*"
          placeholder="Select Employment Type"
          value={formData.employmentType}
          onValueChange={(val) => handleChange("employmentType", val)}
          options={Object.values(JobTypeEnum)}
          id="edit-employment-type"
          name="editEmploymentType"
        />

        <OrganizationSearch
          label="Company or Organization*"
          selectedOrganization={formData.organization}
          onSelect={(org) => handleSelectOrganization(org)}
          fetchOrganizations={(query) =>
            getCompaniesList(query).then((res) => res.data)
          }
          placeholder="Ex: Microsoft"
          id="organization-name"
          name="organization"
        />

        <FormCheckbox
          label="I am currently working in this role"
          checked={formData.currentlyWorking}
          onCheckedChange={(checked) =>
            handleChange("currentlyWorking", checked)
          }
          id="edit-currently-working"
          name="editCurrentlyWorking"
        />

        {/* Start Date */}
        <DatePicker
          label="Start date*"
          month={formData.startMonth}
          year={formData.startYear}
          onMonthChange={(val) => handleChange("startMonth", val)}
          onYearChange={(val) => handleChange("startYear", val)}
          id="edit-start-date"
        />

        {/* End Date (disable if currently working) */}
        <DatePicker
          label="End date*"
          month={formData.endMonth}
          year={formData.endYear}
          onMonthChange={(val) => handleChange("endMonth", val)}
          onYearChange={(val) => handleChange("endYear", val)}
          disabled={formData.currentlyWorking}
          id="edit-end-date"
        />

        <FormInput
          label="Location"
          placeholder="Ex: London, United Kingdom"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          id="edit-location"
          name="editLocation"
        />

        <FormSelect
          label="Location type"
          placeholder="Select Location Type"
          value={formData.locationType}
          onValueChange={(val) => handleChange("locationType", val)}
          options={["remote", "hybrid", "onsite", "flexible"]}
          id="edit-location-type"
          name="editLocationType"
        />

        <FormTextarea
          label="Description"
          placeholder="List your major duties, highlighting specific projects"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={2000}
          id="edit-description"
          name="editDescription"
        />

        {/* Skills Manager */}
        <SkillsManager
          skills={formData.skills}
          setSkills={(newSkills) => handleChange("skills", newSkills)}
          id="edit-skills-manager"
        />

        {/* Media Manager */}
        <MediaManager
          media={formData.media}
          setMedia={(newMedia) => handleChange("media", newMedia)}
          id="edit-media-manager"
        />

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            id="experience-submit-button"
            className="bg-purple-600 hover:bg-purple-700 w-full disabled:opacity-60 disabled:hover:bg-purple-600 disabled:cursor-not-allowed cursor-pointer text-white py-2 px-4 rounded-full transition-all duration-300"
          >
            {isSubmitting ? <FormSpinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExperienceModal;
