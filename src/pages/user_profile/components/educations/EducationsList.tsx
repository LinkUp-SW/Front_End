import { Education } from "@/types";
import { formatExperienceDate } from "@/utils";
import React from "react";
import { BsPencil } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

interface EducationListProps {
  idx: number;
  education: Education;
  onStartEdit: (edu: Education) => void;
  onDeleteClick: (educationId: string) => void;
  isMe: boolean;
}

const EducationsList: React.FC<EducationListProps> = ({
  isMe,
  education,
  idx,
  onStartEdit,
  onDeleteClick,
}) => {
  return (
    <div
      id={`education-item-${education._id}`}
      className="border-l-2 border-blue-600 pl-4 relative"
    >
      <h3 id={`education-degree-${education._id}`} className="font-bold">
        {education.degree}
      </h3>
      <p
        id={`education-school-${education._id}`}
        className="text-gray-600 dark:text-gray-300"
      >
        {education.school?.name}
      </p>
      <p
        id={`education-field-${education._id}`}
        className="text-sm text-gray-500 dark:text-gray-200"
      >
        {education.field_of_study}
      </p>
      <p className="text-xs capitalize inline-flex gap-2 text-gray-500 dark:text-gray-200">
        <span>{education.start_date&&formatExperienceDate(education.start_date)}</span>
        <span>-</span>
        <span>{education.end_date&&formatExperienceDate(education.end_date)}</span>
      </p>
      {education.skills.length > 0 && (
        <div className="text-xs font-semibold flex items-center gap-2">
          <h2 className="font-bold text-sm">Skills:</h2>
          {education.skills.join(", ")}
        </div>
      )}
      {education.media.length > 0 && (
        <div className="mt-2">
          {education.media.map((med, idx) => (
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
            id={`education-edit-button-${idx}`}
            aria-label="Edit Education"
            className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
            onClick={() => onStartEdit(education)}
          >
            <BsPencil size={20} />
          </button>
          <button
            id={`education-delete-button-${idx}`}
            aria-label="Delete Education"
            className="bg-red-100 dark:bg-red-200 dark:text-gray-700 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 ease-in-out"
            onClick={() => onDeleteClick(education._id as string)}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EducationsList;
