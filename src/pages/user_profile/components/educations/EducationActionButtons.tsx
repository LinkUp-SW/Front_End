import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import Header from "../modals/components/Header";
import AddEducationModal from "../modals/education_modal/AddEducationModal";
import { Education } from "@/types";

interface EducationActionButtonsProps {
  onAddEducation: (edu: Education) => void;
}

const EducationActionButtons: React.FC<EducationActionButtonsProps> = ({
  onAddEducation,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      id="education-section-action-buttons"
      className="flex items-center gap-2"
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="education-add-button"
            aria-label="Add Education"
            className="hover:bg-gray-300 dark:hover:text-black rounded-full transition-all duration-200 ease-in-out"
          >
            <GoPlus size={30} />
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          id="education-add-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="education-add-dialog-header">
            <Header title="Add Education" />
            <DialogDescription
              id="education-add-dialog-description"
              className="text-sm text-gray-500 dark:text-gray-300"
            >
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <AddEducationModal
            onClose={() => setOpen(false)}
            onSuccess={(newEdu) => {
              onAddEducation(newEdu);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationActionButtons;
