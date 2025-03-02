import { BsPencil } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { openModal } from "../../../slices/modal/modalSlice";
import React, { useEffect, useState } from "react";

const AboutSection = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(openModal(<AboutModal />));
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-black dark:text-white font-bold">About</h2>
        <button
          onClick={handleOpenModal}
          id="edit-button"
          className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out"
        >
          <span className="hidden">edit button</span>
          <BsPencil size={20} />
        </button>
      </header>
      <p className="text-gray-600 dark:text-gray-300">
        I am an ambitious junior at Cairo University, pursuing a Bachelor's
        degree in Biomedical Data Engineering set to graduate.
      </p>
    </section>
  );
};

export default AboutSection;

const AboutModal = () => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [aboutText, setAboutText] = useState<string>("");
  function handleAboutText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAboutText(e.target.value);
  }

  useEffect(() => {
    setWordCount(aboutText.length);
  }, [aboutText]);

  return (
    <div className="max-w-5xl md:w-[40rem] w-full ">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-semibold ">Edit About</h2>
        <div className="w-full bg-gray-800 dark:bg-gray-300 h-[0.1rem] rounded-2xl " />
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
    </div>
  );
};
