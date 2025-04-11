// EditSkillModal.tsx
import { FormCheckbox } from "@/components";
import { getUserSections, updateUserSkill } from "@/endpoints/userProfile";
import useFetchData from "@/hooks/useFetchData";
import { Skill, SkillForm, SkillUserSections } from "@/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

interface EditSkillModalProps {
  skill: Skill;
  onClose?: () => void;
  onSuccess?: (updatedSkill: Skill) => void;
}

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
  </div>
);

const EditSkillModal: React.FC<EditSkillModalProps> = ({
  skill,
  onClose,
  onSuccess,
}) => {
  const authToken = Cookies.get("linkup_auth_token");

  // Form state still holds the skill name to pass to the API
  const [formData, setFormData] = useState<SkillForm>({
    name: skill.name,
    educations: skill.educations.map((e) => e._id),
    experiences: skill.experiences.map((e) => e._id),
    licenses: skill.licenses.map((l) => l._id),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the user's associated sections
  const { data, loading } = useFetchData<SkillUserSections | null>(() =>
    authToken ? getUserSections(authToken) : Promise.resolve(null)
  );

  // Reset form data when the skill prop changes
  useEffect(() => {
    setFormData({
      name: skill.name,
      educations: skill.educations.map((e) => e._id),
      experiences: skill.experiences.map((e) => e._id),
      licenses: skill.licenses.map((l) => l._id),
    });
  }, [skill]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  // Toggle checkbox selection
  const handleCheckboxChange =
    (field: keyof SkillForm, id: string) => (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: checked
          ? [...(prev[field] as string[]), id]
          : (prev[field] as string[]).filter((itemId) => itemId !== id),
      }));
    };

  // Handle form submission and API call
  const handleSubmit = async () => {
    if (!authToken) {
      toast.error("Unauthorized");
      return;
    }
    console.log(skill);
    console.log(formData);
    if (!skill._id) {
      toast.error("Invalid skill id");
      return;
    }
    setIsSubmitting(true);
    try {
      // Only updating the arrays; the name remains unchanged
      console.log(skill._id);
      const updatedSkill = await updateUserSkill(
        authToken,
        skill._id,
        formData
      );
      console.log(skill);
      // console.log(formData)
      // Call onSuccess with complete updated skill data
      onSuccess?.({
        ...skill,
        _id: skill._id,
        name: skill.name,
        educations: updatedSkill.skill.educations.map(
          (ed: Skill["educations"]) => ({ ...ed })
        ),
        experiences: updatedSkill.skill.experiences.map(
          (ex: Skill["experiences"]) => ({ ...ex })
        ),
        licenses: updatedSkill.skill.licenses.map((li: Skill["licenses"]) => ({
          ...li,
        })),
      });
      onClose?.();
      toast.success("Skill updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoData =
    data?.experiences?.length === 0 &&
    data?.educations?.length === 0 &&
    data?.licenses?.length === 0;

  return (
    <div className="space-y-6 dark:text-gray-100">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update where you've used this skill
        </p>

        {loading ? (
          <SkeletonLoader />
        ) : hasNoData ? (
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No associated items found
          </div>
        ) : (
          <>
            {data && data.experiences && data.experiences.length > 0 && (
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Experience
                </h3>
                <div className="space-y-2 mt-2">
                  {data.experiences.map((exp) => (
                    <div key={exp._id} className="flex items-center gap-3">
                      <FormCheckbox
                        label={exp.name}
                        id={`exp-${exp._id}-checkbox`}
                        checked={formData.experiences.includes(exp._id)}
                        onCheckedChange={handleCheckboxChange(
                          "experiences",
                          exp._id
                        )}
                        name={`${exp.name} checkbox`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data && data.educations && data.educations.length > 0 && (
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Education
                </h3>
                <div className="space-y-2 mt-2">
                  {data.educations.map((edu) => (
                    <div key={edu._id} className="flex items-center gap-3">
                      <FormCheckbox
                        label={edu.name}
                        id={`edu-${edu._id}-checkbox`}
                        checked={formData.educations.includes(edu._id)}
                        onCheckedChange={handleCheckboxChange(
                          "educations",
                          edu._id
                        )}
                        name={`${edu.name} checkbox`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data && data.licenses && data.licenses.length > 0 && (
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Licenses
                </h3>
                <div className="space-y-2 mt-2">
                  {data.licenses.map((license) => (
                    <div key={license._id} className="flex items-center gap-3">
                      <FormCheckbox
                        label={license.name}
                        id={`license-${license._id}-checkbox`}
                        checked={formData.licenses.includes(license._id)}
                        onCheckedChange={handleCheckboxChange(
                          "licenses",
                          license._id
                        )}
                        name={`${license.name} checkbox`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
        <Button variant="outline" className="destructiveBtn" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="affimativeBtn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditSkillModal;
