import { JSX } from "react";
import AddExperienceModal from "./experience_modal/AddExperienceModal";

export const sectionModalMap: {
  [key: string]: { title: string; content: JSX.Element };
} = {
  profile_photo: {
    title: "Add Profile Photo",
    content: <></>,
  },
  about: {
    title: "Add About",
    content: <></>,
  },
  education: {
    title: "Add Education",
    content: <></>,
  },
  experience: {
    title: "Add Experience",
    content: <AddExperienceModal />,
  },
  services: {
    title: "Add Services",
    content: <></>,
  },
  career_break: {
    title: "Add Career Break",
    content: <></>,
  },
  skills: {
    title: "Add Skills",
    content: <></>,
  },
};
