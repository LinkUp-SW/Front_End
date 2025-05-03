// components/hoc/WithAdminPanel.tsx
import { ComponentType, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFlag,
  
  FiBarChart2,
  FiUsers,
 
} from "react-icons/fi";
import AuthMiddleware from "./AuthMiddleware";
import Cookies from "js-cookie";

const WithAdminPanel = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const AdminPanelLayout = (props: P) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const userType = Cookies.get("linkup_user_type");

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };

    const menuItems = [
      {
        name: "Dashboard",
        icon: <FiHome size={20} />,
        path: "/admin/dashboard",
      },
      {
        name: "Content Moderation",
        icon: <FiFlag size={20} />,
        path: "/admin/content-moderation",
      },
      
      {
        name: "Analytics",
        icon: <FiBarChart2 size={20} />,
        path: "/admin/analytics",
      },
      { name: "Users", icon: <FiUsers size={20} />, path: "/admin/users" },
      
    ];

    const handleTabClick = (path: string) => {
      navigate(path, { replace: true });
      setIsOpen(false);
    };

    if (userType !== "admin") return null;

    return (
      <AuthMiddleware>
        <div className="flex h-screen overflow-hidden">
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
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin/dashboard" &&
                    location.pathname.startsWith(item.path));
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

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen overflow-auto transition-all duration-500">
            {/* Mobile Topbar */}
            <div className="md:hidden flex items-center gap-4 mb-6">
              <button
                onClick={toggleSidebar}
                className="text-gray-700 dark:text-white focus:outline-none text-2xl"
              >
                ☰
              </button>
              {location.pathname === "/admin/dashboard" && (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
              )}
            </div>

            {/* Wrapped Component */}
            <WrappedComponent {...props} />
          </div>
        </div>
      </AuthMiddleware>
    );
  };

  return AdminPanelLayout;
};

export default WithAdminPanel;
