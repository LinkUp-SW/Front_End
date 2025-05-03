import React, { useState, ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaEye } from 'react-icons/fa';

interface SettingsLayoutPageProps {
  children?: ReactNode;
}

const SETTING_MENU_ITEMS = [
  { id: 'account', icon: <FaUser />, label: 'Account preferences', path: '/settings/preference' },
  { id: 'security', icon: <FaLock />, label: 'Sign in & security', path: '/settings/security' },
  { id: 'visibility', icon: <FaEye />, label: 'Visibility', path: '/settings/visibility' },
];

const SettingsLayoutPage: React.FC<SettingsLayoutPageProps> = ({ children }) => {
  const [activeSettings, setActiveSettings] = useState<string>('account');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = SETTING_MENU_ITEMS.find(item =>
      currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
    if (matchingItem) {
      setActiveSettings(matchingItem.id);
    }
  }, [location.pathname]);

  const handleMenuClick = (id: string, path: string) => {
    setActiveSettings(id);
    navigate(path);
  };

  return (
    <div className="font-sans bg-[#f3f2ef] dark:bg-[#111827] min-h-screen flex flex-col relative text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
      <header className="bg-white dark:bg-[#111827] h-14 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] flex justify-between items-center px-6 sticky top-0 z-10">
        <div className="logo">
          <Link to="/">
            <img
              src="/src/assets/link_up.png"
              alt="LinkUp"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/100x34?text=LinkedIn+Logo';
              }}
            />
          </Link>
        </div>
      </header>

      <div className="flex w-full mx-0 px-0 py-0 mb-16">
        <div className="w-72 bg-white dark:bg-[#1F2937] rounded-lg border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] overflow-hidden flex-shrink-0 ml-0">
          <div className="p-4 flex items-center gap-3">
            <h2 className="text-3xl font-semibold text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
              Settings
            </h2>
          </div>
          <nav className="pb-4">
            <ul className="list-none p-0 m-0">
              {SETTING_MENU_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center py-6 px-5 cursor-pointer transition-colors relative ${
                    activeSettings === item.id
                      ? 'text-[#0a66c2] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#0a66c2]'
                      : 'text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]'
                  }`}
                  onClick={() => handleMenuClick(item.id, item.path)}
                >
                  <span className="mr-3 w-5 h-5 flex items-center justify-center text-lg">
                    {item.icon}
                  </span>
                  <span className="text-xl">{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex-1 ml-4 mt-4 flex flex-col">
          {children}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827] border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] py-3 px-4 z-10">
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-x-6">
          {[
            ['Help Center', '/help'],
            ['Professional Community Policies', '/community-policies'],
            ['Privacy Policy', '/privacy'],
            ['Accessibility', '/accessibility'],
            ['Recommendation Transparency', '/transparency'],
            ['User Agreement', '/agreement'],
            ['End User License Agreement', '/eula']
          ].map(([text, href]) => (
            <a
              key={href}
              href={href}
              className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)] text-sm hover:text-[#0a66c2] dark:hover:text-[#1d4ed8] hover:underline"
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayoutPage;
