import { BsPencil } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TruncatedText,
} from "@/components";
import { Link } from "react-router-dom";
import AboutModal from "./modals/about_modal/AboutModal";
import Header from "./modals/components/Header";
import { IoDiamond } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";

const AboutSection = () => {
  return (
    <section
      id="about-section"
      className="bg-white space-y-3 dark:bg-gray-900 p-6 rounded-lg shadow"
    >
      <header
        id="about-section-header"
        className="flex justify-between items-center mb-4"
      >
        <h2
          id="about-section-title"
          className="text-xl text-black dark:text-white font-bold"
        >
          About
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <button
              id="about-section-edit-button"
              className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out"
            >
              <span className="hidden">edit button</span>
              <BsPencil size={20} />
            </button>
          </DialogTrigger>
          <DialogContent
            id="about-section-dialog-content"
            aria-describedby={undefined}
            className="!max-w-5xl md:!w-[43.5rem] dark:bg-gray-900 dark:border-gray-600 !w-full border-2"
          >
            <DialogTitle className="hidden"></DialogTitle>

            <DialogHeader id="about-section-dialog-header">
              <Header title="Edit About" />
            </DialogHeader>
            <DialogDescription
              id="about-section-dialog-description"
              className="text-sm text-gray-500 dark:text-gray-300"
            >
              You can write about your years of experience, industry, or skills.
              People also talk about their achievements or previous job
              experiences.
            </DialogDescription>
            <AboutModal />
          </DialogContent>
        </Dialog>
      </header>
      <TruncatedText
        id="about-section-paragraph"
        content="I am an ambitious junior at Cairo University, pursuing a Bachelor's
        degree in Biomedical Data Engineering set to graduate.
     "
      />

      <Link
        to={"#skills-section"}
        className="group min-h-5 border relative flex flex-col rounded-md p-2 transition-colors duration-200
    hover:bg-gray-100 hover:text-gray-700  // Light mode hover
    dark:hover:bg-gray-300 dark:hover:text-gray-800  // Dark mode remains same
    dark:border-gray-600 border-gray-200  // Add border colors for both modes
"
      >
        <div className="flex items-center gap-1">
          <IoDiamond
            size={23}
            className="text-gray-600 dark:text-gray-300 group-hover:text-current"
          />
          <h2 className="text-xl font-semibold">Top Skills</h2>
        </div>
        <p className="px-7 inline-flex gap-1 text-gray-600 dark:text-gray-300 group-hover:text-current">
          {[...Array(5)].slice(0, 2).map((_itm, idx) => (
            <span key={idx}>Hello, </span>
          ))}
          <span>
            {" "}
            and +{[...Array(5)].slice(2, [...Array(5)].length).length} more
          </span>
        </p>
        <button className="absolute right-0 top-[1.1rem]">
          <span className="sr-only">Go To Skills</span>
          <IoMdArrowDropright
            size={30}
            className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-800"
          />
        </button>
      </Link>
    </section>
  );
};

export default AboutSection;
