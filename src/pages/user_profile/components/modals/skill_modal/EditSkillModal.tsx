// import { getUserSections } from "@/endpoints/userProfile";
// import useFetchData from "@/hooks/useFetchData";
import { Skill } from "@/types";
// import Cookies from "js-cookie";
import React from "react";

interface EditSkillModalProps {
  /** The existing experience to edit. */
  skill: Skill;
  /** Called when the modal should be closed, typically after a successful edit */
  onClose?: () => void;
  /** Called with the updated experience after a successful edit */
  onSuccess?: (updatedSkill: Skill) => void;
}

const EditSkillModal: React.FC<EditSkillModalProps> = () => {
  //const authToken = Cookies.get("linkup_auth_token");
//   const { data,loading,error } = useFetchData<SkillUserSections | null>(() =>
//     authToken ? getUserSections(authToken) : Promise.resolve(null)
//   );

  return (
    <div>
      <div></div>
    </div>
  );
};

export default EditSkillModal;
