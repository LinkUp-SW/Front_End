import { JSX } from "react";
import AddExperienceModal from "./experience_modal/AddExperienceModal";
import AddEducationModal from "./education_modal/AddEducationModal";
import AddLicenseModal from "./license_modal/AddLicenseModal";

export const sectionModalMap: {
  [key: string]: { title: string; content: JSX.Element; id: string };
} = {
  education: {
    title: "Add Education",
    content: <AddEducationModal />,
    id: "add-education-modal",
  },
  experience: {
    title: "Add Experience",
    content: <AddExperienceModal />,
    id: "add-experience-modal",
  },
  skills: {
    title: "Add Skills",
    content: <></>,
    id: "add-skills-modal",
  },
  license: {
    title: "Add License",
    content: <AddLicenseModal />,
    id: "add-license-modal",
  },
  resume: {
    title: "Add Resume",
    content: <></>,
    id: "add-resume-modal",
  },
};
