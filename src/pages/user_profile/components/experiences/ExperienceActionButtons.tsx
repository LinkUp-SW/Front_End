import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { Experience } from "@/types";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import Header from "../modals/components/Header";
import AddExperienceModal from "../modals/experience_modal/AddExperienceModal";

interface ExperienceActionButtonsProps {
  onAddExperience: (exp: Experience) => void;
}

const ExperienceActionButtons: React.FC<ExperienceActionButtonsProps> = ({
  onAddExperience,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      id="experience-section-action-buttons"
      className="flex items-center gap-2"
    >
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
          aria-describedby={undefined}
          id="experience-add-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="experience-add-dialog-header">
            <Header title="Add Experience" />
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

export default ExperienceActionButtons;
