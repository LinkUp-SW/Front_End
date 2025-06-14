import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  DatePicker,
  FormInput,
  FormTextarea,
  OrganizationSearch,
} from "@/components";

import { Education, Organization } from "@/types";
import { getSchoolsList, updateEducation } from "@/endpoints/userProfile";
import { useFormStatus } from "@/hooks/useFormStatus";
import { getErrorMessage } from "@/utils/errorHandler";
import FormSpinner from "@/components/form/form_spinner/FormSpinner";
import SkillsManager from "../components/SkillsManager";
import MediaManager from "../components/MediaManager";
import { MediaItem } from "../components/types";
import { v4 as uuid } from "uuid";
import { extractMonthAndYear, isSkillResponse } from "@/utils";
import { useDispatch } from "react-redux";
import {
  removeOrganizationFromSkills,
  updateEducationSkills,
} from "@/slices/skills/skillsSlice";

interface EditEducationModalProps {
  education: Education;
  onClose?: () => void;
  onSuccess?: (updatedEducation: Education) => void;
}

interface EducationFormData {
  school: Organization;
  degree: string;
  field_of_study: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  grade: string;
  activities_and_socials: string;
  description: string;
  skills: string[];
  media: MediaItem[];
}

const EditEducationModal: React.FC<EditEducationModalProps> = ({
  education,
  onClose,
  onSuccess,
}) => {
  const { month: startMonth, year: startYear } = extractMonthAndYear(
    education.start_date
  );
  const { month: endMonth, year: endYear } = extractMonthAndYear(
    education.end_date
  );

  const authToken = Cookies.get("linkup_auth_token");
  const dispatch = useDispatch();

  const [schoolSearch, setSchoolSearch] = useState("");
  const [isSchoolsLoading, setIsSchoolsLoading] = useState(false);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const [formData, setFormData] = useState<EducationFormData>({
    school: education.school || { _id: "", name: "", logo: "" },
    degree: education.degree,
    field_of_study: education.field_of_study,
    startMonth,
    startYear,
    endMonth,
    endYear,
    grade: education.grade,
    activities_and_socials: education.activities_and_socials,
    description: education.description,
    skills: education.skills || [],
    media: education.media.map((e) => ({ ...e, id: uuid() })) || [],
  });

  useEffect(() => {
    setSchoolSearch(formData.school.name || "");
  }, [formData.school]);

  const handleChange = (field: keyof EducationFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectSchool = (school: Organization) => {
    setFormData((prev) => ({ ...prev, school }));
  };

  const validateForm = (): boolean => {
    const {
      school,
      degree,
      field_of_study,
      startMonth,
      startYear,
      endMonth,
      endYear,
    } = formData;
    if (!degree.trim()) {
      toast.error("Degree is required.");
      return false;
    }
    if (!field_of_study.trim()) {
      toast.error("Field of study is required.");
      return false;
    }
    if (!school._id) {
      toast.error("School is required. Please select from the dropdown.");
      return false;
    }
    if (!startMonth || !startYear) {
      toast.error("Start date is required.");
      return false;
    }
    if (!endMonth || !endYear) {
      toast.error("End date is required.");
      return false;
    }
    const startDate = new Date(`${startMonth} 1, ${startYear}`);
    const endDate = new Date(`${endMonth} 1, ${endYear}`);
    if (startDate > endDate) {
      toast.error("Start date cannot be after end date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmitting();
    if (!authToken) {
      toast.error("You need to be logged in to edit education.");
      stopSubmitting();
      return;
    }
    if (!validateForm()) {
      stopSubmitting();
      return;
    }
    const updatedEducation: Education = {
      _id: education._id,
      school: formData.school,
      degree: formData.degree,
      field_of_study: formData.field_of_study,
      start_date: new Date(`${formData.startMonth} 1, ${formData.startYear}`),
      end_date: new Date(`${formData.endMonth} 1, ${formData.endYear}`),
      grade: formData.grade,
      activities_and_socials: formData.activities_and_socials,
      description: formData.description,
      skills: formData.skills,
      media: formData.media,
    };
    try {
      const res = await updateEducation(
        authToken,
        education._id as string,
        updatedEducation
      );
      toast.success(res.message || "Education updated successfully!");
      onSuccess?.(updatedEducation);
      if (res.education.skills.length === 0) {
        dispatch(
          removeOrganizationFromSkills({ orgId: res.education._id as string })
        );
      } else {
        res.education.skills.forEach((skill) => {
          if (isSkillResponse(skill)) {
            dispatch(
              updateEducationSkills({
                education: {
                  _id: res.education._id as string,
                  name: res.education.school.name,
                  logo: res.education.school.logo,
                },
                newSkills: res.education.skills as unknown as {
                  _id: string;
                  name: string;
                }[],
              })
            );
          }
        });
      }
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${getErrorMessage(err)}`);
    } finally {
      stopSubmitting();
    }
  };

  useEffect(() => {
    if (schoolSearch.trim() === "") {
      setIsSchoolsLoading(false);
    }
  }, [isSchoolsLoading, schoolSearch]);

  return (
    <div className="max-w-5xl sm:w-[35rem] w-full">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <OrganizationSearch
          label="School*"
          selectedOrganization={formData.school}
          onSelect={(org) => handleSelectSchool(org)}
          fetchOrganizations={(query) =>
            getSchoolsList(query).then((res) => res.data)
          }
          placeholder="Enter your school"
          id="school"
          name="school"
        />
        <FormInput
          label="Degree*"
          placeholder="Ex: Bachelor of Science"
          value={formData.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
          id="edit-education-degree"
          name="editEducationDegree"
        />
        <FormInput
          label="Field of Study*"
          placeholder="Ex: Computer Science"
          value={formData.field_of_study}
          onChange={(e) => handleChange("field_of_study", e.target.value)}
          id="edit-education-field"
          name="editEducationField"
        />
        <DatePicker
          label="Start date*"
          month={formData.startMonth}
          year={formData.startYear}
          onMonthChange={(value) => handleChange("startMonth", value)}
          onYearChange={(value) => handleChange("startYear", value)}
          id="edit-education-start-date"
        />
        <DatePicker
          label="End date*"
          month={formData.endMonth}
          year={formData.endYear}
          onMonthChange={(value) => handleChange("endMonth", value)}
          onYearChange={(value) => handleChange("endYear", value)}
          id="edit-education-end-date"
          isFutureAllowed={true}
        />
        <FormInput
          label="Grade*"
          placeholder="Ex: A+"
          value={formData.grade}
          onChange={(e) => handleChange("grade", e.target.value)}
          id="edit-education-grade"
          name="editEducationGrade"
        />
        <FormInput
          label="Activities and Societies"
          placeholder="Ex: Debate Club, Football"
          value={formData.activities_and_socials}
          onChange={(e) =>
            handleChange("activities_and_socials", e.target.value)
          }
          id="edit-education-activities"
          name="editEducationActivities"
        />
        <FormTextarea
          label="Description"
          placeholder="Describe your education experience, courses, etc."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={2000}
          id="edit-education-description"
          name="editEducationDescription"
        />
        <SkillsManager
          skills={formData.skills}
          setSkills={(newSkills) => handleChange("skills", newSkills)}
          id="edit-education-skills-manager"
        />
        <MediaManager
          media={formData.media}
          setMedia={(newMedia) => handleChange("media", newMedia)}
          id="edit-education-media-manager"
        />
        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            id="education-submit-button"
            className="bg-purple-600 hover:bg-purple-700 w-full disabled:opacity-60 disabled:hover:bg-purple-600 disabled:cursor-not-allowed cursor-pointer text-white py-2 px-4 rounded-full transition-all duration-300"
          >
            {isSubmitting ? <FormSpinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEducationModal;
