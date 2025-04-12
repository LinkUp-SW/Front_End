import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { Skill } from "@/types";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import Header from "../modals/components/Header";
import AddSkillModal from "../modals/skill_modal/AddSkillModal";

interface SkillsActionButtonsProps {
  onAddSkill: (skill: Skill) => void;
}
const SkillsActionButtons: React.FC<SkillsActionButtonsProps> = ({
  onAddSkill,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div id="skill-section-action-buttons" className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="skill-add-button"
            aria-label="Add skill"
            className="hover:bg-gray-300 dark:hover:text-black rounded-full transition-all duration-200 ease-in-out"
          >
            <GoPlus size={30} />
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          id="skill-add-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="skill-add-dialog-header">
            <Header title="Add Skill" />
            <DialogDescription
              id="skill-add-dialog-description"
              className="text-sm text-gray-500 mb-[-1rem] dark:text-gray-300"
            >
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <AddSkillModal
            onClose={() => setOpen(false)}
            onSuccess={(newSkill) => {
              onAddSkill(newSkill);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsActionButtons;
