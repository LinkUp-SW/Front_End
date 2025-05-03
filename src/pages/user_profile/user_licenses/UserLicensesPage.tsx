import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LinkUpFooter,
  WhosHiringImage,
  WithNavBar,
} from "@/components";
import { License } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";
import { getUserLicenses, removeLicense } from "@/endpoints/userProfile";
import useFetchData from "@/hooks/useFetchData";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import LicenseHeaderSection from "../components/licenses/LicenseHeaderSection";
import { LiaCertificateSolid } from "react-icons/lia";
import Header from "../components/modals/components/Header";
import AddLicenseModal from "../components/modals/license_modal/AddLicenseModal";
import { MdDeleteForever } from "react-icons/md";
import EditLicenseModal from "../components/modals/license_modal/EditLicenseModal";
import LicensesList from "../components/licenses/LicensesList";
import LicensesSkeletonLoader from "../components/licenses/LicensesSkeletonLoader";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setLicenses as setGlobalLicense,
  addLicense as addGlobalLicense,
  updateLicense as updateGlobalLicense,
  removeLicense as removeGlobalLicense,
} from "@/slices/license/licensesSlice";
import { removeOrganizationFromSkills as removeLicenseFromSkills } from "@/slices/skills/skillsSlice";

interface FetchDataResult {
  licenses: License[];
  is_me: boolean;
}

const UserLicensesPage = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [licenseToEdit, setLicenseToEdit] = useState<License | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(
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
  const isMe = data?.is_me ?? false;
  const isEmpty = licenses.length === 0;

  useEffect(() => {
    if (data?.licenses) {
      dispatch(setGlobalLicense(data.licenses));
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    if (authToken && selectedLicenseId) {
      try {
        const response = await removeLicense(authToken, selectedLicenseId);
        dispatch(removeGlobalLicense(selectedLicenseId));
        dispatch(removeLicenseFromSkills({ orgId: selectedLicenseId }));

        toast.success(response.message);
      } catch (error) {
        console.error("Failed to delete license", error);
        toast.error(getErrorMessage(error));
      } finally {
        setDeleteDialogOpen(false);
        setSelectedLicenseId(null);
      }
    }
  };

  if (error) {
    return (
      <section
        id="license-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
      >
        <p className="text-red-500">
          Failed to load licenses. Please try again later.
        </p>
      </section>
    );
  }

  // Handler for adding a new license
  const handleAddLicense = (newLicense: License) => {
    dispatch(addGlobalLicense(newLicense));
  };

  // Handler for updating an existing Licsense
  const handleEditLicense = (updatedEdu: License) => {
    dispatch(updateGlobalLicense(updatedEdu));

    setEditOpen(false);
    setLicenseToEdit(null);
  };

  return (
    <main className="max-w-7xl mx-auto lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <section
            id="license-section"
            className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
              isEmpty
                ? "outline-dotted dark:outline-blue-300 outline-blue-500"
                : ""
            }`}
          >
            <LicenseHeaderSection
              isMe={isMe}
              isEmpty={isEmpty}
              onAddLicense={handleAddLicense}
            />
            {loading ? (
              <LicensesSkeletonLoader />
            ) : (
              <>
                {isEmpty ? (
                  isMe ? (
                    <EmptyLicense onAddLicense={handleAddLicense} />
                  ) : (
                    <p className="text-sm font-semibold dark:text-gray-300 text-gray-600">
                      This user has no Licenses yet :{"("}
                    </p>
                  )
                ) : (
                  <div id="license-list-container" className="space-y-4">
                    {licenses.map((lic, idx) => (
                      <Fragment key={idx}>
                        <LicensesList
                          isMe={isMe}
                          onStartEdit={(edu) => {
                            setLicenseToEdit(edu);
                            setEditOpen(true);
                          }}
                          onDeleteClick={(id) => {
                            setSelectedLicenseId(id);
                            setDeleteDialogOpen(true);
                          }}
                          license={lic}
                          idx={idx}
                        />
                      </Fragment>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <WhosHiringImage />
          <LinkUpFooter />
        </div>
      </div>

      {/* Edit modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby={undefined}
          id="edit-license-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader>
            <Header title="Edit License" />
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
    </main>
  );
};

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

export default WithNavBar(UserLicensesPage);
