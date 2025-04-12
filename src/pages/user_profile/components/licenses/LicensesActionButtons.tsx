import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { License } from "@/types";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import Header from "../modals/components/Header";
import AddLicenseModal from "../modals/license_modal/AddLicenseModal";

interface LicensesActionButtonsProps {
  onAddLicense: (lic: License) => void;
}

const LicensesActionButtons: React.FC<LicensesActionButtonsProps> = ({
  onAddLicense,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      id="license-section-action-buttons"
      className="flex items-center gap-2"
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="license-add-button"
            aria-label="Add License"
            className="hover:bg-gray-300 dark:hover:text-black rounded-full transition-all duration-200 ease-in-out"
          >
            <GoPlus size={30} />
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          id="license-add-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="license-add-dialog-header">
            <Header title="Add License" />
            <DialogDescription
              id="license-add-dialog-description"
              className="text-sm text-gray-500 dark:text-gray-300"
            >
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          <AddLicenseModal
            onClose={() => setOpen(false)}
            onSuccess={(newLic) => {
              onAddLicense(newLic);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LicensesActionButtons;
