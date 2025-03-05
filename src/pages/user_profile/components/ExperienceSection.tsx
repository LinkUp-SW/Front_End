import { handleOpenModalType } from "../../../utils";
import { useDispatch } from "react-redux";
import { BsPencil } from "react-icons/bs";
import { GoPlus } from "react-icons/go";

const ExperienceSection = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(handleOpenModalType("experience")); // Dispatch a string identifier or an object with modal details
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-black dark:text-white font-bold">Experience</h2>
       <div className="flex items-center gap-2">
       <button
           onClick={handleOpenModal}
           id="edit-button"
           className="hover:bg-gray-300 dark:hover:text-black rounded-full cursor-pointer transition-all duration-200 ease-in-out"
         >
           <span className="hidden">add button</span>
           <GoPlus size={30} />
         </button>
         <button
           onClick={handleOpenModal}
           id="edit-button"
           className="hover:bg-gray-300 dark:hover:text-black p-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out"
         >
           <span className="hidden">edit button</span>
           <BsPencil size={20} />
         </button>
       </div>
      </header>
      <div className="space-y-4">
        <div className="border-l-2 border-blue-600 pl-4">
          <h3 className="font-bold">Senior Biomedical and Data Engineer</h3>
          <p className="text-gray-600 dark:text-gray-300">Cairo University</p>
          <p className="text-sm text-gray-500 dark:text-gray-200">Full-time</p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
