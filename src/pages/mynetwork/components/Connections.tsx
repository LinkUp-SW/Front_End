import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { WithNavBar } from "../../../components";

interface Connection {
  name: string;
  title: string;
  date: string;
  image: string;
}

const connections: Connection[] = [
  { name: "John Doe", title: "Software Engineer at Google", date: "March 5, 2025", image: "/images/john_doe.jpg" },
  { name: "Jane Smith", title: "Data Scientist at Facebook", date: "March 3, 2025", image: "/images/jane_smith.jpg" },
  { name: "Robert Johnson", title: "Product Manager at Amazon", date: "March 1, 2025", image: "/images/robert_johnson.jpg" },
  { name: "Emily Davis", title: "UX Designer at Apple", date: "February 27, 2025", image: "/images/emily_davis.jpg" },
  { name: "Michael Wilson", title: "Cybersecurity Analyst at Microsoft", date: "February 25, 2025", image: "/images/michael_wilson.jpg" },
];

const Connections: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Section - Connections List */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">My Connections</h2>

        {/* Search Bar */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          {connections
            .filter((conn) => conn.name.toLowerCase().includes(search.toLowerCase()))
            .map((conn, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img src={conn.image} alt={conn.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{conn.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{conn.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Connected on {conn.date}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md">
                  Message
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Right Section - Ad Image & Footer */}
      <div className="hidden lg:flex flex-col items-center w-1/4 p-6 bg-white dark:bg-gray-800 ">
        <img src="/src/assets/see_who's_hiring.png" alt="Ad" className="w-full rounded-lg mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">About | Accessibility | Help Center | Privacy & Terms | Ad Choices | Business Services</p>
      </div>
    </div>
  );
};

export default WithNavBar(Connections);
