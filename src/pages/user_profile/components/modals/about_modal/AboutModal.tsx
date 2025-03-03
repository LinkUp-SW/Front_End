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

const AboutModal = () => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [aboutText, setAboutText] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([
    "Web Development",
    "Data Analysis",
    "Machine Learning",
    "UI/UX Design",
    "Backend Development",
  ]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // refs to store the DOM nodes and their positions
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const positions = useRef<Map<string, DOMRect>>(new Map());

  // Measure and store positions of each list item
  const measurePositions = () => {
    skills.forEach((skill) => {
      const el = itemRefs.current.get(skill);
      if (el) {
        positions.current.set(skill, el.getBoundingClientRect());
      }
    });
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
          // Calculate the vertical displacement
          const deltaY = oldRect.top - newRect.top;
          if (deltaY !== 0) {
            // Apply the inverse transform to start from the previous position
            el.style.transform = `translateY(${deltaY}px)`;
            el.style.transition = "transform 0s";

            // Force a reflow so that the starting transform is applied
            el.getBoundingClientRect();

            // Animate back to the new position
            el.style.transition = "transform 300ms ease";
            el.style.transform = "";
          }
        }
      }
    });
    // Update stored positions for future animations
    measurePositions();
  }, [skills]);

  function handleAboutText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAboutText(e.target.value);
  }

  // Drag handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    index: number
  ) => {
    setDraggingIndex(index);
    e.dataTransfer.setData("draggedItemIndex", index.toString());
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    // Remove the dragging class from the element using the imported styles
    e.currentTarget.classList.remove(styles.dragging);
    setDraggingIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    // Measure positions before state update for FLIP
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

  return (
    <div className="max-w-5xl md:w-[40rem] w-full">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-semibold">Edit About</h2>
        <div className="w-full bg-gray-800 dark:bg-gray-300 h-[0.1rem] rounded-2xl" />
      </div>
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
        <ul className="grid gap-2 py-2" onDragOver={handleDragOver}>
          {skills.map((skill, index) => (
            <Fragment key={skill}>
              <li
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(skill, el);
                  }
                }}
                className={`inline-flex text-lg w-full py-2 items-center justify-between ${styles["draggable-item"]} ${
                  draggingIndex === index ? styles.dragging : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={(e) => handleDragEnd(e)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <span className="inline-flex gap-2 items-center">
                  <span className="cursor-pointer hover:bg-gray-300 hover:text-black rounded-full p-[0.15rem] transition-all duration-300 ease-in-out">
                    <IoMdClose />
                  </span>
                  <span>{skill}</span>
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
      </section>
    </div>
  );
};

export default AboutModal;
