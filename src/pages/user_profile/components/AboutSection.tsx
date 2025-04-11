import { BsPencil } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import AboutModal from "./modals/about_modal/AboutModal";
import Header from "./modals/components/Header";

const AboutSection = () => {
  return (
    <section
      id="about-section"
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
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
            className="!max-w-5xl md:!w-[43.5rem] !w-full border-2"
          >
            <DialogHeader id="about-section-dialog-header">
              <DialogTitle id="about-section-dialog-title">
                <Header title="Edit About" />
              </DialogTitle>
              <DialogDescription
                id="about-section-dialog-description"
                className="text-sm text-gray-500 dark:text-gray-300"
              >
                You can write about your years of experience, industry, or
                skills. People also talk about their achievements or previous
                job experiences.
              </DialogDescription>
            </DialogHeader>
            <AboutModal />
          </DialogContent>
        </Dialog>
      </header>
      <p
        id="about-section-paragraph"
        className="text-gray-600 dark:text-gray-300"
      >
        I am an ambitious junior at Cairo University, pursuing a Bachelor's
        degree in Biomedical Data Engineering set to graduate.
      </p>
    </section>
  );
};

export default AboutSection;
