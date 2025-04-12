import { License } from "@/types";
import { formatExperienceDate } from "@/utils";
import React from "react";
import { BsPencil } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

interface LicensesListProps {
  isMe: boolean;
  license: License;
  idx: number;
  onStartEdit: (lic: License) => void;
  onDeleteClick: (licenseId: string) => void;
}
const LicensesList: React.FC<LicensesListProps> = ({
  isMe,
  license,
  idx,
  onStartEdit,
  onDeleteClick,
}) => {
  return (
    <div
      id={`license-item-${license._id}`}
      className="border-l-2 border-blue-600 pl-4 relative"
    >
      <h3 id={`license-name-${license._id}`} className="font-bold">
        {license.name}
      </h3>
      <p
        id={`license-organization-${license._id}`}
        className="text-gray-600 dark:text-gray-300"
      >
        {license.issuing_organization?.name}
      </p>
      <p
        id={`license-credential-url-${license._id}`}
        className="text-sm text-gray-500 dark:text-gray-200"
      >
        {license.credintial_url}
      </p>
      <p className="text-xs capitalize inline-flex gap-2 text-gray-500 dark:text-gray-200">
        <span>{formatExperienceDate(license.issue_date)}</span>
        <span>-</span>
        <span>{formatExperienceDate(license.expiration_date)}</span>
      </p>
      {license.skills.length > 0 && (
        <div className="text-xs font-semibold flex items-center gap-2">
          <h2 className="font-bold text-sm">Skills:</h2>
          {license.skills.join(", ")}
        </div>
      )}
      {license.media.length > 0 && (
        <div className="mt-2">
          {license.media.map((med, idx) => (
            <div
              key={`${med.media}-${idx}`}
              className="text-xs font-semibold flex items-start gap-2"
            >
              <img
                src={med.media}
                alt="school-logo"
                className="h-24 w-24 object-contain rounded-lg"
              />
              <div className="flex flex-col mt-2">
                <h2 className="text-base font-bold">{med.title}</h2>
                <p>{med.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {isMe && (
        <div className="absolute top-[-1rem] h-full right-0 flex gap-2 flex-col justify-between">
          <button
            id={`license-edit-button-${idx}`}
            aria-label="Edit License"
            className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
            onClick={() => onStartEdit(license)}
          >
            <BsPencil size={20} />
          </button>
          <button
            id={`license-delete-button-${idx}`}
            aria-label="Delete License"
            className="bg-red-100 dark:bg-red-200 dark:text-gray-700 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 ease-in-out"
            onClick={() => onDeleteClick(license._id as string)}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LicensesList;
