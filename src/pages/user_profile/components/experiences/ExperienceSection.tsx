import React, { Fragment, useEffect, useState } from "react";
import { IoIosBriefcase } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { Experience } from "@/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import AddExperienceModal from "../modals/experience_modal/AddExperienceModal";
import EditExperienceModal from "../modals/experience_modal/EditExperienceModal"; // <--- NEW
import Header from "../modals/components/Header";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import {
  getUserExperience,
  removeWorkExperience,
} from "@/endpoints/userProfile";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import ExperiencesList from "./ExperiencesList";
import ExperienceSkeletonLoader from "./ExperienceSkeletonLoader";
import ExperienceHeaderSection from "./ExperienceHeaderSection";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setExperiences as setGlobalExperiences,
  addExperience as addGlobalExperience,
  updateExperience as updateGlobalExperience,
  removeExperience as removeGlobalExperience,
} from "@/slices/experience/experiencesSlice";
import { removeOrganizationFromSkills as removeExperienceFromSkills } from "@/slices/skills/skillsSlice";

interface FetchDataResult {
  work_experience: Experience[];
  is_me: boolean;
}

const ExperienceSection: React.FC = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null);

  const { data, loading, error } = useFetchData<FetchDataResult | null>(() => {
    if (authToken && id) {
      return getUserExperience(authToken, id);
    }
    return Promise.resolve(null);
  }, [authToken, id]);

  const dispatch = useDispatch<AppDispatch>();
  const experiences = useSelector((state: RootState) => state.experience.items);

  useEffect(() => {
    if (data?.work_experience) {
      dispatch(setGlobalExperiences(data.work_experience));
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    if (authToken && selectedExperienceId) {
      try {
        const response = await removeWorkExperience(
          authToken,
          selectedExperienceId
        );
        dispatch(removeGlobalExperience(selectedExperienceId));
        dispatch(removeExperienceFromSkills({ orgId: selectedExperienceId }));
        toast.success(response.message);
      } catch (error) {
        console.error("Failed to delete experience", error);
        toast.error(getErrorMessage(error));
      } finally {
        setDeleteDialogOpen(false);
        setSelectedExperienceId(null);
      }
    }
  };

  if (loading) {
    return (
      <section
        id="experience-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500"
      >
        <ExperienceSkeletonLoader />
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="experience-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
      >
        <p className="text-red-500">
          Failed to load experiences. Please try again later.
        </p>
      </section>
    );
  }

  const isMe = data?.is_me ?? false;
  const isEmpty = experiences.length === 0;

  // Handler for adding a new experience
  const handleAddExperience = (newExperience: Experience) => {
    dispatch(addGlobalExperience(newExperience));
  };

  // Handler for updating an existing experience
  const handleEditExperience = (updatedExp: Experience) => {
    dispatch(updateGlobalExperience(updatedExp));

    setEditOpen(false);
    setExperienceToEdit(null);
  };

  return (
    <section
      id="experience-section"
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <ExperienceHeaderSection
        isMe={isMe}
        isEmpty={isEmpty}
        onAddExperience={handleAddExperience}
      />

      {isEmpty ? (
        isMe ? (
          <EmptyExperience onAddExperience={handleAddExperience} />
        ) : (
          <EmptyExperienceReadOnly />
        )
      ) : (
        <ExperienceListContainer
          experiences={experiences}
          isMe={isMe}
          onStartEdit={(exp) => {
            setExperienceToEdit(exp);
            setEditOpen(true);
          }}
          userId={id as string}
          onDeleteClick={(id) => {
            setSelectedExperienceId(id);
            setDeleteDialogOpen(true);
          }}
        />
      )}

      {/* Edit modal (only shown if experienceToEdit is set) */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby={undefined}
          id="edit-experience-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader>
            <Header title="Edit Experience" />

            <DialogDescription className="text-sm text-gray-500 dark:text-gray-300">
              *Indicates required
            </DialogDescription>
          </DialogHeader>

          {/* Render only if we have an experience to edit */}
          {experienceToEdit && (
            <EditExperienceModal
              experience={experienceToEdit}
              onClose={() => {
                setEditOpen(false);
                setExperienceToEdit(null);
              }}
              onSuccess={handleEditExperience}
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
              Delete Experience?
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 dark:text-gray-300">
              This action cannot be undone. Are you sure you want to permanently
              delete this experience from your profile?
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

/* ------------------------------------------------------------------
   ExperienceListContainer
------------------------------------------------------------------ */
interface ExperienceListContainerProps {
  experiences: Experience[];
  isMe: boolean;
  onStartEdit: (exp: Experience) => void;
  onDeleteClick: (experienceId: string) => void;
  userId: string;
}

const ExperienceListContainer: React.FC<ExperienceListContainerProps> = ({
  experiences,
  isMe,
  onStartEdit,
  onDeleteClick,
  userId,
}) => (
  <div id="experience-list-container" className="space-y-4">
    {experiences.slice(0, 3).map((experience, idx) => (
      <Fragment key={idx}>
        <ExperiencesList
          isMe={isMe}
          onStartEdit={onStartEdit}
          onDeleteClick={onDeleteClick}
          experience={experience}
          idx={idx}
        />
      </Fragment>
    ))}

    {experiences.length > 3 && (
      <Link
        to={`/user-profile/experiences/${userId}`}
        id="show-more-experiences-link"
        className="block w-full text-center text-blue-700 hover:underline transition-all duration-300 ease-in-out dark:text-blue-400 font-semibold"
      >
        Show More
      </Link>
    )}
  </div>
);

/* ------------------------------------------------------------------
   EmptyExperience (for isMe === true when no experiences)
------------------------------------------------------------------ */
interface EmptyExperienceProps {
  onAddExperience: (exp: Experience) => void;
}
const EmptyExperience: React.FC<EmptyExperienceProps> = ({
  onAddExperience,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div id="empty-experience-container" className="grid gap-2">
      <div
        id="empty-experience-info"
        className="opacity-65 flex gap-2 items-center"
      >
        <div id="empty-experience-icon" className="p-3 rounded-xl border-2">
          <IoIosBriefcase size={25} />
        </div>
        <div
          id="empty-experience-details"
          className="flex flex-col justify-center"
        >
          <h2 id="empty-experience-job-title" className="font-semibold">
            Job Title
          </h2>
          <p id="empty-experience-organization" className="text-sm">
            Organization
          </p>
          <p id="empty-experience-duration" className="text-sm">
            2023 - present
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            id="experience-add-button"
            className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer"
          >
            Add Experience
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          id="empty-experience-dialog-content"
          className="max-h-[45rem] dark:bg-gray-900 overflow-y-auto overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader id="empty-experience-dialog-header">
            <Header title="Add Experience" />

            <DialogDescription
              id="empty-experience-dialog-description"
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

/* ------------------------------------------------------------------
   EmptyExperienceReadOnly (for isMe === false && isEmpty)
------------------------------------------------------------------ */
const EmptyExperienceReadOnly: React.FC = () => (
  <div id="empty-experience-readonly-container" className="grid gap-2">
    <div className="opacity-65 flex gap-2 items-center">
      <div className="p-3 rounded-xl border-2">
        <IoIosBriefcase size={25} />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="font-semibold">No Experience</h2>
        <p className="text-sm">This user has not added any experience yet.</p>
      </div>
    </div>
  </div>
);

export default ExperienceSection;
