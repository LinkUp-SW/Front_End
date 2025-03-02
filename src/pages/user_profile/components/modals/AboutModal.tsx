import React, { useEffect, useState } from "react";

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

export default AboutModal;
