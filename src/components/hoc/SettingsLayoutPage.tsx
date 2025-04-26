import React, { useState, ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Icons 
import { FaUser, FaLock, FaEye, FaShieldAlt, FaBullhorn, FaBell } from 'react-icons/fa';

interface SettingsLayoutPageProps {
  children?: ReactNode;
}

const SETTING_MENU_ITEMS = [
  { id: 'account', icon: <FaUser />, label: 'Account preferences', path: '/settings/preference' },
  { id: 'security', icon: <FaLock />, label: 'Sign in & security', path: '/settings/security' },
  { id: 'visibility', icon: <FaEye />, label: 'Visibility', path: '/settings/visibility' },
  { id: 'privacy', icon: <FaShieldAlt />, label: 'Data privacy', path: '/settings/privacy' },
  { id: 'advertising', icon: <FaBullhorn />, label: 'Advertising data', path: '/settings/advertising' },
  { id: 'notifications', icon: <FaBell />, label: 'Notifications', path: '/settings/notifications' },
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
    <div className="font-sans bg-[#f3f2ef] min-h-screen flex flex-col relative">
      {/* LinkedIn Header */}
      <header className="bg-white h-14 border-b border-gray-200 flex justify-between items-center px-6 sticky top-0 z-10">
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
        <div>
          <img 
            src="/profile-image.png" 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/30x30?text=P';
            }}
          />
        </div>
      </header>

      {/* Main content area with padding bottom for footer */}
      <div className="flex w-full mx-0 px-0 py-0 mb-16">
        {/* Sidebar */}
        <div className="w-72 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 ml-0">
          <div className="p-4 flex items-center gap-3">
            <h2 className="text-3xl font-semibold m-0 text-center">Settings</h2>
          </div>

          <nav className="pb-4">
            <ul className="list-none p-0 m-0">
              {SETTING_MENU_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center py-6 px-5 cursor-pointer transition-colors ${
                    activeSettings === item.id 
                      ? 'text-green-700 font-semibold relative before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-700' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleMenuClick(item.id, item.path)}
                >
                  <span className="mr-3 flex items-center justify-center w-5 h-5 text-lg">
                    {item.icon}
                  </span>
                  <span className="text-xl">{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 ml-4 mt-4 flex flex-col">
          {children}
        </div>
      </div>

      {/* Footer Links - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-10">
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-x-6">
          <a href="/help" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            Help Center
          </a>
          <a href="/community-policies" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            Professional Community Policies
          </a>
          <a href="/privacy" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            Privacy Policy
          </a>
          <a href="/accessibility" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            Accessibility
          </a>
          <a href="/transparency" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            Recommendation Transparency
          </a>
          <a href="/agreement" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            User Agreement
          </a>
          <a href="/eula" className="text-gray-500 text-sm hover:text-[#0a66c2] hover:underline">
            End User License Agreement
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayoutPage;