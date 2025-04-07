import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { Education } from "@/types"; // Ensure your Education type is defined here
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import AddEducationModal from "./modals/education_modal/AddEducationModal";
import Header from "./modals/components/Header";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { getUserEducation, removeEducation } from "@/endpoints/userProfile";
import { formatExperienceDate } from "@/utils";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import EditEducationModal from "./modals/education_modal/EditEducationModal";

interface FetchDataResult {
  education: Education[];
  is_me: boolean;
}

const EducationSection: React.FC = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const [educations, setEducations] = useState<Education[]>([]);
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

  useEffect(() => {
    console.log(data?.education);
    if (data?.education) {
      setEducations(data.education);
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    if (authToken && selectedEducationId) {
      try {
        const response = await removeEducation(authToken, selectedEducationId);
        setEducations((prev) =>
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
        id="education-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500"
      >
        <SkeletonLoader />
      </section>
    );
  }

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
    setEducations((prev) => [...prev, newEducation]);
  };

  // Handler for updating an existing education
  const handleEditEducation = (updatedEdu: Education) => {
    setEducations((prev) =>
      prev.map((edu) => (edu._id === updatedEdu._id ? updatedEdu : edu))
    );
    setEditOpen(false);
    setEducationToEdit(null);
  };

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
        onAddEducation={handleAddEducation}
      />

      {isEmpty ? (
        isMe ? (
          <EmptyEducation onAddEducation={handleAddEducation} />
        ) : (
          <EmptyEducationReadOnly />
        )
      ) : (
        <EducationList
          educations={educations}
          isMe={isMe}
          onStartEdit={(edu) => {
            setEducationToEdit(edu);
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
              className="bg-pink-700 hover:bg-pink-900 focus-visible:ring-pink-700 transition-all duration-300 ease-in-out"
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
  onAddEducation: (edu: Education) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  isEmpty,
  isMe,
  onAddEducation,
}) => (
  <header
    id="education-section-header"
    className={`flex justify-between items-center mb-4 ${
      isEmpty ? "opacity-65" : ""
    }`}
  >
    <div id="education-section-title-container">
      <h2
        id="education-section-title"
        className="text-xl text-black dark:text-white font-bold"
      >
        Education
      </h2>
      {isEmpty && isMe && (
        <p id="education-section-description" className="text-sm">
          Add your education details to showcase your academic background.
        </p>
      )}
    </div>
    {!isEmpty && isMe && <ActionButtons onAddEducation={onAddEducation} />}
  </header>
);

interface ActionButtonsProps {
  onAddEducation: (edu: Education) => void;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddEducation }) => {
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

/* Education List */
interface EducationListProps {
  educations: Education[];
  isMe: boolean;
  onStartEdit: (edu: Education) => void;
  onDeleteClick: (educationId: string) => void;
}

const EducationList: React.FC<EducationListProps> = ({
  educations,
  isMe,
  onStartEdit,
  onDeleteClick,
}) => (
  <div id="education-list-container" className="space-y-4">
    {educations.slice(0, 3).map((edu, idx) => (
      <div
        id={`education-item-${edu._id}`}
        key={idx}
        className="border-l-2 border-blue-600 pl-4 relative"
      >
        <h3 id={`education-degree-${edu._id}`} className="font-bold">
          {edu.degree}
        </h3>
        <p
          id={`education-school-${edu._id}`}
          className="text-gray-600 dark:text-gray-300"
        >
          {edu.school?.name}
        </p>
        <p
          id={`education-field-${edu._id}`}
          className="text-sm text-gray-500 dark:text-gray-200"
        >
          {edu.field_of_study}
        </p>
        <p className="text-xs capitalize inline-flex gap-2 text-gray-500 dark:text-gray-200">
          <span>{formatExperienceDate(edu.start_date)}</span>
          <span>-</span>
          <span>{formatExperienceDate(edu.end_date)}</span>
        </p>
        {edu.skills.length > 0 && (
          <div className="text-xs font-semibold flex items-center gap-2">
            <h2 className="font-bold text-sm">Skills:</h2>
            {edu.skills.join(", ")}
          </div>
        )}
        {edu.media.length > 0 && (
          <div className="mt-2">
            {edu.media.map((med, idx) => (
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
              id={`education-edit-button-${idx}`}
              aria-label="Edit Education"
              className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
              onClick={() => onStartEdit(edu)}
            >
              <BsPencil size={20} />
            </button>
            <button
              id={`education-delete-button-${idx}`}
              aria-label="Delete Education"
              className="bg-red-100 dark:bg-red-200 dark:text-gray-700 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 ease-in-out"
              onClick={() => onDeleteClick(edu._id as string)}
            >
              <MdDeleteForever size={20} />
            </button>
          </div>
        )}
      </div>
    ))}
    {educations.length > 3 && (
      <Link
        to="#"
        className="block w-full text-center text-blue-700 hover:underline transition-all duration-300 ease-in-out dark:text-blue-400 font-semibold"
      >
        Show More
      </Link>
    )}
  </div>
);

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

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default EducationSection;
