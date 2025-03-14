import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import styles from "./styles.module.css"; // Import your CSS module
import { convertStringsArrayToLowerCase } from "../../../../../utils";
import { IoMdAdd } from "react-icons/io";
import Header from "../components/Header";

const AboutModal = () => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [aboutText, setAboutText] = useState<string>("");
  const [isAddSkillTriggred, setIsAddSkillTriggred] = useState(false);
  const [skills, setSkills] = useState<string[]>([
    "Web Development",
    "Data Analysis",
    "Machine Learning",
  ]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Refs to store DOM nodes and positions
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const positions = useRef<Map<string, DOMRect>>(new Map());
  const touchStartY = useRef<number | null>(null);

  // Measure and store positions of each list item
  const measurePositions = () => {
    skills.forEach((skill) => {
      const el = itemRefs.current.get(skill);
      if (el) {
        positions.current.set(skill, el.getBoundingClientRect());
      }
    });
  };

  const handleNewSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const handleAddNewSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const lowerCaseSkills = convertStringsArrayToLowerCase(skills);
      if (lowerCaseSkills.includes(newSkill.toLocaleLowerCase())) {
        return;
      }
      setSkills([...skills, newSkill]);
      setNewSkill("");
      setIsAddSkillTriggred(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const lowerCaseSkills = convertStringsArrayToLowerCase(skills);
    const filteredSkills = lowerCaseSkills.filter(
      (s) => s !== skill.toLocaleLowerCase()
    );
    setSkills(filteredSkills);
  };

  // Measure positions on initial mount
  useEffect(() => {
    measurePositions();
  }, []);

  useEffect(() => {
    setWordCount(aboutText.length);
  }, [aboutText]);

  // Apply FLIP animation when the skills array changes
  useLayoutEffect(() => {
    skills.forEach((skill) => {
      const el = itemRefs.current.get(skill);
      if (el) {
        const oldRect = positions.current.get(skill);
        const newRect = el.getBoundingClientRect();
        if (oldRect) {
          const deltaY = oldRect.top - newRect.top;
          if (deltaY !== 0) {
            el.style.transform = `translateY(${deltaY}px)`;
            el.style.transition = "transform 0s";
            // Force reflow
            el.getBoundingClientRect();
            el.style.transition = "transform 300ms ease";
            el.style.transform = "";
          }
        }
      }
    });
    measurePositions();
  }, [skills]);

  function handleAboutText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAboutText(e.target.value);
  }

  // Mouse drag handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    index: number
  ) => {
    setDraggingIndex(index);
    e.dataTransfer.setData("draggedItemIndex", index.toString());
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove(styles.dragging);
    setDraggingIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    measurePositions();
    const draggedItemIndex = parseInt(
      e.dataTransfer.getData("draggedItemIndex")
    );
    const newSkills = [...skills];
    const [removed] = newSkills.splice(draggedItemIndex, 1);
    newSkills.splice(index, 0, removed);
    setSkills(newSkills);
    setDraggingIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
  };

  // Document-level touch event handlers with { passive: false }
  const handleDocumentTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling during touch drag
    // Optionally update visual feedback here
  };

  const handleDocumentTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    // Always remove the event listeners
    document.removeEventListener("touchmove", handleDocumentTouchMove);
    document.removeEventListener("touchend", handleDocumentTouchEnd);

    if (draggingIndex === null) return;

    measurePositions();
    const finalY = e.changedTouches[0].clientY;
    let dropIndex: number | null = null;
    skills.forEach((skill, index) => {
      const el = itemRefs.current.get(skill);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (finalY >= rect.top && finalY <= rect.bottom) {
          dropIndex = index;
        }
      }
    });
    if (dropIndex !== null && dropIndex !== draggingIndex) {
      const newSkills = [...skills];
      const [removed] = newSkills.splice(draggingIndex, 1);
      newSkills.splice(dropIndex, 0, removed);
      setSkills(newSkills);
    }
    setDraggingIndex(null);
    touchStartY.current = null;
  };

  // Touch start handler on the draggable item
  const handleTouchStart = (
    e: React.TouchEvent<HTMLLIElement>,
    index: number
  ) => {
    setDraggingIndex(index);
    touchStartY.current = e.touches[0].clientY;
    // Add non-passive listeners on the document
    document.addEventListener("touchmove", handleDocumentTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleDocumentTouchEnd, {
      passive: false,
    });
  };

  return (
    <div className="max-w-5xl md:w-[40rem] w-full">
      <Header title="Edit About" />
      <section className="grid grid-cols-1 gap-1 relative pb-7">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          You can write about your years of experience, industry, or skills.
          People also talk about their achievements or previous job experiences.
        </p>
        <textarea
          maxLength={2600}
          name="about"
          id="about"
          value={aboutText}
          onChange={handleAboutText}
          rows={10}
          className="border-gray-50 border outline-1 outline-gray-400 dark:outline-gray-300 focus:outline-1 rounded-md text-sm p-2"
        />
        <span className="absolute bottom-0 right-0 text-sm text-gray-700 dark:text-gray-400">
          {wordCount} / 2600
        </span>
      </section>
      <section className="grid grid-cols-1 px-2 gap-1">
        <h2 className="font-semibold text-xl dark:text-gray-100 text-black">
          Skills
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Show your top skills — add up to 5 skills you want to be known for.
          They’ll also appear in your Skills section.
        </p>
        {skills.length === 0 && (
          <p className="text-sm text-red-500 font-semibold">
            You don't have skills for the moment {":("}
          </p>
        )}
        <ul className="grid gap-2 py-2" onDragOver={handleDragOver}>
          {skills.map((skill, index) => (
            <Fragment key={skill}>
              <li
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(skill, el);
                  }
                }}
                className={`inline-flex text-lg w-full py-2 items-center justify-between ${
                  styles["draggable-item"]
                } ${draggingIndex === index ? styles.dragging : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={(e) => handleDragEnd(e)}
                onDrop={(e) => handleDrop(e, index)}
                onTouchStart={(e) => handleTouchStart(e, index)}
              >
                <span className="inline-flex gap-2 items-center">
                  <span
                    onClick={() => handleRemoveSkill(skill)}
                    className="cursor-pointer hover:bg-gray-300 hover:text-black rounded-full p-[0.15rem] transition-all duration-300 ease-in-out"
                  >
                    <IoMdClose />
                  </span>
                  <span className="text-base font-semibold">{skill}</span>
                </span>
                <span className="cursor-grab">
                  <RxHamburgerMenu />
                </span>
              </li>
              {index < skills.length - 1 && (
                <li key={`separator-${index}`} className="pl-5">
                  <div className="w-full h-[0.05rem] dark:bg-white bg-black" />
                </li>
              )}
            </Fragment>
          ))}
        </ul>
        {skills.length < 5 && (
          <div className="w-full px-2">
            {!isAddSkillTriggred ? (
              <button
                onClick={() => setIsAddSkillTriggred(true)}
                className="inline-flex gap-1 items-center border-blue-600 flex-grow text-blue-600 font-semibold border-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 transition-all duration-300 ease-in-out px-2 py-1.5 rounded-full text-sm w-fit"
              >
                <span>
                  <IoMdAdd size={20} />
                </span>{" "}
                <span>Add Skill</span>
              </button>
            ) : (
              <div className="grid w-full gap-2">
                <input
                  type="text"
                  name="new_skill"
                  id="new_skill"
                  value={newSkill}
                  onChange={handleNewSkillInput}
                  onKeyDown={handleAddNewSkill}
                  placeholder="Skill (ex: Project Management)"
                  className="w-full px-2 text-xs outline-1 outline-gray-700 rounded-md h-7"
                />
                <button
                  onClick={() => {
                    setIsAddSkillTriggred(false);
                    setNewSkill("");
                  }}
                  className="inline-flex gap-1 items-center border-red-600 flex-grow text-red-600 font-semibold border-2 cursor-pointer hover:bg-red-600 hover:text-white dark:text-red-300 dark:border-red-300 dark:hover:bg-red-300 dark:hover:text-gray-700 transition-all duration-300 ease-in-out px-4 py-1.5 rounded-full text-sm w-fit"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AboutModal;
