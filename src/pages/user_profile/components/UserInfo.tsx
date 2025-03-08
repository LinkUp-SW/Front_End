import { useDispatch } from "react-redux";
import { handleOpenModalType } from "../../../utils";

const UserInfo = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(handleOpenModalType('add_profile_section')); // Dispatch a string identifier or an object with modal details
  };
  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-200">
        <img
          src="https://dummyimage.com/1600x400"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Avatar */}
        <div className="absolute -bottom-16 left-4">
          <img
            src="https://dummyimage.com/128x128"
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-6 pb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Youssef Afify
          </h1>
          <p className="text-gray-600 dark:text-gray-200">
            Front-End Developer | Senior Biomedical and Data Engineer at Cairo
            University
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">
            Cairo, Cairo, Egypt •{" "}
            <span className="text-blue-600 font-semibold dark:text-blue-400 ">
              Contact Info
            </span>
          </p>
          <p className="text-blue-600 font-semibold dark:text-blue-400">
            224 connections
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex max-w-xl flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 flex-grow text-white cursor-pointer hover:bg-blue-800 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
            Open to work
          </button>
          <button onClick={handleOpenModal} className=" border-blue-600 flex-grow text-blue-600 font-semibold border-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm ">
            Add profile section
          </button>
          <button className=" border-blue-600 flex-grow text-blue-600 font-semibold border-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm ">
            Enhance Profile
          </button>
          <button className="border border-gray-300 flex-grow cursor-pointer hover:bg-gray-200 dark:hover:text-black transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
            Resources
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-500 dark:text-gray-200 space-y-1">
          <p>Study at Cairo University (ja.ali.lui@cairo.edu)</p>
          <p>Contact information</p>
        </div>
      </div>
    </section>
  );
};

export default UserInfo;
