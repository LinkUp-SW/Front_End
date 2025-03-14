import { convertStringsArrayToLowerCase } from "@/utils";
import { useState } from "react";

interface SkillsManagerProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
}
const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, setSkills }) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleAddNewSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const lowerCaseSkills = convertStringsArrayToLowerCase(skills);
      if (lowerCaseSkills.includes(skillInput.toLocaleLowerCase())) {
        return;
      }
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  return (
    <div className="flex flex-col gap-2 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          Skills
        </h2>
        <button
          type="button"
          onClick={addSkill}
          className="flex items-center gap-1 text-blue-600 cursor-pointer border border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-300 hover:text-white dark:hover:text-gray-800 font-semibold transition-all duration-300 px-2 py-1 rounded-full dark:text-blue-400 text-sm"
        >
          <span>+</span>
          <span>Add skill</span>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter skill"
          value={skillInput}
          onKeyDown={handleAddNewSkill}
          onChange={(e) => setSkillInput(e.target.value)}
          className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0"
        />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-600"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SkillsManager;
