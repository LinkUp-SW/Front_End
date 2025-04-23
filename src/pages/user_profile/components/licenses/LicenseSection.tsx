import React, { Fragment, useEffect, useState } from "react";
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
import Header from "../modals/components/Header";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { getUserLicenses, removeLicense } from "@/endpoints/userProfile";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import AddLicenseModal from "../modals/license_modal/AddLicenseModal";
import EditLicenseModal from "../modals/license_modal/EditLicenseModal";
import { LiaCertificateSolid } from "react-icons/lia";
import LicensesList from "./LicensesList";
import LicensesSkeletonLoader from "./LicensesSkeletonLoader";
import LicenseHeaderSection from "./LicenseHeaderSection";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setLicenses as setGlobalLicense,
  addLicense as addGlobalLicense,
  updateLicense as updateGlobalLicense,
  removeLicense as removeGlobalLicense,
} from "@/slices/license/licensesSlice";
interface FetchDataResult {
  licenses: License[];
  is_me: boolean;
}

const LicenseSection: React.FC = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
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
  const dispatch = useDispatch<AppDispatch>();
  const licenses = useSelector((state: RootState) => state.license.items);

  useEffect(() => {
    if (data?.licenses) {
      dispatch(setGlobalLicense(data.licenses));
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    if (authToken && selectedEducationId) {
      try {
        const response = await removeLicense(authToken, selectedEducationId);
        dispatch(removeGlobalLicense(selectedEducationId));
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
        <LicensesSkeletonLoader />
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
    dispatch(addGlobalLicense(newLicense));
  };

  // Handler for updating an existing Licsense
  const handleEditLicense = (updatedEdu: License) => {
    dispatch(updateGlobalLicense(updatedEdu));
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
      <LicenseHeaderSection
        isMe={isMe}
        isEmpty={isEmpty}
        onAddLicense={handleAddLicense}
      />

      {isEmpty ? (
        isMe ? (
          <EmptyLicense onAddLicense={handleAddLicense} />
        ) : null
      ) : (
        <LicenseListContainer
          licenses={licenses}
          userId={id as string}
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

/* Education List */
interface LicenseListContainerProps {
  licenses: License[];
  isMe: boolean;
  onStartEdit: (lic: License) => void;
  onDeleteClick: (licenseId: string) => void;
  userId: string;
}

const LicenseListContainer: React.FC<LicenseListContainerProps> = ({
  licenses,
  isMe,
  onStartEdit,
  onDeleteClick,
  userId,
}) => (
  <div id="license-list-container" className="space-y-4">
    {licenses.slice(0, 3).map((lic, idx) => (
      <Fragment key={idx}>
        <LicensesList
          isMe={isMe}
          onStartEdit={onStartEdit}
          onDeleteClick={onDeleteClick}
          license={lic}
          idx={idx}
        />
      </Fragment>
    ))}
    {licenses.length > 3 && (
      <Link
        to={`/user-profile/licenses/${userId}`}
        id="show-more-licenses-link"
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

export default LicenseSection;
