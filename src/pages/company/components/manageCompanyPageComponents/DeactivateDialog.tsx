import React, { useState } from 'react';
import { IoGlobeOutline } from 'react-icons/io5';
import { MdOutlineSearch } from 'react-icons/md';
import { FaUserGroup } from 'react-icons/fa6';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';
import { toast } from 'sonner';
import { deactivateCompanyPage } from '@/endpoints/company';
import { useNavigate } from 'react-router-dom';

interface DeactivatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string;
  companyName?: string;
}

const DeactivatePageDialog: React.FC<DeactivatePageDialogProps> = ({ 
  open, 
  onOpenChange, 
  companyId,
  companyName
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const navigate = useNavigate();

  // Function to handle the deactivation process
  const handleDeactivate = async () => {
    if (!companyId) {
      toast.error('Company ID is missing');
      return;
    }

    if (!confirmChecked) {
      toast.error('Please confirm that you understand the implications of deactivating the page');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Use the company service to deactivate the page
      await deactivateCompanyPage(companyId);

      setIsSubmitting(false);
      onOpenChange(false);

      // Show success message using toast
      toast.success(companyName 
        ? `${companyName} page has been deactivated successfully` 
        : 'Company page has been deactivated successfully');
      
      // Redirect to company listings or home page
      setTimeout(() => {
        navigate('/jobs'); 
      }, 1500);

    } catch (error: any) {
      setIsSubmitting(false);
      console.error('Failed to deactivate company page:', error);
      toast.error(error.message || 'Failed to deactivate company page');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen || !isSubmitting) {
        onOpenChange(newOpen);
        // Reset state when dialog closes
        if (!newOpen) {
          setConfirmChecked(false);
        }
      }
    }}>
      <DialogContent className="w-full max-w-md p-0">
        <DialogHeader className="px-4 py-3 border-b border-gray-200">
          <DialogTitle>Deactivate Page</DialogTitle>
        </DialogHeader>
        
        <div className="px-4 py-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">We're sorry to see you go</h2>
            <p className="text-gray-600">
              Deactivating will remove the page entirely from LinkUp. Once deactivated, you and other
              admins will no longer have access to the Page.
            </p>
            <a href="#" className="text-blue-600 font-medium mt-1 inline-block">Learn more</a>
          </div>
          
          <div className="mb-5">
            <h3 className="font-medium mb-2">You and other admins will lose access to...</h3>
            
            <div className="space-y-3">
              {/* Page URL */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <IoGlobeOutline className="w-5 h-5 text-gray-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Page URL</h4>
                  <p className="text-sm text-gray-600">This URL will not be able to be repurposed for a new Page.</p>
                </div>
              </div>
              
              {/* Search listings */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <MdOutlineSearch className="w-5 h-5 text-gray-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Search listings</h4>
                  <p className="text-sm text-gray-600">This Page will no longer be listed on search results on LinkedIn.</p>
                </div>
              </div>
              
              {/* Employee associations */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaUserGroup className="w-5 h-5 text-gray-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Employee associations</h4>
                  <p className="text-sm text-gray-600">All existing employee associations for this Page will be removed.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-5">
            <label className="flex items-start">
              <input 
                type="checkbox" 
                className="mt-1 mr-2" 
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
              />
              <span className="text-sm">
                By clicking Deactivate, I confirm that I understand the implications of deactivating the Page.
              </span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={isSubmitting || !confirmChecked}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Deactivating...' : 'Deactivate'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivatePageDialog;