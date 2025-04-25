import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { DatePicker, FormInput, OrganizationSearch } from "@/components";

import { License, Organization } from "@/types";
import {
  editLicense,
  getOrganizationsAndSchoolsList,
} from "@/endpoints/userProfile";
import { useFormStatus } from "@/hooks/useFormStatus";
import FormSpinner from "@/components/form/form_spinner/FormSpinner";
import MediaManager from "../components/MediaManager";
import SkillsManager from "../components/SkillsManager";
import { MediaItem } from "../components/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { extractMonthAndYear } from "@/utils";

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
  license: License;
  onClose?: () => void;
  onSuccess?: (newLicense: License) => void;
}

const EditLicenseModal: React.FC<AddLicenseModalProps> = ({
  license,
  onClose,
  onSuccess,
}) => {
  const { month: startMonth, year: startYear } = extractMonthAndYear(
    license.issue_date
  );
  const { month: endMonth, year: endYear } = extractMonthAndYear(
    license.expiration_date
  );
  const authToken = Cookies.get("linkup_auth_token");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const [formData, setFormData] = useState<LicenseFormData>({
    issuing_organization: license.issuing_organization || {
      _id: "",
      name: "",
      logo: "",
    },
    name: license.name || "",
    startMonth: startMonth || "",
    startYear: startYear || "",
    endMonth: endMonth || "",
    endYear: endYear || "",
    credintial_id: license.credintial_id || "",
    skills: license.skills || [],
    credintial_url: license.credintial_url || "",
    media: license.media.map((l) => ({ ...l, id: generateTempId() })) || [],
  });

  const handleChange = (field: keyof LicenseFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmitting();

    if (!validateForm() || !authToken) {
      stopSubmitting();
      return;
    }

    try {
      const newLicense: License = {
        _id: license._id,
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

      const response = await editLicense(
        authToken,
        license._id as string,
        newLicense
      );
      toast.success(response.message);
      console.log(response.license)
      onSuccess?.(newLicense);
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
        {/* Organization Search */}
        <OrganizationSearch
          label="Issuing Organization*"
          selectedOrganization={formData.issuing_organization}
          onSelect={(org) =>
            setFormData((prev) => ({
              ...prev,
              issuing_organization: org,
            }))
          }
          fetchOrganizations={(query) =>
            getOrganizationsAndSchoolsList(query).then((res) => res.data)
          }
          placeholder="Enter your school"
          id="issuing-organization"
          name="issuing_organization"
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
          {isSubmitting ? <FormSpinner /> : "Save License"}
        </button>
      </form>
    </div>
  );
};

export default EditLicenseModal;
