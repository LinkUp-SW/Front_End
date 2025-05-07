import React, { useState, ReactNode, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AuthMiddleware from "./AuthMiddleware";
import { TbPremiumRights } from "react-icons/tb";
import linkupLogo from '@/assets/link_up.png'

interface SettingsLayoutPageProps {
  children?: ReactNode;
}

const SETTING_MENU_ITEMS = [
  {
    id: "account",
    icon: <FaUser />,
    label: "Account preferences",
    path: "/settings/preference",
  },
  {
    id: "security",
    icon: <FaLock />,
    label: "Sign in & security",
    path: "/settings/security",
  },
  {
    id: "visibility",
    icon: <FaEye />,
    label: "Visibility",
    path: "/settings/visibility",
  },
  {
    id: "billing",
    icon: <TbPremiumRights />,
    label: "Subscription & Billing",
    path: "/settings/subscription-billing",
  },
];

const SettingsLayoutPage: React.FC<SettingsLayoutPageProps> = ({
  children,
}) => {
  const [activeSettings, setActiveSettings] = useState<string>("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const width = useSelector((state: RootState) => state.screen.width);

  // Sync active menu with URL
  useEffect(() => {
    const currentPath = location.pathname;
    const matching = SETTING_MENU_ITEMS.find(
      (item) =>
        currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
    if (matching) setActiveSettings(matching.id);
  }, [location.pathname]);

  useEffect(() => {
    setSidebarOpen((prev) => (width >= 768 ? false : prev));
  }, [width]);

  const handleMenuClick = (id: string, path: string) => {
    setActiveSettings(id);
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <AuthMiddleware>
      <div className="font-sans bg-[#f3f2ef] dark:bg-[#111827] min-h-screen flex flex-col relative text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
        {/* Header */}
        <header className="bg-white dark:bg-[#111827] h-14 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] flex justify-between items-center px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Burger icon on small screens */}
            <button
              className="md:hidden text-xl"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            {/* Logo */}
            <Link to="/">
              <img
                src={linkupLogo}
                alt="LinkUp"
                className="h-8 dark:invert"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/100x34?text=LinkedIn+Logo";
                }}
              />
            </Link>
          </div>
        </header>

        <div className="flex w-full flex-1">
          {/* Overlay when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0  z-10 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`bg-white dark:bg-[#1F2937] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] overflow-auto transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:static md:flex-shrink-0 md:w-72 rounded-tr-lg rounded-br-lg md:flex md:flex-col z-20 fixed top-14 bottom-0 w-64`}
          >
            <div className="p-4 flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
                Settings
              </h2>
            </div>
            <nav className="pb-4 flex-1">
              <ul className="list-none p-0 m-0">
                {SETTING_MENU_ITEMS.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center py-6 px-5 cursor-pointer transition-colors relative space-x-3
                    ${
                      activeSettings === item.id
                        ? 'text-[#0a66c2] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#0a66c2]'
                        : "text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]"
                    }`}
                    onClick={() => handleMenuClick(item.id, item.path)}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-xl">{item.label}</span>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 mt-0 md:mt-4 relative">{children}</main>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827] border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] py-3 px-4 z-20">
          <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-x-6">
            {[
              ["Help Center", "/help"],
              ["Professional Community Policies", "/community-policies"],
              ["Privacy Policy", "/privacy"],
              ["Accessibility", "/accessibility"],
              ["Recommendation Transparency", "/transparency"],
              ["User Agreement", "/agreement"],
              ["End User License Agreement", "/eula"],
            ].map(([text, href]) => (
              <a
                key={href as string}
                href={href as string}
                className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)] text-sm hover:text-[#0a66c2] dark:hover:text-[#1d4ed8] hover:underline"
              >
                {text}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </AuthMiddleware>
  );
};

export default SettingsLayoutPage;
