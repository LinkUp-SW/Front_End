import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { IoIosBriefcase } from "react-icons/io";
import { Experience } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import AddExperienceModal from "./modals/experience_modal/AddExperienceModal";
import Header from "./modals/components/Header";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { getUserExperience } from "@/endpoints/userProfile";
import { formatExperienceDate } from "@/utils";

interface FetchDataResult {
  work_experience: Experience[];
  is_me: boolean;
}

const ExperienceSection: React.FC = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const { data, loading, error } = useFetchData<FetchDataResult | null>(
    () => {
      if (authToken && id) {
        return getUserExperience(authToken, id);
      }
      return Promise.resolve(null);
    },
    [authToken, id] // re-fetch if these change
  );

  useEffect(() => {
    if (data?.work_experience) {
      setExperiences(data.work_experience);
    }
  }, [data]);

  if (loading) {
    return (
      <section
        id="experience-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500"
      >
        <SkeletonLoader />
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="experience-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
      >
        <p className="text-red-500">
          Failed to load experiences. Please try again later.
        </p>
      </section>
    );
  }

  const isMe = data?.is_me ?? false;
  const isEmpty = experiences.length === 0;

  // Handler for adding a new experience (called by AddExperienceModal via props)
  const handleAddExperience = (newExperience: Experience) => {
    setExperiences((prev) => [...prev, newExperience]);
  };

  return (
    <section
      id="experience-section"
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <HeaderSection
        isMe={isMe}
        isEmpty={isEmpty}
        onAddExperience={handleAddExperience}
      />

      {isEmpty ? (
        isMe ? (
          <EmptyExperience onAddExperience={handleAddExperience} />
        ) : (
          <EmptyExperienceReadOnly />
        )
      ) : (
        <ExperienceList experiences={experiences} isMe={isMe} />
      )}
    </section>
  );
};

/* ------------------------------------------------------------------
   Header Section
------------------------------------------------------------------ */
interface HeaderSectionProps {
  isEmpty: boolean;
  isMe: boolean;
  onAddExperience: (exp: Experience) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  isEmpty,
  isMe,
  onAddExperience,
}) => (
  <header
    id="experience-section-header"
    className={`flex justify-between items-center mb-4 ${
      isEmpty ? "opacity-65" : ""
    }`}
  >
    <div id="experience-section-title-container">
      <h2
        id="experience-section-title"
        className="text-xl text-black dark:text-white font-bold"
      >
        Experiences
      </h2>
      {isEmpty&&isMe && (
        <p id="experience-section-description" className="text-sm">
          Showcase your accomplishments and get up to 2X as many profile views
          and connections
        </p>
      )}
    </div>
    {/* Show the "+ Add Experience" button only if user is the owner and the list is not empty */}
    {!isEmpty && isMe && <ActionButtons onAddExperience={onAddExperience} />}
  </header>
);

