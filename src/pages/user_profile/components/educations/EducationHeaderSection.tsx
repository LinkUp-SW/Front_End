import React from "react";
import EducationActionButtons from "./EducationActionButtons";
import { Education } from "@/types";

interface EducationHeaderSectionProps {
  isEmpty: boolean;
  isMe: boolean;
  onAddEducation: (edu: Education) => void;
}

const EducationHeaderSection: React.FC<EducationHeaderSectionProps> = ({
  isEmpty,
  isMe,
  onAddEducation,
}) => (
  <header
    id="education-section-header"
    className={`flex justify-between items-center mb-4 ${
      isEmpty ? "opacity-65" : ""
    }`}
  >
    <div id="education-section-title-container">
      <h2
        id="education-section-title"
        className="text-xl text-black dark:text-white font-bold"
      >
        Education
      </h2>
      {isEmpty && isMe && (
        <p id="education-section-description" className="text-sm">
          Add your education details to showcase your academic background.
        </p>
      )}
    </div>
    {!isEmpty && isMe && (
      <EducationActionButtons onAddEducation={onAddEducation} />
    )}
  </header>
);

export default EducationHeaderSection;
