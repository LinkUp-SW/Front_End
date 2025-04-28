import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { Skill } from "@/types";
import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import { SlLike, SlDislike } from "react-icons/sl";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { endorseSkill, removeEndorsement } from "@/endpoints/userProfile";
import {
  endorseSkill as updateEndorsements,
  removeEndorsement as removeGlobalEndorsement,
} from "@/slices/skills/skillsSlice";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

interface SkillListProps {
  skill: Skill;
  isMe: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedSkill: (skill: Skill) => void;
  setEditOpen: (open: boolean) => void;
  setSkillToEdit: (skill: Skill) => void;
  idx: number;
  isInConnections?: boolean;
  userID?: string;
}

const SkillsList: React.FC<SkillListProps> = ({
  skill,
  isMe,
  setDeleteDialogOpen,
  setSelectedSkill,
  setEditOpen,
  setSkillToEdit,
  idx,
  isInConnections,
  userID,
}) => {
  const authToken = Cookies.get("linkup_auth_token");
  const currentUserId = Cookies.get("linkup_user_id");
  const [alreadyEndorsed, setAlreadyEndorsed] = useState(false);
  const dispatch = useDispatch();
  const userBio = useSelector((state: RootState) => state.userBio.data);
  const skills = useSelector((state: RootState) => state.skill.items);

  useEffect(() => {
    const currentSkill = skills.find((sk) => sk._id === skill._id);
    console.log(currentSkill);
    console.log(userID);
    if (userID) {
      const isUserEndorsed = currentSkill?.endorsments.find(
        (user) => user.user_id === currentUserId
      );
      setAlreadyEndorsed(!!isUserEndorsed);
    }
  }, [currentUserId]);

  const handleAddEndorsement = async () => {
    try {
      const response = await endorseSkill(
        authToken as string,
        userID as string,
        skill._id as string
      );
      setAlreadyEndorsed(true);
      dispatch(
        updateEndorsements({
          skillId: skill._id as string,
          endorsement: {
            user_id: currentUserId as string,
            profilePicture: userBio?.profile_photo as string,
            name: `${userBio?.bio.first_name} ${userBio?.bio.last_name}`,
          },
        })
      );
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRemoveEndorsement = async () => {
    try {
      const response = await removeEndorsement(
        authToken as string,
        userID as string,
        skill._id as string
      );
      setAlreadyEndorsed(false);
      dispatch(
        removeGlobalEndorsement({
          skillId: skill._id as string,
          userId: currentUserId as string,
        })
      );
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <div className="py-4 relative">
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
              {skill.total_endorsements && skill.total_endorsements > 2 && (
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
      {!isMe && isInConnections && (
        <div className="absolute top-2 right-0 flex gap-2">
          {alreadyEndorsed ? (
            <button
              id={`skill-remove-endorse-button-${idx}`}
              aria-label="Remove Endorse Skill"
              className="w-fit p-2 rounded-full transition-colors duration-200 ease-in-out flex items-center justify-center bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
              onClick={handleRemoveEndorsement}
            >
              <SlDislike size={20} />
            </button>
          ) : (
            <button
              id={`skill-endorse-button-${idx}`}
              aria-label="Endorse Skill"
              className="w-fit p-2 rounded-full transition-colors duration-200 ease-in-out flex items-center justify-center bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
              onClick={handleAddEndorsement}
            >
              <SlLike size={20} />
            </button>
          )}
        </div>
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
              setSelectedSkill(skill);
              setDeleteDialogOpen(true);
            }}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsList;
