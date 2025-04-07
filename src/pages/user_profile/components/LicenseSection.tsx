import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { License } from "@/types"; // Ensure your Education type is defined here
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import Header from "./modals/components/Header";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { getUserLicenses, removeLicense } from "@/endpoints/userProfile";
import { formatExperienceDate } from "@/utils";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import AddLicenseModal from "./modals/license_modal/AddLicenseModal";
import EditLicenseModal from "./modals/license_modal/EditLicenseModal";
import { LiaCertificateSolid } from "react-icons/lia";

interface FetchDataResult {
  licenses: License[];
  is_me: boolean;
}

const LicenseSection: React.FC = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [licenseToEdit, setLicenseToEdit] = useState<License | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(
    null
  );

  const { data, loading, error } = useFetchData<FetchDataResult | null>(() => {
    if (authToken && id) {
      return getUserLicenses(authToken, id);
    }
    return Promise.resolve(null);
  }, [authToken, id]);

  useEffect(() => {
    console.log("License", data);
    // console.log(data?.education);
    if (data?.licenses) {
      setLicenses(data.licenses);
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    if (authToken && selectedEducationId) {
      try {
        const response = await removeLicense(authToken, selectedEducationId);
        setLicenses((prev) =>
          prev.filter((edu) => edu._id !== selectedEducationId)
        );
        toast.success(response.message);
      } catch (error) {
        console.error("Failed to delete education", error);
        toast.error(getErrorMessage(error));
      } finally {
        setDeleteDialogOpen(false);
        setSelectedEducationId(null);
      }
    }
  };

  if (loading) {
    return (
      <section
        id="license-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500"
      >
        <SkeletonLoader />
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="license-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
      >
        <p className="text-red-500">
          Failed to load educations. Please try again later.
        </p>
      </section>
    );
  }

  const isMe = data?.is_me ?? false;
  const isEmpty = licenses.length === 0;

  // Handler for adding a new education
  const handleAddLicense = (newLicense: License) => {
    setLicenses((prev) => [...prev, newLicense]);
  };

  // Handler for updating an existing Licsense
  const handleEditLicense = (updatedEdu: License) => {
    setLicenses((prev) =>
      prev.map((edu) => (edu._id === updatedEdu._id ? updatedEdu : edu))
    );
    setEditOpen(false);
    setLicenseToEdit(null);
  };

  if (!isMe && isEmpty) return null;

  return (
    <section
      id="education-section"
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <HeaderSection
        isMe={isMe}
        isEmpty={isEmpty}
        onAddLicense={handleAddLicense}
      />

      {isEmpty ? (
        isMe ? (
          <EmptyLicense onAddLicense={handleAddLicense} />
        ) : null
      ) : (
        <LicenseList
          licenses={licenses}
          isMe={isMe}
          onStartEdit={(edu) => {
            setLicenseToEdit(edu);
            setEditOpen(true);
          }}
          onDeleteClick={(id) => {
            setSelectedEducationId(id);
            setDeleteDialogOpen(true);
          }}
        />
      )}

      {/* Edit modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby={undefined}
          id="edit-education-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader>
            <Header title="Edit Education" />
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
              *Indicates required
            </DialogDescription>
          </DialogHeader>
          {licenseToEdit && (
            <EditLicenseModal
              license={licenseToEdit}
              onClose={() => {
                setEditOpen(false);
                setLicenseToEdit(null);
              }}
              onSuccess={handleEditLicense}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-[425px] dark:bg-gray-900"
        >
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <MdDeleteForever className="text-pink-500" />
              Delete License?
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 dark:text-gray-300">
              This action cannot be undone. Are you sure you want to permanently
              delete this license from your profile?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 hover:bg-gray-100 dark:text-black dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700 transition-all duration-300 ease-in-out"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="destructiveBtn"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

/* Header Section */
interface HeaderSectionProps {
  isEmpty: boolean;
  isMe: boolean;
  onAddLicense: (lic: License) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  isEmpty,
  isMe,
  onAddLicense,
}) => (
  <header
    id="license-section-header"
    className={`flex justify-between items-center mb-4 ${
      isEmpty ? "opacity-65" : ""
    }`}
  >
    <div id="license-section-title-container">
      <h2
        id="license-section-title"
        className="text-xl text-black dark:text-white font-bold"
      >
        License
      </h2>
      {isEmpty && isMe && (
        <p id="license-section-description" className="text-sm">
          Add your license details to showcase your academic background.
        </p>
      )}
    </div>
    {!isEmpty && isMe && <ActionButtons onAddLicense={onAddLicense} />}
  </header>
);

interface ActionButtonsProps {
  onAddLicense: (lic: License) => void;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddLicense }) => {
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

/* Education List */
interface LicenseListProps {
  licenses: License[];
  isMe: boolean;
  onStartEdit: (lic: License) => void;
  onDeleteClick: (licenseId: string) => void;
}

const LicenseList: React.FC<LicenseListProps> = ({
  licenses,
  isMe,
  onStartEdit,
  onDeleteClick,
}) => (
  <div id="license-list-container" className="space-y-4">
    {licenses.slice(0, 3).map((lic, idx) => (
      <div
        id={`license-item-${lic._id}`}
        key={idx}
        className="border-l-2 border-blue-600 pl-4 relative"
      >
        <h3 id={`license-name-${lic._id}`} className="font-bold">
          {lic.name}
        </h3>
        <p
          id={`license-organization-${lic._id}`}
          className="text-gray-600 dark:text-gray-300"
        >
          {lic.issuing_organization?.name}
        </p>
        <p
          id={`license-credential-url-${lic._id}`}
          className="text-sm text-gray-500 dark:text-gray-200"
        >
          {lic.credintial_url}
        </p>
        <p className="text-xs capitalize inline-flex gap-2 text-gray-500 dark:text-gray-200">
          <span>{formatExperienceDate(lic.issue_date)}</span>
          <span>-</span>
          <span>{formatExperienceDate(lic.expiration_date)}</span>
        </p>
        {lic.skills.length > 0 && (
          <div className="text-xs font-semibold flex items-center gap-2">
            <h2 className="font-bold text-sm">Skills:</h2>
            {lic.skills.join(", ")}
          </div>
        )}
        {lic.media.length > 0 && (
          <div className="mt-2">
            {lic.media.map((med, idx) => (
              <div
                key={`${med.media}-${idx}`}
                className="text-xs font-semibold flex items-start gap-2"
              >
                <img
                  src={med.media}
                  alt="school-logo"
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
        {isMe && (
          <div className="absolute top-[-1rem] h-full right-0 flex gap-2 flex-col justify-between">
            <button
              id={`license-edit-button-${idx}`}
              aria-label="Edit License"
              className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
              onClick={() => onStartEdit(lic)}
            >
              <BsPencil size={20} />
            </button>
            <button
              id={`license-delete-button-${idx}`}
              aria-label="Delete License"
              className="bg-red-100 dark:bg-red-200 dark:text-gray-700 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 ease-in-out"
              onClick={() => onDeleteClick(lic._id as string)}
            >
              <MdDeleteForever size={20} />
            </button>
          </div>
        )}
      </div>
    ))}
    {licenses.length > 3 && (
      <Link
        to="#"
        className="block w-full text-center text-blue-700 hover:underline transition-all duration-300 ease-in-out dark:text-blue-400 font-semibold"
      >
        Show More
      </Link>
    )}
  </div>
);

const EmptyLicense: React.FC<{
  onAddLicense: (lic: License) => void;
}> = ({ onAddLicense }) => {
  const [open, setOpen] = useState(false);
  return (
    <div id="empty-license-container" className="grid gap-2">
      <div
        id="empty-license-info"
        className="opacity-65 flex gap-2 items-center"
      >
        <div id="empty-license-icon" className="p-3 rounded-xl border-2">
          <span role="img" aria-label="license">
            <LiaCertificateSolid size={20} />
          </span>
        </div>
        <div
          id="empty-license-details"
          className="flex flex-col justify-center"
        >
          <h2 id="empty-license-name" className="font-semibold">
            License Name
          </h2>
          <p id="empty-license-organization" className="text-sm">
            Issuing Organization Name
          </p>
          <p id="empty-license-duration" className="text-sm">
            2018 - 2022
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="license-add-button"
            className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer"
          >
            Add License
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          id="empty-license-dialog-content"
          className="max-h-[45rem] dark:bg-gray-900 overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="empty-license-dialog-header">
            <Header title="Add License" />
            <DialogDescription
              id="empty-license-dialog-description"
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

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default LicenseSection;
