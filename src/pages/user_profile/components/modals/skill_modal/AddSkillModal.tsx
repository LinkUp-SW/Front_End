import { FormInput } from "@/components";
import { addUserSkills, getUserSections } from "@/endpoints/userProfile";
import useFetchData from "@/hooks/useFetchData";
import { Skill, SkillForm, SkillUserSections } from "@/types";
import Cookies from "js-cookie";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useFormStatus } from "@/hooks/useFormStatus";
import { getErrorMessage } from "@/utils/errorHandler";

interface AddSkillModalProps {
  onClose?: () => void;
  onSuccess?: (newSkill: Skill) => void;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const authToken = Cookies.get("linkup_auth_token");
  const [formData, setFormData] = useState<SkillForm>({
    name: "",
    educations: [],
    experiences: [],
    licenses: [],
  });
  const { data } = useFetchData<SkillUserSections | null>(() =>
    authToken ? getUserSections(authToken) : Promise.resolve(null)
  );
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const handleCheckboxChange =
    (field: keyof SkillForm, id: string) => (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: checked
          ? [...(prev[field] as string[]), id]
          : (prev[field] as string[]).filter((itemId) => itemId !== id),
      }));
    };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("please enter a skill name");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    startSubmitting();
    console.log(formData);
    try {
      const response = await addUserSkills(authToken as string, {
        ...formData,
      });
      console.log(response.skill);
      console.log(formData);
      // Update the parent state with the newly created experience
      onSuccess?.({
        ...formData,
        _id: response.skill._id,
        endorsments: response.skill.endorsments,
        educations: response.skill.educations,
        experiences: response.skill.experiences,
        licenses: response.skill.licenses,
      });

      toast.success("Skill Added Successfully!");
      // Close the modal
      onClose?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      stopSubmitting();
    }
  };
  const hasNoData =
    data?.experiences?.length === 0 &&
    data?.educations?.length === 0 &&
    data?.licenses?.length === 0;

  return (
    <div className="space-y-6 dark:text-gray-100">
      <FormInput
        label="Skill*"
        placeholder="Skill (ex: Project Management)"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        id="skill-name"
        name="skillName"
      />

      {data && !hasNoData && (
        <>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              75% of hirers value skill context. Select at least one item to
              show where you used this skill.
            </p>

            {data?.experiences?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Experience</h3>
                <div className="space-y-2 pl-4">
                  {data.experiences.map((exp) => (
                    <div key={exp._id} className="flex items-center gap-2">
                      <Checkbox
                        id={`exp-${exp._id}`}
                        checked={formData.experiences.includes(exp._id)}
                        onCheckedChange={handleCheckboxChange(
                          "experiences",
                          exp._id
                        )}
                      />
                      <label htmlFor={`exp-${exp._id}`} className="text-sm">
                        {exp.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.educations?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Education</h3>
                <div className="space-y-2 pl-4">
                  {data.educations.map((edu) => (
                    <div key={edu._id} className="flex items-center gap-2">
                      <Checkbox
                        id={`edu-${edu._id}`}
                        checked={formData.educations.includes(edu._id)}
                        onCheckedChange={handleCheckboxChange(
                          "educations",
                          edu._id
                        )}
                      />
                      <label htmlFor={`edu-${edu._id}`} className="text-sm">
                        {edu.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.licenses?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Licenses</h3>
                <div className="space-y-2 pl-4">
                  {data.licenses.map((license) => (
                    <div key={license._id} className="flex items-center gap-2">
                      <Checkbox
                        id={`license-${license._id}`}
                        checked={formData.licenses.includes(license._id)}
                        onCheckedChange={handleCheckboxChange(
                          "licenses",
                          license._id
                        )}
                      />
                      <label
                        htmlFor={`license-${license._id}`}
                        className="text-sm"
                      >
                        {license.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button
          disabled={isSubmitting}
          variant="outline"
          className="destructiveBtn"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          className="affimativeBtn"
          onClick={handleSubmit}
        >
          Add Skill
        </Button>
      </div>
    </div>
  );
};

export default AddSkillModal;
