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

const ExperienceSection: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const isEmpty = experiences.length === 0;

  useEffect(() => {
    setExperiences([]);
  }, []);

  const EmptyExperience = () => (
    <div className="grid gap-2">
      <div className="opacity-65 flex gap-2 items-center">
        <div className="p-3 rounded-xl border-2">
          <IoIosBriefcase size={25} />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="font-semibold">Job Title</h2>
          <p className="text-sm">Organization</p>
          <p className="text-sm">2023 - present</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer">
            Add Experience
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[45rem] overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full">
          <DialogHeader>
            <DialogTitle>
              <Header title="Add Experience" />
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <AddExperienceModal />
        </DialogContent>
      </Dialog>
    </div>
  );

  const ExperienceList = () => (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <div key={experience._id} className="border-l-2 border-blue-600 pl-4">
          <h3 className="font-bold">{experience.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {experience.company}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-200">
            {experience.employee_type}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <header
        className={`flex justify-between items-center mb-4 ${
          isEmpty ? "opacity-65" : ""
        }`}
      >
        <div>
          <h2 className="text-xl text-black dark:text-white font-bold">
            Experiences
          </h2>
          {isEmpty && (
            <p className="text-sm">
              Showcase your accomplishments and get up to 2X as many profile
              views and connections
            </p>
          )}
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-2">
            {/* Add Experience Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  aria-label="Add Experience"
                  className="hover:bg-gray-300 dark:hover:text-black rounded-full transition-all duration-200 ease-in-out"
                >
                  <GoPlus size={30} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[45rem] overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full">
                <DialogHeader>
                  <DialogTitle>
                    <Header title="Add Experience" />
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
                    *Indicates required
                  </DialogDescription>
                </DialogHeader>
                <AddExperienceModal />
              </DialogContent>
            </Dialog>
            {/* Edit Experience Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  aria-label="Edit Experience"
                  className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
                >
                  <BsPencil size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[45rem] overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full">
                <DialogHeader>
                  <DialogTitle>
                    <Header title="Edit Experience" />
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
                    *Indicates required
                  </DialogDescription>
                </DialogHeader>
                {/* Reuse the same modal content for editing or swap with an EditExperienceModal */}
                <AddExperienceModal />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </header>
      {isEmpty ? <EmptyExperience /> : <ExperienceList />}
    </section>
  );
};

export default ExperienceSection;
