import React, { useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import DeactivatePageDialog from './DeactivateDialog';

interface SettingsComponentProps {
  companyName?: string;
  companyId?: string;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({ companyName = "Your Company", companyId }) => {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-4">
          {/* Manage admins */}
          <div className="border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Manage admins</h2>
                <p className="text-gray-600 mt-1">Control who manages your page</p>
              </div>
              <div className="text-gray-400">
                <MdOutlineKeyboardArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          {/* Manage restricted members */}
          <div className="border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Manage restricted members</h2>
                <p className="text-gray-600 mt-1">See all the restricted members</p>
              </div>
              <div className="text-gray-400">
                <MdOutlineKeyboardArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          {/* Manage following */}
          <div className="border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Manage following</h2>
                <p className="text-gray-600 mt-1">See all the pages your page follows</p>
              </div>
              <div className="text-gray-400">
                <MdOutlineKeyboardArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          {/* Deactivate page */}
          <div 
            className="border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setDeactivateDialogOpen(true)}
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Deactivate page</h2>
                <p className="text-gray-600 mt-1">Take your page down</p>
              </div>
              <div className="text-gray-400">
                <MdOutlineKeyboardArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
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