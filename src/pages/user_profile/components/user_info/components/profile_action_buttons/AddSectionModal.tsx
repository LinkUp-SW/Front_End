import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components";
import CustomButton from "./CustomButton";
import AddProfileSectionModal from "../../../modals/add_profile_section_modal/AddProfileSectionModal";

const AddSectionModal: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <CustomButton id="add-profile-section-button" variant="secondary">
        Add profile section
      </CustomButton>
    </DialogTrigger>
    <DialogContent
      aria-describedby={undefined}
      className="!max-w-5xl gap-0 md:!w-[33rem] overflow-y-auto rounded-lg dark:bg-gray-900 p-6 max-h-[45rem]"
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Add To Profile</DialogTitle>
      </DialogHeader>
      <AddProfileSectionModal />
    </DialogContent>
  </Dialog>
);

export default AddSectionModal;
