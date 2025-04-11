import { JSX } from "react";
import AddExperienceModal from "./experience_modal/AddExperienceModal";

export const sectionModalMap: {
  [key: string]: { title: string; content: JSX.Element; id: string };
} = {
  profile_photo: {
    title: "Add Profile Photo",
    content: <></>,
    id: "profile-photo-modal",
  },
  about: {
    title: "Add About",
    content: <></>,
    id: "about-modal",
  },
  education: {
    title: "Add Education",
    content: <></>,
    id: "education-modal",
  },
  experience: {
    title: "Add Experience",
    content: <AddExperienceModal />,
    id: "experience-modal",
  },
  services: {
    title: "Add Services",
    content: <></>,
    id: "services-modal",
  },
  career_break: {
    title: "Add Career Break",
    content: <></>,
    id: "career-break-modal",
  },
  skills: {
    title: "Add Skills",
    content: <></>,
    id: "skills-modal",
  },
};
