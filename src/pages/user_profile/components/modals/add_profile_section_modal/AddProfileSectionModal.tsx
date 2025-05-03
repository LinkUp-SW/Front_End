// AddProfileSectionModal.tsx
import React, { Fragment, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@/components";
import {
  CORE_PROFILE_SECTIONS,
  RECOMMENDED_PROFILE_SECTIONS,
} from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components";
import Header from "../components/Header";
import { sectionModalMap } from "../SectionModals";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  addLicense as addGlobalLicense,
  updateLicense as updateGlobalLicense,
} from "@/slices/license/licensesSlice";
import {
  addExperience as addGlobalExperience,
  updateExperience as updateGlobalExperience,
} from "@/slices/experience/experiencesSlice";
import {
  addEducation as addGlobalEducation,
  updateEducation as updateGlobalEducation,
} from "@/slices/education/educationsSlice";
import { addSkill as addGlobalSkill } from "@/slices/skills/skillsSlice";
import { Education, Experience, License, Skill } from "@/types";
// Keys of available sections
type SectionKey = keyof typeof sectionModalMap;

// Base modal props injected into every modal
interface BaseModalProps {
  onClose: () => void;
  onSuccess?: <T>(data: T) => void;
}

const AddProfileSectionModal: React.FC = () => {
  // track which section key is open (or null)
  const dispatch = useDispatch<AppDispatch>();
  const licenses = useSelector((state: RootState) => state.license.items);
  const experiences = useSelector((state: RootState) => state.experience.items);
  const educations = useSelector((state: RootState) => state.education.items);
  const skills = useSelector((state: RootState) => state.skill.items);
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);

  // handle Dialog open/close
  const handleOpenChange = (key: SectionKey, open: boolean) => {
    setOpenSection(open ? key : null);
  };

  // invoked when a section form succeeds
  const handleSuccess = <T,>(key: SectionKey, data: T): void => {
    // e.g. refetch profile, dispatch Redux, etc.
    if (key === "skills") {
      dispatch(addGlobalSkill(data as Skill));
    } else if (key === "experience") {
      dispatch(addGlobalExperience(data as Experience));
    } else if (key === "education") {
      dispatch(addGlobalEducation(data as Education));
    } else if (key === "license") {
      dispatch(addGlobalLicense(data as License));
    } 
  };

  const skillNamesByLicenseId = skills.reduce<Record<string, string[]>>(
    (map, skill) => {
      skill.licenses.forEach((lic) => {
        if (!map[lic._id]) {
          map[lic._id] = [];
        }
        map[lic._id].push(skill.name);
      });
      return map;
    },
    {}
  );
  const skillNamesByEducationId = skills.reduce<Record<string, string[]>>(
    (map, skill) => {
      skill.educations.forEach((edu) => {
        if (!map[edu._id]) {
          map[edu._id] = [];
        }
        map[edu._id].push(skill.name);
      });
      return map;
    },
    {}
  );

  const skillNamesByExperienceId = skills.reduce<Record<string, string[]>>(
    (map, skill) => {
      skill.experiences.forEach((exp) => {
        if (!map[exp._id]) {
          map[exp._id] = [];
        }
        map[exp._id].push(skill.name);
      });
      return map;
    },
    {}
  );

  useEffect(() => {
    licenses.forEach((license) => {
      const skillNames = license._id
        ? skillNamesByLicenseId[license._id] || []
        : [];
      dispatch(
        updateGlobalLicense({
          ...license,
          skills: skillNames,
        })
      );
    });
    experiences.forEach((experience) => {
      const skillNames = experience._id
        ? skillNamesByExperienceId[experience._id] || []
        : [];
      dispatch(
        updateGlobalExperience({
          ...experience,
          skills: skillNames,
        })
      );
    });
    educations.forEach((education) => {
      const skillNames = education._id
        ? skillNamesByEducationId[education._id] || []
        : [];
      dispatch(
        updateGlobalEducation({
          ...education,
          skills: skillNames,
        })
      );
    });
  }, [skills]);

  return (
    <div className="max-w-5xl md:w-[29rem] w-full">
      <Accordion>
        {/* Core Sections */}
        <AccordionItem title="Core" defaultOpen>
          <p className="text-xs">
            Filling out these sections will help you be discovered by recruiters
            and people you may know
          </p>
          <div className="flex flex-col items-start gap-4 pt-3">
            {CORE_PROFILE_SECTIONS.map((section, i) => {
              const entry = sectionModalMap[section.key as SectionKey];
              const isOpen = openSection === section.key;

              // cloneElement with typed BaseModalProps
              const contentWithProps = React.cloneElement<BaseModalProps>(
                entry.content,
                {
                  onClose: () => setOpenSection(null),
                  onSuccess: (data) =>
                    handleSuccess(section.key as SectionKey, data),
                }
              );

              return (
                <Fragment key={section.id}>
                  <Dialog
                    open={isOpen}
                    onOpenChange={(open) =>
                      handleOpenChange(section.key as SectionKey, open)
                    }
                  >
                    <DialogTrigger id={section.id} asChild>
                      <button className="cursor-pointer text-gray-700 font-semibold dark:text-gray-300">
                        {entry.title}
                      </button>
                    </DialogTrigger>

                    <DialogContent
                      id={entry.id}
                      className="!max-w-5xl gap-0 md:!w-[38.5rem] dark:bg-gray-900 border-gray-900 overflow-y-auto overflow-x-hidden rounded-lg p-6 max-h-[45rem] !w-full"
                    >
                      <DialogHeader>
                        <DialogTitle>
                          <Header title={entry.title} />
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
                          {/* Optional description here */}
                        </DialogDescription>
                      </DialogHeader>

                      {contentWithProps}
                    </DialogContent>
                  </Dialog>

                  {i !== CORE_PROFILE_SECTIONS.length - 1 && (
                    <div className="w-full h-[0.05rem] bg-black dark:bg-gray-300" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </AccordionItem>

        {/* Recommended Sections */}
        <AccordionItem title="Recommended">
          <p className="text-xs">
            Completing these sections will increase your credibility and give
            you access to more opportunities
          </p>
          <div className="flex flex-col items-start gap-4 pt-3">
            {RECOMMENDED_PROFILE_SECTIONS.map((section, i) => {
              const entry = sectionModalMap[section.key as SectionKey];
              const isOpen = openSection === section.key;
              const contentWithProps = React.cloneElement<BaseModalProps>(
                entry.content,
                {
                  onClose: () => setOpenSection(null),
                  onSuccess: (data) =>
                    handleSuccess(section.key as SectionKey, data),
                }
              );

              return (
                <Fragment key={section.id}>
                  <Dialog
                    open={isOpen}
                    onOpenChange={(open) =>
                      handleOpenChange(section.key as SectionKey, open)
                    }
                  >
                    <DialogTrigger id={section.id} asChild>
                      <button className="cursor-pointer text-gray-700 font-semibold dark:text-gray-300">
                        {entry.title}
                      </button>
                    </DialogTrigger>

                    <DialogContent
                      id={entry.id}
                      className="!max-w-5xl gap-0 md:!w-[38.5rem] dark:bg-gray-900 border-gray-900 overflow-y-auto overflow-x-hidden rounded-lg p-6 max-h-[45rem] !w-full"
                    >
                      <DialogHeader>
                        <DialogTitle>
                          <Header title={entry.title} />
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
                          {/* Optional description here */}
                        </DialogDescription>
                      </DialogHeader>

                      {contentWithProps}
                    </DialogContent>
                  </Dialog>

                  {i !== RECOMMENDED_PROFILE_SECTIONS.length - 1 && (
                    <div className="w-full h-[0.05rem] bg-black dark:bg-gray-300" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddProfileSectionModal;
