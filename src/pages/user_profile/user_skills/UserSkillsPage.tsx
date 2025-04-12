import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import { deleteUserSkills, getUserSkills } from "@/endpoints/userProfile";
import { Skill } from "@/types";
import { ResourcesSection, ViewedSection } from "../components";
import { Fragment, useEffect, useState } from "react";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  WithNavBar,
} from "@/components";
import Header from "../components/modals/components/Header";
import EditSkillModal from "../components/modals/skill_modal/EditSkillModal";
import { MdDeleteForever } from "react-icons/md";
import AddSkillModal from "../components/modals/skill_modal/AddSkillModal";
import SkillsList from "../components/skills/SkillsList";
import { useFormStatus } from "@/hooks/useFormStatus";
import { FaRegLightbulb } from "react-icons/fa";
import SkillsSkeleton from "../components/skills/SkillsSkeleton";
import SkillsActionButtons from "../components/skills/SkillsActionButtons";
interface FetchDataResult {
  skills: Skill[];
  is_me: boolean;
}

const UserSkillsPage = () => {
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
  const handleEditSkill = (updatedSkill: Skill) => {
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

  return (
    <main className="max-w-7xl mx-auto lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <section
            id="skills-section"
            className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow ${
              isEmpty
                ? "outline-dotted dark:outline-blue-300 outline-blue-500"
                : ""
            }`}
          >
            <header className="w-full flex items-center justify-between">
              <h2 className="text-xl font-bold">Skills</h2>
              {!isEmpty && isMe && (
                <SkillsActionButtons onAddSkill={handleAddSkill} />
              )}
            </header>
            <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <SkillsSkeleton />
              ) : (
                <>
                  {isEmpty ? (
                    <EmptySkills onAddSkill={handleAddSkill} isMe={isMe} />
                  ) : (
                    <>
                      {skills.map((skill, idx) => (
                        <Fragment key={idx}>
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
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <ViewedSection />
          <ResourcesSection />
        </div>
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
    </main>
  );
};

const EmptySkills: React.FC<{
  onAddSkill: (skill: Skill) => void;
  isMe: boolean;
}> = ({ onAddSkill, isMe }) => {
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
        {isMe ? (
          <div className="flex flex-col justify-center">
            <h2 className="font-semibold">Skill Name</h2>
            <p className="text-sm">Experience or Education related</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center">
            <p className="text-sm">This user does not have skills yet :{"("}</p>
          </div>
        )}
      </div>
      {isMe && (
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
      )}
    </div>
  );
};

export default WithNavBar(UserSkillsPage);
