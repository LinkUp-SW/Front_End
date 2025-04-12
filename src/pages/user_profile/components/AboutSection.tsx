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
import { Link, useParams } from "react-router-dom";
import AboutModal from "./modals/about_modal/AboutModal";
import Header from "./modals/components/Header";
import { IoDiamond } from "react-icons/io5";
import { IoMdAdd, IoMdArrowDropright } from "react-icons/io";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { getUserAbout } from "@/endpoints/userProfile";
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/utils/errorHandler";
import { About } from "@/types";
import AddAboutModal from "./modals/about_modal/AddAboutModal";

const AboutSection = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const { data, loading, error } = useFetchData(() =>
    authToken && id ? getUserAbout(authToken, id) : Promise.resolve(null)
  );
  const [aboutData, setAboutData] = useState<About>({
    about: "",
    skills: [],
  });
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setAboutData({
      about: data?.about?.about || "",
      skills: data?.about?.skills || [],
    });
  }, [data]);

  if (loading) return <AboutSectionSkeleton />;

  if (error) {
    return (
      <section
        id="about-section-error"
        className="bg-white space-y-3 dark:bg-gray-900 p-6 rounded-lg shadow flex items-center justify-center"
      >
        <p className="text-red-600 dark:text-red-400 text-left">
          Oops! We encountered an error loading your profile information. Please
          try again later. Error Reason:{" "}
          <span className="underline font-semibold">
            {getErrorMessage(error)}
          </span>
        </p>
      </section>
    );
  }

  if (!data || (!data.is_me && !data.about.about)) return null;

  if (data.is_me && !aboutData.about)
    return <EmptyAboutSection setAboutData={setAboutData} setIsOpenModal={setIsOpenModal} isOpenModal={isOpenModal} isOwner={data.is_me} />;

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
        {data.is_me && (
          <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
            <DialogTrigger asChild>
              <button
                id="about-section-edit-button"
                disabled={!data.is_me}
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
                You can write about your years of experience, industry, or
                skills. People also talk about their achievements or previous
                job experiences.
              </DialogDescription>
              <AboutModal
              setIsOpenModal={setIsOpenModal}
                setAboutData={setAboutData}
                fetchedSkills={aboutData.skills}
                description={aboutData.about}
              />
            </DialogContent>
          </Dialog>
        )}
      </header>
      <TruncatedText id="about-section-paragraph" content={aboutData.about} />
      {aboutData.skills.length !== 0 && (
        <Link
          to={"#skills-section"}
          className="group min-h-5 border relative flex flex-col rounded-md p-2 transition-colors duration-200
    hover:bg-gray-100 hover:text-gray-700  
    dark:hover:bg-gray-300 dark:hover:text-gray-800  
    dark:border-gray-600 border-gray-200  
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
            {aboutData.skills.slice(0, 2).map((skill, idx) => (
              <span key={idx}>
                {skill}
                {idx < aboutData.skills.slice(0, 2).length - 1 && ","}
              </span>
            ))}
            {aboutData.skills.length > 2 && (
              <span> and +{aboutData.skills.length - 2} more</span>
            )}
          </p>
          <button className="absolute right-0 top-[1.1rem]">
            <span className="sr-only">Go To Skills</span>
            <IoMdArrowDropright
              size={30}
              className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-800"
            />
          </button>
        </Link>
      )}
    </section>
  );
};

// Accept a prop to determine if the current user is the profile owner.
const EmptyAboutSection = ({ isOwner = false, isOpenModal, setIsOpenModal,setAboutData}:{
  isOwner:boolean,
  isOpenModal:boolean,
  setIsOpenModal:(isOpenModal:boolean)=>void,
  setAboutData:(aboutData:About)=>void
}) => {
  return (
    <section
      id="about-section"
      className="bg-white space-y-3 dark:bg-gray-900 p-6 rounded-lg shadow flex items-center justify-center"
    >
      {isOwner ? (
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
          <DialogTrigger asChild>
            <button
              id="empty-about-add-button"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <IoMdAdd size={20} />
              <span>Add About Information</span>
            </button>
          </DialogTrigger>
          <DialogContent
            id="empty-about-dialog-content"
            className="!max-w-5xl md:!w-[43.5rem] dark:bg-gray-900 dark:border-gray-600 !w-full border-2"
          >
            <DialogHeader>
              <Header title="Add About" />
            </DialogHeader>
            <AddAboutModal  setAboutData={setAboutData} setIsOpenModal={setIsOpenModal}/>
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  );
};

const AboutSectionSkeleton = () => (
  <section
    id="about-section-skeleton"
    className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow animate-pulse"
  >
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>

    {/* About Text Skeleton */}
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded max-w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded max-w-[80%]"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded max-w-[70%]"></div>
    </div>

    {/* Skills Card Skeleton */}
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md p-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>

      <div className="ml-9 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>

      <div className="absolute right-3 top-3 h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </section>
);

export default AboutSection;
