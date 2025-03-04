import { FaUsers, FaUserPlus, FaLayerGroup, FaCalendarAlt, FaFileAlt, FaNewspaper } from "react-icons/fa";

const ManageMyNetwork = () => {
  const networkOptions = [
    { label: "Connections", count: 0, icon: <FaUsers /> },
    { label: "Following & followers", count: 0, icon: <FaUserPlus /> },
    { label: "Groups", count: 0, icon: <FaLayerGroup /> },
    { label: "Events", count: 0, icon: <FaCalendarAlt /> },
    { label: "Pages", count: 0, icon: <FaFileAlt /> },
    { label: "Newsletters", count: 0, icon: <FaNewspaper /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manage my network</h2>
      <ul>
        {networkOptions.map((option, index) => (
          <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 dark:text-gray-300">{option.icon}</span>
              <span className="text-gray-900 dark:text-white">{option.label}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">{option.count}</span>
          </li>
        ))}
      </ul>
      
       <div className="mt-4 cursor-pointer">
        <img
          src="see_who's_hiring.png"
          alt="Promotional Banner"
          className="rounded-lg shadow-lg w-full object-cover"
        />
      </div>

      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center space-y-2">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Help Center</a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Privacy & Terms</a>
          <a href="#" className="hover:underline">Ad Choices</a>
          <a href="#" className="hover:underline">Advertising</a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Business Services</a>
          <a href="#" className="hover:underline">Get the LinkUp app</a>
        </div>
        <p className="mt-2 text-xs">LinkUp Corporation © 2025</p>
      </div>
    </div>
  );
};

export default ManageMyNetwork;
