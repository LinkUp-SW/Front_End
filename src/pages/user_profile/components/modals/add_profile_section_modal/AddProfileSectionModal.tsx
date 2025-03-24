// AddProfileSectionModal.tsx
import React, { Fragment } from "react";
import { Accordion, AccordionItem } from "../../../../../components";
import { CORE_PROFILE_SECTIONS } from "../../../../../constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import Header from "../components/Header";
import { sectionModalMap } from "../SectionModals";

const AddProfileSectionModal: React.FC = () => {
  return (
    <div className="max-w-5xl md:w-[30rem] w-full">
      <Accordion>
        <AccordionItem title="Core" defaultOpen>
          <p className="text-xs">
            Completing these sections will increase your credibility and give
            you access to more opportunities
          </p>
          <div className="flex flex-col items-start gap-4 pt-3 ">
            {CORE_PROFILE_SECTIONS.map((section, i) => (
              <Fragment key={section.id}>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="cursor-pointer text-gray-700 font-semibold dark:text-gray-300">
                      {section.title}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="!max-w-5xl gap-0 md:!w-[38.5rem] overflow-y-auto overflow-x-hidden rounded-lg p-6 max-h-[45rem] !w-full">
                    <DialogHeader>
                      <DialogTitle>
                        <Header title={sectionModalMap[section.key].title} />
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
                        {/* Optional description here */}
                      </DialogDescription>
                    </DialogHeader>
                    {sectionModalMap[section.key].content}
                  </DialogContent>
                </Dialog>
                {i !== CORE_PROFILE_SECTIONS.length - 1 && (
                  <div className="w-full h-[0.05rem] bg-black dark:bg-gray-300" />
                )}
              </Fragment>
            ))}
          </div>
        </AccordionItem>
        <AccordionItem title="Recommended">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
          excepturi est asperiores eligendi accusamus unde nam corporis error
          necessitatibus ad!
        </AccordionItem>
        <AccordionItem title="Additional">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint fugit
          tempora commodi totam rerum saepe hic, nam esse aliquid odit.
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddProfileSectionModal;