/* ------------------------------------------------------------------
   ActionButtons (only for isMe === true)
------------------------------------------------------------------ */
interface ActionButtonsProps {
  onAddExperience: (exp: Experience) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddExperience }) => {
  const [open, setOpen] = useState(false);

  return (
    <div id="experience-section-action-buttons" className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="experience-add-button"
            aria-label="Add Experience"
            className="hover:bg-gray-300 dark:hover:text-black rounded-full transition-all duration-200 ease-in-out"
          >
            <GoPlus size={30} />
          </button>
        </DialogTrigger>
        <DialogContent
          id="experience-add-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogHeader id="experience-add-dialog-header">
            <DialogTitle id="experience-add-dialog-title">
              <Header title="Add Experience" />
            </DialogTitle>
            <DialogDescription
              id="experience-add-dialog-description"
              className="text-sm text-gray-500 dark:text-gray-300"
            >
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <AddExperienceModal
            onClose={() => setOpen(false)}
            onSuccess={(newExp) => {
              onAddExperience(newExp);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ------------------------------------------------------------------
   ExperienceList (displays existing experiences)
   We hide the "edit" button if isMe === false
------------------------------------------------------------------ */
interface ExperienceListProps {
  experiences: Experience[];
  isMe: boolean;
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences, isMe }) => (
  <div id="experience-list-container" className="space-y-4">
    {experiences.slice(0, 3).map((experience, idx) => (
      <div
        id={`experience-item-${experience._id}`}
        key={experience._id}
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
        <p
          id={`experience-employee-type-${experience._id}`}
          className="text-sm text-gray-500 dark:text-gray-200"
        >
          {experience.employee_type}
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

        {experience.skills.length > 0 && (
          <div className="text-xs font-semibold flex items-center gap-2">
            <h2 className="font-bold text-sm">Skills:</h2>
            {experience.skills.join(", ")}
          </div>
        )}

        {experience.media.length > 0 && (
          <div>
            {experience.media.map((med) => (
              <div
                key={med.media}
                className="text-xs font-semibold flex items-start gap-2 mt-2"
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

        {/* Show edit button only if isMe === true */}
        {isMe && (
          <button
            id={`experience-edit-button-${idx}`}
            aria-label="Edit Experience"
            className="hover:bg-gray-300 absolute top-0 right-0 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
          >
            <BsPencil size={20} />
          </button>
        )}
      </div>
    ))}

    {experiences.length > 3 && (
      <Link
        to="#"
        className="block w-full text-center text-blue-700 hover:underline transition-all duration-300 ease-in-out dark:text-blue-400 font-semibold"
      >
        Show More
      </Link>
    )}
  </div>
);

/* ------------------------------------------------------------------
   EmptyExperience (for isMe === true)
   The user can add a new experience from here
------------------------------------------------------------------ */
interface EmptyExperienceProps {
  onAddExperience: (exp: Experience) => void;
}

const EmptyExperience: React.FC<EmptyExperienceProps> = ({ onAddExperience }) => {
  const [open, setOpen] = useState(false);

  return (
    <div id="empty-experience-container" className="grid gap-2">
      <div id="empty-experience-info" className="opacity-65 flex gap-2 items-center">
        <div id="empty-experience-icon" className="p-3 rounded-xl border-2">
          <IoIosBriefcase size={25} />
        </div>
        <div id="empty-experience-details" className="flex flex-col justify-center">
          <h2 id="empty-experience-job-title" className="font-semibold">
            Job Title
          </h2>
          <p id="empty-experience-organization" className="text-sm">
            Organization
          </p>
          <p id="empty-experience-duration" className="text-sm">
            2023 - present
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="empty-experience-add-button"
            className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer"
          >
            Add Experience
          </button>
        </DialogTrigger>
        <DialogContent
          id="empty-experience-dialog-content"
          className="max-h-[45rem] dark:bg-gray-900 overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogHeader id="empty-experience-dialog-header">
            <DialogTitle id="empty-experience-dialog-title">
              <Header title="Add Experience" />
            </DialogTitle>
            <DialogDescription
              id="empty-experience-dialog-description"
              className="text-sm text-gray-500 dark:text-gray-300"
            >
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <AddExperienceModal
            onClose={() => setOpen(false)}
            onSuccess={(newExp) => {
              onAddExperience(newExp);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ------------------------------------------------------------------
   EmptyExperienceReadOnly (for isMe === false && isEmpty)
   The user cannot add or edit; just a read-only placeholder
------------------------------------------------------------------ */
const EmptyExperienceReadOnly: React.FC = () => {
  return (
    <div id="empty-experience-readonly-container" className="grid gap-2">
      <div className="opacity-65 flex gap-2 items-center">
        <div className="p-3 rounded-xl border-2">
          <IoIosBriefcase size={25} />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="font-semibold">No Experience</h2>
          <p className="text-sm">This user has not added any experience yet.</p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   Skeleton Loader
------------------------------------------------------------------ */
const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default ExperienceSection;
