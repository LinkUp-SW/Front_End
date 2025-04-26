import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFlag,
  FiBriefcase,
  FiBarChart2,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

interface AdminPanelSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminPanelSidebar = ({ isOpen, toggleSidebar }: AdminPanelSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/admin-page/dashboard" },
    { name: "Content Moderation", icon: <FiFlag size={20} />, path: "/admin-page/dashboard/content-moderation" },
    { name: "Job Postings", icon: <FiBriefcase size={20} />, path: "/admin-page/dashboard/jobs-postings" },
    { name: "Analytics", icon: <FiBarChart2 size={20} />, path: "/admin-page/dashboard/analytics" },
    { name: "Users", icon: <FiUsers size={20} />, path: "/admin-page/dashboard/users" },
    { name: "Settings", icon: <FiSettings size={20} />, path: "/admin-page/dashboard/settings" },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
    toggleSidebar(); // close sidebar on mobile
  };

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 dark:text-white focus:outline-none text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="flex items-center gap-3 text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">
          <img src="/link_up_logo.png" alt="Logo" className="w-8 h-8" />
          Admin Panel
        </h2>

        <nav className="flex flex-col space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleTabClick(item.path)}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-md font-semibold transition-all duration-300 whitespace-nowrap overflow-hidden
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                  hover:scale-[1.03]
                `}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default AdminPanelSidebar;
