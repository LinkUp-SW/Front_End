import React, { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Follower, getBlockedFollowers, unblockFollower } from '@/endpoints/company';
import { toast } from 'sonner';
import ConfirmationDialog from './ConfirmationDialog';

interface BlockedFollowersManagementProps {
  companyId: string;
  companyName: string;
  onBack: () => void;
  onFollowerUnblocked?: () => void; // New prop to notify parent component
}

const BlockedFollowersManagement: React.FC<BlockedFollowersManagementProps> = ({ 
  companyId, 
  companyName, 
  onBack,
  onFollowerUnblocked
}) => {
  const [blockedFollowers, setBlockedFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnblocking, setIsUnblocking] = useState<boolean>(false);
  const [selectedFollowerId, setSelectedFollowerId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const fetchBlockedFollowers = async () => {
    try {
      setIsLoading(true);
      const response = await getBlockedFollowers(companyId);
      
      // We expect the response to have blocked_followers property
      if (response && 'blocked_followers' in response && Array.isArray(response.blocked_followers)) {
        setBlockedFollowers(response.blocked_followers);
      } else {
        // If we get an unexpected response format, set an empty array
        setBlockedFollowers([]);
      }
      
      setError(null);
    } catch (error) {
      setError('Failed to load blocked members. Please try again later.');
      console.error('Error fetching blocked followers:', error);
      // Ensure we have an empty array in case of error
      setBlockedFollowers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchBlockedFollowers();
    }
  }, [companyId]);

  const openUnblockConfirmation = (followerId: string) => {
    setSelectedFollowerId(followerId);
    setConfirmDialogOpen(true);
  };

  const handleUnblockFollower = async () => {
    if (!selectedFollowerId) return;
    
    try {
      setIsUnblocking(true);
      
      // Call the API to unblock the follower
      await unblockFollower(companyId, selectedFollowerId);
      
      // Remove the unblocked follower from the list
      setBlockedFollowers(blockedFollowers.filter(follower => follower._id !== selectedFollowerId));
      
      // Notify parent component about follower count change
      if (onFollowerUnblocked) {
        onFollowerUnblocked();
      }
      
      // Show success message
      toast.success("Member has been unblocked successfully");
      
      // Close the dialog
      setConfirmDialogOpen(false);
      setSelectedFollowerId(null);
    } catch (error) {
      toast.error('Failed to unblock member. Please try again.');
      console.error('Error unblocking follower:', error);
    } finally {
      setIsUnblocking(false);
    }
  };

  // Find the follower name for the confirmation dialog
  const getSelectedFollowerName = () => {
    const follower = blockedFollowers.find(f => f._id === selectedFollowerId);
    if (!follower || !follower.bio) return "this member";
    return `${follower.bio.first_name || 'Unknown'} ${follower.bio.last_name || ''}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 dark:shadow-gray-800 w-full max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <MdArrowBack className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Blocked Members - {companyName}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
          <button 
            className="ml-2 text-red-900 underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading blocked members...</p>
        </div>
      ) : !blockedFollowers || blockedFollowers.length === 0 ? (
        <div className="text-center py-6 text-gray-600 dark:text-gray-400">
          No blocked members found for this company.
        </div>
      ) : (
        <div className="space-y-4">
          {blockedFollowers.map((follower) => {
            // Skip rendering if follower doesn't have required data
            if (!follower || !follower._id) {
              return null;
            }
            
            // Safely extract bio data with defaults
            const firstName = follower.bio?.first_name || 'Unknown';
            const lastName = follower.bio?.last_name || '';
            const headline = follower.bio?.headline || 'No headline';
            
            return (
              <div 
                key={follower._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {follower.profile_photo ? (
                    <img 
                      src={follower.profile_photo} 
                      alt={`${firstName} ${lastName}`} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      {firstName[0]}{lastName[0] || ''}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {headline}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openUnblockConfirmation(follower._id)}
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm transition-colors duration-200"
                >
                  Unblock
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Unblock Member"
        message={`Are you sure you want to unblock ${getSelectedFollowerName()}? They will be able to follow your company page and see your company's updates again.`}
        confirmText="Unblock"
        confirmButtonClass="bg-green-600 hover:bg-green-700 text-white"
        isSubmitting={isUnblocking}
        onConfirm={handleUnblockFollower}
      />
    </div>
  );
};

export default BlockedFollowersManagement;