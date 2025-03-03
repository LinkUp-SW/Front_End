import { BsPencil } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { openModal } from "../../../slices/modal/modalSlice";

const AboutSection = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(openModal("about")); // Dispatch a string identifier or an object with modal details
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
