import { Fragment, useEffect, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@/components";
import { FaRegLightbulb } from "react-icons/fa";
import { Skill } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { deleteUserSkills, getUserSkills } from "@/endpoints/userProfile";
import AddSkillModal from "../modals/skill_modal/AddSkillModal";
import { GoPlus } from "react-icons/go";
import Header from "../modals/components/Header";
import { MdDeleteForever } from "react-icons/md";
import EditSkillModal from "../modals/skill_modal/EditSkillModal";
import { useFormStatus } from "@/hooks/useFormStatus";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import SkillsList from "./SkillsList";

interface FetchDataResult {
  skills: Skill[];
  is_me: boolean;
}

const SkillsSection = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const { data, loading, error } = useFetchData<FetchDataResult | null>(
    () =>
      authToken && id ? getUserSkills(authToken, id) : Promise.resolve(null),
    [id] // add id as a dependency so that when it changes, the effect runs again
  );
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const isMe = data?.is_me ?? false;
  const isEmpty = skills.length === 0;
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const handleAddSkill = (newSkill: Skill) => {
    setSkills((prev) => [...prev, newSkill]);
  };

  // Handler for updating an existing skill
  const handleEditLicense = (updatedSkill: Skill) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill._id === updatedSkill._id ? updatedSkill : skill
      )
    );
    setEditOpen(false);
    setSkillToEdit(null);
  };

  useEffect(() => {
    if (data?.skills) {
      setSkills(data.skills);
    }
  }, [data]);

  const handleConfirmDelete = async () => {
    startSubmitting();
    try {
      const response = await deleteUserSkills(
        authToken as string,
        selectedSkill as string
      );
      setSkills(skills.filter((skill) => skill._id !== selectedSkill));
      setDeleteDialogOpen(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      stopSubmitting();
    }
  };

  if (error) {
    return (
      <section
        id="skills-section"
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
      >
        <p className="text-red-500">
          Failed to load skills. Please try again later.
        </p>
      </section>
    );
  }

  if (!isMe && isEmpty) return null;

  if (loading)
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500">
        <SkillsSkeleton />
      </div>
    );
  if (isMe && isEmpty)
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500">
        <EmptySkills onAddSkill={handleAddSkill} />
      </div>
    );

  return (
    <section
      id="skills-section"
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <header className="w-full flex items-center justify-between">
        <h2 className="text-xl font-bold">Skills</h2>
        {!isEmpty && isMe && <ActionButtons onAddSkill={handleAddSkill} />}
      </header>
      {/* Use divide-y to place horizontal lines between skills */}
      <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
        {skills.slice(0, 2).map((skill, idx) => (
          <Fragment key={skill._id}>

            <SkillsList
              skill={skill}
              setDeleteDialogOpen={setDeleteDialogOpen}
              setEditOpen={setEditOpen}
              setSkillToEdit={setSkillToEdit}
              setSelectedSkill={setSelectedSkill}
              idx={idx}
              isMe={isMe}
            />
          </Fragment>
        ))}
        {skills.length > 2 && (
          <Link
            to={`/user-profile/skills/${id}`}
            id="show-more-skills-link"
            className="block w-full text-center text-blue-700 mt-2 mb-[-0.5rem] hover:underline transition-all duration-300 ease-in-out dark:text-blue-400 font-semibold"
          >
            Show More
          </Link>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby={undefined}
          id="edit-skill-dialog-content"
          className="max-h-[45rem] overflow-y-auto dark:bg-gray-900 overflow-x-hidden !max-w-5xl sm:!w-[38.5rem] !w-full"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader>
            <Header title={`Edit ${skillToEdit?.name}`} />
          </DialogHeader>
          {skillToEdit && (
            <EditSkillModal
              skill={skillToEdit}
              onClose={() => {
                setEditOpen(false);
                setSkillToEdit(null);
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
              Delete Skill?
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 dark:text-gray-300">
              This action cannot be undone. Are you sure you want to permanently
              delete this Skill from your profile?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 hover:bg-gray-100 dark:text-black dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700 transition-all duration-300 ease-in-out"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isSubmitting}
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

interface ActionButtonsProps {
  onAddSkill: (skill: Skill) => void;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddSkill }) => {
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

const EmptySkills: React.FC<{ onAddSkill: (skill: Skill) => void }> = ({
  onAddSkill,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-2 dark:text-gray-100">
      <div className="opacity-65 flex gap-2 items-center">
        <div className="p-3 rounded-xl border-2 dark:border-gray-600">
          <FaRegLightbulb
            size={20}
            className="text-gray-600 dark:text-gray-300"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="font-semibold">Skill Name</h2>
          <p className="text-sm">Experience or Education related</p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer">
            Add Skill
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[45rem] dark:bg-gray-900 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription className="text-sm mb-[-1rem] text-gray-500 dark:text-gray-300">
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

const SkillsSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="space-y-4">
      {[1].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="pl-4 space-y-1">
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkillsSection;
