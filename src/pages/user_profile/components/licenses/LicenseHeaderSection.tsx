import React from "react";
import LicensesActionButtons from "./LicensesActionButtons";
import { License } from "@/types";

/* Header Section */
interface LicenseHeaderSectionProps {
  isEmpty: boolean;
  isMe: boolean;
  onAddLicense: (lic: License) => void;
}

const LicenseHeaderSection: React.FC<LicenseHeaderSectionProps> = ({
  isEmpty,
  isMe,
  onAddLicense,
}) => (
  <header
    id="license-section-header"
    className={`flex justify-between items-center mb-4 ${
      isEmpty ? "opacity-65" : ""
    }`}
  >
    <div id="license-section-title-container">
      <h2
        id="license-section-title"
        className="text-xl text-black dark:text-white font-bold"
      >
        License
      </h2>
      {isEmpty && isMe && (
        <p id="license-section-description" className="text-sm">
          Add your license details to showcase your academic background.
        </p>
      )}
    </div>
    {!isEmpty && isMe && <LicensesActionButtons onAddLicense={onAddLicense} />}
  </header>
);

export default LicenseHeaderSection;
