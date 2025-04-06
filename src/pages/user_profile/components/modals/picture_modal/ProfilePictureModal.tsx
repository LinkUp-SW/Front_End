import { FiEdit, FiCamera, FiLayout, FiTrash } from "react-icons/fi";

const ProfilePictureModal = () => {
  return (
    <div className="grid w-full place-items-center">
      {/* Profile Image Section */}
      <div className="relative group ">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-40 h-40 md:w-56 md:h-56 rounded-full ring-4 ring-gray-200 dark:ring-gray-600 transition-all duration-300"
        />
      </div>
      <div className="flex flex-grow flex-wrap w-full  items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
        <button className="flex items-center flex-grow gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
          <FiEdit className="w-5 h-5" />
          <span className="text-sm font-medium">Edit</span>
        </button>

        <button className="flex flex-grow items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200">
          <FiCamera className="w-5 h-5" />
          <span className="text-sm font-medium">Add Photo</span>
        </button>

        <button className="flex flex-grow items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200">
          <FiLayout className="w-5 h-5" />
          <span className="text-sm font-medium">Frames</span>
        </button>

        <button className="flex flex-grow items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
          <FiTrash className="w-5 h-5" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
