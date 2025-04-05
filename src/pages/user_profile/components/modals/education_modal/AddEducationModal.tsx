import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { DatePicker, FormInput, FormTextarea } from "@/components";

import { Education, Organization } from "@/types";
import { addEducation, getSchoolsList } from "@/endpoints/userProfile";
import { useFormStatus } from "@/hooks/useFormStatus";
import FormSpinner from "@/components/form/form_spinner/FormSpinner";
import MediaManager from "../components/MediaManager";
import SkillsManager from "../components/SkillsManager";
import { MediaItem } from "../components/types";
import { getErrorMessage } from "@/utils/errorHandler";

const generateTempId = () =>
  crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);

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
  skills: string[];
  description: string;
  media: MediaItem[];
}

interface AddEducationModalProps {
  onClose?: () => void;
  onSuccess?: (newEducation: Education) => void;
}

const AddEducationModal: React.FC<AddEducationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const authToken = Cookies.get("linkup_auth_token");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const [schools, setSchools] = useState<Organization[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [isSchoolsLoading, setIsSchoolsLoading] = useState(false);
  const schoolTimer = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<EducationFormData>({
    school: { _id: "", name: "", logo: "" },
    degree: "",
    field_of_study: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    grade: "",
    activities_and_socials: "",
    skills: [],
    description: "",
    media: [],
  });

  const handleChange = (field: keyof EducationFormData, value: unknown) => {
    if (field === "school") {
      const searchValue = value as string;
      setSchoolSearch(searchValue);

      if (schoolTimer.current) clearTimeout(schoolTimer.current);

      if (!searchValue) {
        setSchools([]);
        return;
      }

      setIsSchoolsLoading(true);
      schoolTimer.current = setTimeout(() => {
        getSchoolsList(searchValue)
          .then((data) => setSchools(data.data))
          .catch(() => toast.error("Failed to search schools"))
          .finally(() => setIsSchoolsLoading(false));
      }, 500);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSelectSchool = (school: Organization) => {
    setFormData((prev) => ({ ...prev, school }));
    setSchoolSearch(school.name);
    setSchools([]);
  };

  const validateForm = () => {
    if (!formData.school._id) {
      toast.error("Please select a school");
      return false;
    }
    if (!formData.degree) {
      toast.error("Degree is required");
      return false;
    }
    if (!formData.startMonth || !formData.startYear) {
      toast.error("Start date is required");
      return false;
    }
    if (!formData.endMonth || !formData.endYear) {
      toast.error("End date is required");
      return false;
    }

    const startDate = new Date(
      `${formData.startMonth} 1, ${formData.startYear}`
    );
    const endDate = new Date(`${formData.endMonth} 1, ${formData.endYear}`);
    if (startDate > endDate) {
      toast.error("Start date cannot be after end date.");
      return false;
    }

    if (formData.grade.trim() === "" || !formData.grade) {
      toast.error("Grade is Required");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (schoolSearch.trim() === "") {
      setIsSchoolsLoading(false);
    }
  }, [isSchoolsLoading, schoolSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmitting();

    if (!validateForm() || !authToken) {
      stopSubmitting();
      return;
    }

    try {
      const newEducation: Education = {
        _id: generateTempId(),
        school: formData.school,
        degree: formData.degree,
        field_of_study: formData.field_of_study,
        start_date: new Date(`${formData.startMonth} 1, ${formData.startYear}`),
        end_date: new Date(`${formData.endMonth} 1, ${formData.endYear}`),
        grade: formData.grade,
        activities_and_socials: formData.activities_and_socials,
        skills: formData.skills,
        description: formData.description,
        media: formData.media,
      };

      const response = await addEducation(authToken, newEducation);
      toast.success(response.message);
      onSuccess?.({ ...newEducation, _id: response.education._id });
      onClose?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      stopSubmitting();
    }
  };

  return (
    <div className="max-w-5xl sm:w-[35rem] w-full">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        {/* School Search */}
        <div className="relative">
          <FormInput
            label="School*"
            value={schoolSearch}
            onChange={(e) => handleChange("school", e.target.value)}
            placeholder="Enter your school"
            id="school"
            name="school"
          />
          {(isSchoolsLoading || schools.length !== 0) && (
            <div className="w-full max-h-fit p-2 bg-white dark:border-gray-400 border dark:bg-gray-800 rounded-lg absolute top-22">
              {isSchoolsLoading ? (
                <SchoolSkeleton />
              ) : (
                <ul className="space-y-2">
                  {schools.map((s) => (
                    <li
                      key={s._id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                      onClick={() => handleSelectSchool(s)}
                    >
                      <img
                        src={s.logo}
                        alt="school-logo"
                        className="h-10 w-10 object-contain rounded-lg"
                      />
                      <p>{s.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <FormInput
          label="Degree*"
          value={formData.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
          placeholder="Enter your degree"
          id="degree"
          name="degree"
        />

        <FormInput
          label="Field of Study"
          value={formData.field_of_study}
          onChange={(e) => handleChange("field_of_study", e.target.value)}
          placeholder="Enter your field of study"
          id="field_of_study"
          name="field_of_study"
        />

        <DatePicker
          label="Start Date*"
          month={formData.startMonth}
          year={formData.startYear}
          onMonthChange={(v) => handleChange("startMonth", v)}
          onYearChange={(v) => handleChange("startYear", v)}
          id="start-date"
        />
        <DatePicker
          label="End Date*"
          month={formData.endMonth}
          year={formData.endYear}
          onMonthChange={(v) => handleChange("endMonth", v)}
          onYearChange={(v) => handleChange("endYear", v)}
          id="end-date"
        />

        <FormInput
          label="Grade*"
          value={formData.grade}
          onChange={(e) => handleChange("grade", e.target.value)}
          placeholder="Ex: A+"
          id="grade"
          name="grade"
        />

        <FormTextarea
          label="Activities & Societies"
          value={formData.activities_and_socials}
          onChange={(e) =>
            handleChange("activities_and_socials", e.target.value)
          }
          placeholder="Enter activities and societies"
          maxLength={500}
          id="activities_and_socials"
          name="activities_and_socials"
        />

        <SkillsManager
          skills={formData.skills}
          setSkills={(s) => handleChange("skills", s)}
          id="education-skills"
        />

        <MediaManager
          media={formData.media}
          setMedia={(m) => handleChange("media", m)}
          id="education-media"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 w-full disabled:opacity-60 disabled:hover:bg-purple-600 disabled:cursor-not-allowed cursor-pointer text-white py-2 px-4 rounded-full transition-all duration-300"
        >
          {isSubmitting ? <FormSpinner /> : "Save Education"}
        </button>
      </form>
    </div>
  );
};

const SchoolSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
);

export default AddEducationModal;
