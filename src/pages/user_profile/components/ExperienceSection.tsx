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

const ExperienceSection: React.FC = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const { data, loading, error } = useFetchData(() => {
    if (authToken && id) {
      return getUserExperience(authToken, id);
    }
    return Promise.resolve(null);
  });

  useEffect(() => {
    if (data && data.work_experience) {
      setExperiences(data.work_experience);
    }
  }, [data]);

  const isEmpty = experiences.length === 0;

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

  return (
    <section
      id="experience-section"
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <HeaderSection isMe={data?.is_me} isEmpty={isEmpty} />
      {isEmpty ? (
        <EmptyExperience />
      ) : (
        <ExperienceList experiences={experiences} />
      )}
    </section>
  );
};

interface HeaderSectionProps {
  isEmpty: boolean;
  isMe?: boolean;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ isEmpty, isMe }) => (
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
      {isEmpty && (
        <p id="experience-section-description" className="text-sm">
          Showcase your accomplishments and get up to 2X as many profile views
          and connections
        </p>
      )}
    </div>
    {!isEmpty && isMe && <ActionButtons />}
  </header>
);

const ActionButtons: React.FC = () => (
  <div
    id="experience-section-action-buttons"
    className="flex items-center gap-2"
  >
    {/* Add Experience Button */}
    <Dialog>
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
        <AddExperienceModal />
      </DialogContent>
    </Dialog>
  </div>
);

interface ExperienceListProps {
  experiences: Experience[];
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => (
  <div id="experience-list-container" className="space-y-4">
    {experiences.map((experience, key) => (
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
          {experience.organization.name}
        </p>
        <p
          id={`experience-employee-type-${experience._id}`}
          className="text-sm text-gray-500 dark:text-gray-200"
        >
          {experience.employee_type}
        </p>
        <button
          id={`experience-edit-button-${key}`}
          aria-label="Edit Experience"
          className="hover:bg-gray-300 absolute top-0 right-0 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
        >
          <BsPencil size={20} />
        </button>
      </div>
    ))}
    {experiences.length > 1 && (
      <Link
        to={"#"}
        className="block w-full text-center text-blue-700 hover:underline transition-all duration-300 ease-in-out dark:text-blue-400 font-semibold"
      >
        Show More
      </Link>
    )}
  </div>
);

const EmptyExperience: React.FC = () => (
  <div id="empty-experience-container" className="grid gap-2">
    <div
      id="empty-experience-info"
      className="opacity-65 flex gap-2 items-center"
    >
      <div id="empty-experience-icon" className="p-3 rounded-xl border-2">
        <IoIosBriefcase size={25} />
      </div>
      <div
        id="empty-experience-details"
        className="flex flex-col justify-center"
      >
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
    <Dialog>
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
        <AddExperienceModal />
      </DialogContent>
    </Dialog>
  </div>
);

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default ExperienceSection;
