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
import Header from "../components/modals/components/Header";
import AddEducationModal from "../components/modals/education_modal/AddEducationModal";
import { Education } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";
import { getUserEducation, removeEducation } from "@/endpoints/userProfile";
import { Fragment, useEffect, useState } from "react";
import useFetchData from "@/hooks/useFetchData";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import EducationHeaderSection from "../components/educations/EducationHeaderSection";
import EducationSkeletonLoader from "../components/educations/EducationSkeletonLoader";
import EducationsList from "../components/educations/EducationsList";
import { MdDeleteForever } from "react-icons/md";
import EditEducationModal from "../components/modals/education_modal/EditEducationModal";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setEducations as setGlobalEducations,
  addEducation as addGlobalEducation,
  updateEducation as updateGlobalEducation,
  removeEducation as removeGlobalEducation,
} from "@/slices/education/educationsSlice";
import { removeOrganizationFromSkills as removeEducationFromSkills } from "@/slices/skills/skillsSlice";

interface FetchDataResult {
  education: Education[];
  is_me: boolean;
}

const UserEducationsPage = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [educationToEdit, setEducationToEdit] = useState<Education | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(
    null
  );

  const { data, loading, error } = useFetchData<FetchDataResult | null>(() => {
    if (authToken && id) {
      return getUserEducation(authToken, id);
    }
    return Promise.resolve(null);
  }, [authToken, id]);

  const dispatch = useDispatch<AppDispatch>();
  const educations = useSelector((state: RootState) => state.education.items);

  useEffect(() => {
    if (data?.education) {
      dispatch(setGlobalEducations(data.education));
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    if (authToken && selectedEducationId) {
      try {
        const response = await removeEducation(authToken, selectedEducationId);
        dispatch(removeGlobalEducation(selectedEducationId));
        dispatch(removeEducationFromSkills({ orgId: selectedEducationId }));

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

  if (error) {
    return (
      <section
        id="education-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
      >
        <p className="text-red-500">
          Failed to load educations. Please try again later.
        </p>
      </section>
    );
  }

  const isMe = data?.is_me ?? false;
  const isEmpty = educations.length === 0;

  // Handler for adding a new education
  const handleAddEducation = (newEducation: Education) => {
    dispatch(addGlobalEducation(newEducation));
  };

  // Handler for updating an existing education
  const handleEditEducation = (updatedEdu: Education) => {
    dispatch(updateGlobalEducation(updatedEdu));
    setEditOpen(false);
    setEducationToEdit(null);
  };

  return (
    <main className="max-w-7xl mx-auto lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <section
            id="education-section"
            className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
              isEmpty
                ? "outline-dotted dark:outline-blue-300 outline-blue-500"
                : ""
            }`}
          >
            <EducationHeaderSection
              isMe={isMe}
              isEmpty={isEmpty}
              onAddEducation={handleAddEducation}
            />
            {loading ? (
              <EducationSkeletonLoader />
            ) : (
              <>
                {isEmpty ? (
                  isMe ? (
                    <EmptyEducation onAddEducation={handleAddEducation} />
                  ) : (
                    <EmptyEducationReadOnly />
                  )
                ) : (
                  <div id="education-list-container" className="space-y-4">
                    {educations.map((edu, idx) => (
                      <Fragment key={idx}>
                        <EducationsList
                          isMe={isMe}
                          onStartEdit={(edu) => {
                            setEducationToEdit(edu);
                            setEditOpen(true);
                          }}
                          onDeleteClick={(id) => {
                            setSelectedEducationId(id);
                            setDeleteDialogOpen(true);
                          }}
                          idx={idx}
                          education={edu}
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
          {educationToEdit && (
            <EditEducationModal
              education={educationToEdit}
              onClose={() => {
                setEditOpen(false);
                setEducationToEdit(null);
              }}
              onSuccess={handleEditEducation}
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
              Delete Education?
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 dark:text-gray-300">
              This action cannot be undone. Are you sure you want to permanently
              delete this education from your profile?
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

const EmptyEducation: React.FC<{
  onAddEducation: (edu: Education) => void;
}> = ({ onAddEducation }) => {
  const [open, setOpen] = useState(false);
  return (
    <div id="empty-education-container" className="grid gap-2">
      <div
        id="empty-education-info"
        className="opacity-65 flex gap-2 items-center"
      >
        <div id="empty-education-icon" className="p-3 rounded-xl border-2">
          <span role="img" aria-label="education">
            🎓
          </span>
        </div>
        <div
          id="empty-education-details"
          className="flex flex-col justify-center"
        >
          <h2 id="empty-education-degree" className="font-semibold">
            Degree
          </h2>
          <p id="empty-education-school" className="text-sm">
            School Name
          </p>
          <p id="empty-education-duration" className="text-sm">
            2018 - 2022
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="education-add-button"
            className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer"
          >
            Add Education
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          id="empty-education-dialog-content"
          className="max-h-[45rem] dark:bg-gray-900 overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="empty-education-dialog-header">
            <Header title="Add Education" />
            <DialogDescription
              id="empty-education-dialog-description"
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

const EmptyEducationReadOnly: React.FC = () => (
  <div id="empty-education-readonly-container" className="grid gap-2">
    <div className="opacity-65 flex gap-2 items-center">
      <div className="p-3 rounded-xl border-2">
        <span role="img" aria-label="education">
          🎓
        </span>
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="font-semibold">No Education</h2>
        <p className="text-sm">This user has not added any education yet.</p>
      </div>
    </div>
  </div>
);

export default WithNavBar(UserEducationsPage);
