import { Experience } from "@/types";
import { formatExperienceDate } from "@/utils";
import React from "react";
import { BsPencil } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

interface ExperiencesListProps {
  idx: number;
  experience: Experience;
  onStartEdit: (exp: Experience) => void;
  onDeleteClick: (experienceId: string) => void;
  isMe: boolean;
}

const ExperiencesList: React.FC<ExperiencesListProps> = ({
  isMe,
  experience,
  idx,
  onStartEdit,
  onDeleteClick,
}) => {
  return (
    <div
      id={`experience-item-${experience._id}`}
      className="border-l-2 border-blue-600 pl-4 relative"
    >
      <h3 id={`experience-title-${experience._id}`} className="font-bold">
        {experience.title}
      </h3>
      <p
        id={`experience-company-${experience._id}`}
        className="text-gray-600 dark:text-gray-300"
      >
        {experience.organization?.name}
      </p>
      {!!experience.location && (
        <p className="text-sm">
          <span className="font-semibold">Location: </span>
          <span className="text-gray-700 text-xs dark:text-gray-200">
            {experience.location}
          </span>
        </p>
      )}
      <p
        id={`experience-employee-type-${experience._id}`}
        className="text-sm text-gray-500 dark:text-gray-200"
      >
        {experience.employee_type}
        {!!experience.location_type && (
          <span>, {experience.location_type}</span>
        )}
      </p>
      <p className="text-xs capitalize inline-flex gap-2 text-gray-500 dark:text-gray-200">
        <span>{formatExperienceDate(experience.start_date)}</span>
        <span>-</span>
        <span>
          {experience.is_current
            ? "present"
            : formatExperienceDate(experience.end_date as Date)}
        </span>
      </p>

      {!!experience.description && (
        <p className="text-sm">
          <span className="font-semibold">Description: </span>
          <span className="text-gray-700 dark:text-gray-200">
            {experience.description}
          </span>
        </p>
      )}

      {experience.skills.length > 0 && (
        <div className="text-xs font-semibold flex items-center gap-2">
          <h2 className="font-bold text-sm">Skills:</h2>
          {experience.skills.join(", ")}
        </div>
      )}

      {experience.media.length > 0 && (
        <div className="mt-2">
          {experience.media.map((med, idx) => (
            <div
              key={`${med.media}-${idx}`}
              className="text-xs font-semibold flex items-start gap-2"
            >
              <img
                src={med.media}
                alt="org-logo"
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
        <div className="absolute top-[-1rem] h-full right-0 flex gap-2 flex-col">
          <button
            id={`experience-edit-button-${idx}`}
            aria-label="Edit Experience"
            className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
            onClick={() => onStartEdit(experience)}
          >
            <BsPencil size={20} />
          </button>
          <button
            id={`experience-delete-button-${idx}`}
            aria-label="Delete Experience"
            className="bg-red-100 dark:bg-red-200 dark:text-gray-700 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 ease-in-out"
            onClick={() => onDeleteClick(experience._id as string)}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperiencesList;
