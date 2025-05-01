import React, { useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import DeactivatePageDialog from './DeactivateDialog';
import AdminManagement from './AdminsManagement';
import FollowersManagement from './FollowersManagement';
import BlockedFollowersManagement from './BlockedUsersManagement';

interface SettingsComponentProps {
  companyName?: string;
  companyId?: string;
  followerCount?: number;
  onFollowerCountChange?: (newCount: number) => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({ 
  companyName = "Your Company", 
  companyId = "",
  followerCount = 0,
  onFollowerCountChange
}) => {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'settings' | 'admins' | 'followers' | 'restricted'>('settings');

  const settingsItems = [
    {
      id: "manage-admins",
      title: "Manage admins",
      description: "Control who manages your page",
      onClick: () => setCurrentView('admins')
    },
    {
      id: "manage-followers",
      title: "Manage followers",
      description: "See all the followers of your page",
      onClick: () => setCurrentView('followers')
    },
    {
      id: "manage-restricted-members",
      title: "Manage restricted members",
      description: "See all the restricted members",
      onClick: () => setCurrentView('restricted')
    },
    {
      id: "deactivate-page",
      title: "Deactivate page",
      description: "Take your page down",
      onClick: () => setDeactivateDialogOpen(true)
    }
  ];

  // Handle when follower is blocked
  const handleFollowerBlocked = () => {
    if (onFollowerCountChange && followerCount > 0) {
      onFollowerCountChange(followerCount - 1);
    }
  };

  // Handle when follower is unblocked
  const handleFollowerUnblocked = () => {
    if (onFollowerCountChange) {
      onFollowerCountChange(followerCount + 1);
    }
  };

  // Handle different views
  if (currentView === 'admins') {
    return (
      <AdminManagement 
        companyId={companyId} 
        companyName={companyName}
        onBack={() => setCurrentView('settings')}
      />
    );
  }

  if (currentView === 'followers') {
    return (
      <FollowersManagement 
        companyId={companyId} 
        companyName={companyName}
        onBack={() => setCurrentView('settings')}
        onFollowerBlocked={handleFollowerBlocked}
      />
    );
  }

  if (currentView === 'restricted') {
    return (
      <BlockedFollowersManagement 
        companyId={companyId} 
        companyName={companyName}
        onBack={() => setCurrentView('settings')}
        onFollowerUnblocked={handleFollowerUnblocked}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 dark:shadow-gray-800 w-full max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">Settings</h1>

        <div className="space-y-3 sm:space-y-4">
          {settingsItems.map((item, index) => (
            <div 
              key={index}
              id={item.id}
              onClick={item.onClick}
              className="border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-center justify-between p-3 sm:p-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">{item.description}</p>
                </div>
                <div className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                  <MdOutlineKeyboardArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deactivate Dialog */}
      <DeactivatePageDialog 
        open={deactivateDialogOpen} 
        onOpenChange={setDeactivateDialogOpen}
        companyId={companyId}
        companyName={companyName}
      />
    </div>
  );
};

export default SettingsComponent;