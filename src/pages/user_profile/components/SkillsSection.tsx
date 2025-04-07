import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  DialogClose,
  DialogFooter,
} from "@/components";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { Skill } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { deleteUserSkills, getUserSkills } from "@/endpoints/userProfile";
import AddSkillModal from "./modals/skill_modal/AddSkillModal";
import { GoPlus } from "react-icons/go";
import Header from "./modals/components/Header";
import { MdDeleteForever } from "react-icons/md";
import { BsPencil } from "react-icons/bs";
import EditSkillModal from "./modals/skill_modal/EditSkillModal";
import { useFormStatus } from "@/hooks/useFormStatus";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

interface FetchDataResult {
  skills: Skill[];
  is_me: boolean;
}

const SkillsSection = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const { data, loading, error } = useFetchData<FetchDataResult | null>(
    () => authToken && id ? getUserSkills(authToken, id) : Promise.resolve(null),
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
        {skills.map((skill, idx) => (
          <div key={skill._id} className="py-4 relative">
            <h3 className="font-semibold text-lg">{skill.name}</h3>

            {/* Experiences */}
            {skill.experiences && skill.experiences.length > 0 && (
              <div className="pl-4 mt-2">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Experiences
                </h4>
                <div className="flex flex-wrap gap-4 mt-2 pl-4">
                  {skill.experiences.map((exp) => (
                    <div key={exp._id} className="flex items-center gap-2">
                      <img
                        src={exp.logo}
                        alt={exp.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {exp.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educations */}
            {skill.educations && skill.educations.length > 0 && (
              <div className="mt-4 pl-4">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Educations
                </h4>
                <div className="flex flex-wrap gap-4 mt-2 pl-4">
                  {skill.educations.map((edu) => (
                    <div key={edu._id} className="flex items-center gap-2">
                      <img
                        src={edu.logo}
                        alt={edu.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {edu.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Licenses */}
            {skill.licenses && skill.licenses.length > 0 && (
              <div className="mt-4 pl-4">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Licenses
                </h4>
                <div className="flex flex-wrap gap-4 mt-2 pl-4">
                  {skill.licenses.map((license) => (
                    <div key={license._id} className="flex items-center gap-2">
                      <img
                        src={license.logo}
                        alt={license.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {license.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Endorsements */}
            {skill.endorsments.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 font-semibold text-sm text-blue-600 hover:underline focus:outline-none pl-4 mt-4">
                    <span>
                      <FaPeopleGroup size={20} />
                    </span>
                    {skill.endorsments.slice(0, 2).map((endorser, idx, arr) => (
                      <span key={endorser.user_id}>
                        {endorser.name}
                        {idx < arr.length - 1 ? ", " : " "}
                      </span>
                    ))}
                    {skill.total_endorsements &&
                      skill.total_endorsements > 2 && (
                        <span>and {skill.total_endorsements - 2} others</span>
                      )}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg">
                  <DialogHeader className="divide-y">
                    <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      Endorsements
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      These are the people who endorsed this skill.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6 space-y-4 divide-y">
                    {skill.endorsments.length > 0 ? (
                      skill.endorsments.map((endorsement) => (
                        <Link
                        to={`/user-profile/${endorsement.user_id}`}
                          key={endorsement.user_id}
                          className="flex w-full  items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-700  transition-colors"
                        >
                          <img
                            src={endorsement.profilePicture}
                            alt={endorsement.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {endorsement.name}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        No endorsements yet.
                      </p>
                    )}
                  </div>
                  <DialogFooter className="w-full flex justify-end">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-fit destructiveBtn"
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {isMe && (
              <div className="absolute top-2 right-0 flex gap-2">
                <button
                  id={`skill-edit-button-${idx}`}
                  aria-label="Edit Skill"
                  className="hover:bg-gray-300 w-fit h-9 dark:hover:text-black p-2 rounded-full transition-all duration-200 ease-in-out"
                  onClick={() => {
                    setSkillToEdit(skill);
                    setEditOpen(true);
                  }}
                >
                  <BsPencil size={20} />
                </button>
                <button
                  id={`skill-delete-button-${idx}`}
                  aria-label="Delete Skill"
                  className="bg-red-100 w-fit h-9 dark:bg-red-200 dark:text-gray-700 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 ease-in-out"
                  onClick={() => {
                    setSelectedSkill(skill._id as string);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
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
              onSuccess={() => {}}
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
