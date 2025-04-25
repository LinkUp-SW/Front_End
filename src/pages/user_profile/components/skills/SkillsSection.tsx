import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSkills as setGlobalSkills,
  addSkill as addGlobalSkill,
  updateSkill as updateGlobalSkill,
  removeSkill as removeGlobalSkill,
} from "@/slices/skills/skillsSlice";
import { RootState, AppDispatch } from "@/store";
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
import Header from "../modals/components/Header";
import { MdDeleteForever } from "react-icons/md";
import EditSkillModal from "../modals/skill_modal/EditSkillModal";
import { useFormStatus } from "@/hooks/useFormStatus";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import SkillsList from "./SkillsList";
import SkillsSkeleton from "./SkillsSkeleton";
import SkillsActionButtons from "./SkillsActionButtons";

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
    [id]
  );

  const dispatch = useDispatch<AppDispatch>();
  const skills = useSelector((state: RootState) => state.skill.items);
  const isMe = data?.is_me ?? false;
  const isEmpty = skills.length === 0;
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  // Load server data into Redux
  useEffect(() => {
    if (data?.skills) {
      dispatch(setGlobalSkills(data.skills));
    }
  }, [data, dispatch]);

  // Handler for adding
  const handleAddSkill = (newSkill: Skill) => {
    dispatch(addGlobalSkill(newSkill));
  };

  // Handler for editing
  const handleEditSkill = (updatedSkill: Skill) => {
    dispatch(updateGlobalSkill(updatedSkill));
    setEditOpen(false);
    setSkillToEdit(null);
  };

  // Handler for deleting
  const handleConfirmDelete = async () => {
    if (!selectedSkill) return;
    startSubmitting();
    try {
      const response = await deleteUserSkills(
        authToken as string,
        selectedSkill
      );
      dispatch(removeGlobalSkill(selectedSkill));
      setDeleteDialogOpen(false);
      toast.success(response.message);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      stopSubmitting();
    }
  };

  // Local UI state
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [editOpen, setEditOpen] = useState(false);

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

  // Hide entirely if not the owner and no skills
  if (!isMe && isEmpty) return null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500">
        <SkillsSkeleton />
      </div>
    );
  }

  if (isMe && isEmpty) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow outline-dotted dark:outline-blue-300 outline-blue-500">
        <EmptySkills onAddSkill={handleAddSkill} />
      </div>
    );
  }

  return (
    <section
      id="skills-section"
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
        isEmpty ? "outline-dotted dark:outline-blue-300 outline-blue-500" : ""
      }`}
    >
      <header className="w-full flex items-center justify-between">
        <h2 className="text-xl font-bold">Skills</h2>
        {!isEmpty && isMe && (
          <SkillsActionButtons onAddSkill={handleAddSkill} />
        )}
      </header>
      <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
        {skills.slice(0, 2).map((skill, idx) => (
          <Fragment key={skill._id ?? idx}>
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
              onSuccess={handleEditSkill}
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
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
          <button
            id="add-skill-button"
            className="w-fit py-1.5 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer"
          >
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

export default SkillsSection;
