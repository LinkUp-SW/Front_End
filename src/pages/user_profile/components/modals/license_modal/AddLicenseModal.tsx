import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { DatePicker, FormInput } from "@/components";

import { License, Organization } from "@/types";
import {
  addLicense,
  getOrganizationsAndSchoolsList,
} from "@/endpoints/userProfile";
import { useFormStatus } from "@/hooks/useFormStatus";
import FormSpinner from "@/components/form/form_spinner/FormSpinner";
import MediaManager from "../components/MediaManager";
import SkillsManager from "../components/SkillsManager";
import { MediaItem } from "../components/types";
import { getErrorMessage } from "@/utils/errorHandler";

const generateTempId = () =>
  crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);

interface LicenseFormData {
  issuing_organization: Organization;
  name: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  credintial_id: string;
  credintial_url: string;
  skills: string[];
  media: MediaItem[];
}

interface AddLicenseModalProps {
  onClose?: () => void;
  onSuccess?: (newLicense: License) => void;
}

const AddLicenseModal: React.FC<AddLicenseModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const authToken = Cookies.get("linkup_auth_token");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const [schools, setSchools] = useState<Organization[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [isSchoolsLoading, setIsSchoolsLoading] = useState(false);
  const schoolTimer = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<LicenseFormData>({
    issuing_organization: { _id: "", name: "", logo: "" },
    name: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    credintial_id: "",
    skills: [],
    credintial_url: "",
    media: [],
  });

  const handleChange = (field: keyof LicenseFormData, value: unknown) => {
    if (field === "issuing_organization") {
      const searchValue = value as string;
      setSchoolSearch(searchValue);

      if (schoolTimer.current) clearTimeout(schoolTimer.current);

      if (!searchValue) {
        setSchools([]);
        return;
      }

      setIsSchoolsLoading(true);
      schoolTimer.current = setTimeout(() => {
        getOrganizationsAndSchoolsList(searchValue)
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
    if (!formData.issuing_organization._id) {
      toast.error("Please select an issuing organization");
      return false;
    }
    if (!formData.name) {
      toast.error("Certification Name is required");
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
      const newLicense: License = {
        _id: generateTempId(),
        issuing_organization: formData.issuing_organization,
        name: formData.name,
        credintial_url: formData.credintial_url,
        issue_date: new Date(`${formData.startMonth} 1, ${formData.startYear}`),
        expiration_date: new Date(
          `${formData.endMonth} 1, ${formData.endYear}`
        ),
        credintial_id: formData.credintial_id,
        skills: formData.skills,
        media: formData.media,
      };

      const response = await addLicense(authToken, newLicense);
      toast.success(response.message);
      onSuccess?.({ ...newLicense, _id: response.education._id });
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
        <FormInput
          label="Name*"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ex: Microsoft certified network associate security"
          id="license-name"
          name="name"
        />
        {/* School Search */}
        <div className="relative">
          <FormInput
            label="Issuing Organization*"
            value={schoolSearch}
            onChange={(e) =>
              handleChange("issuing_organization", e.target.value)
            }
            placeholder="Enter your school"
            id="issuing-organization"
            name="issuing_organization"
          />
          {(isSchoolsLoading || schools.length !== 0) && (
            <div className="w-full max-h-fit p-2 bg-white dark:border-gray-400 border dark:bg-gray-800 rounded-lg absolute top-22">
              {isSchoolsLoading ? (
                <OrganizationSchoolSkeleton />
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
          label="Credential ID"
          value={formData.credintial_id}
          onChange={(e) => handleChange("credintial_id", e.target.value)}
          placeholder="Enter your Credential ID"
          id="credential-id"
          name="credintial_id"
        />

        <FormInput
          label="Credential URL"
          value={formData.credintial_url}
          onChange={(e) => handleChange("credintial_url", e.target.value)}
          placeholder="Enter the Credential URL"
          id="credential-url"
          name="credintial_url"
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

const OrganizationSchoolSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
);

export default AddLicenseModal;
