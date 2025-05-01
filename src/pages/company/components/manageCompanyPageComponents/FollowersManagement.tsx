import React, { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Follower, getCompanyFollowers, blockFollower } from '@/endpoints/company';
import { toast } from 'sonner';
import ConfirmationDialog from './ConfirmationDialog';

interface FollowersManagementProps {
  companyId: string;
  companyName: string;
  onBack: () => void;
  onFollowerBlocked?: () => void; 
}

const FollowersManagement: React.FC<FollowersManagementProps> = ({ 
  companyId, 
  companyName, 
  onBack,
  onFollowerBlocked 
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [selectedFollowerId, setSelectedFollowerId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsLoading(true);
        const response = await getCompanyFollowers(companyId);
        setFollowers(response.followers);
        setError(null);
      } catch (error) {
        setError('Failed to load followers. Please try again later.');
        console.error('Error fetching followers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchFollowers();
    }
  }, [companyId]);

  const openBlockConfirmation = (followerId: string) => {
    setSelectedFollowerId(followerId);
    setConfirmDialogOpen(true);
  };

  const handleBlockFollower = async () => {
    if (!selectedFollowerId) return;
    
    try {
      setIsBlocking(true);
      await blockFollower(companyId, selectedFollowerId);
      
      // Remove the blocked follower from the list
      setFollowers(followers.filter(follower => follower._id !== selectedFollowerId));
      
      // Notify parent component about follower count change
      if (onFollowerBlocked) {
        onFollowerBlocked();
      }
      
      // Show success message
      toast.success("Follower has been blocked successfully");
      
      // Close the dialog
      setConfirmDialogOpen(false);
      setSelectedFollowerId(null);
    } catch (error) {
      toast.error("Failed to block follower. Please try again.");
      console.error('Error blocking follower:', error);
    } finally {
      setIsBlocking(false);
    }
  };

  // Find the follower name for the confirmation dialog
  const getSelectedFollowerName = () => {
    const follower = followers.find(f => f._id === selectedFollowerId);
    return follower ? `${follower.bio.first_name} ${follower.bio.last_name}` : "this follower";
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
        <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Followers - {companyName}</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading followers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500 dark:text-red-400">{error}</div>
      ) : followers.length === 0 ? (
        <div className="text-center py-6 text-gray-600 dark:text-gray-400">
          No followers found for this company.
        </div>
      ) : (
        <div className="space-y-4">
          {followers.map((follower) => (
            <div 
              key={follower._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {follower.profile_photo ? (
                  <img 
                    src={follower.profile_photo} 
                    alt={`${follower.bio.first_name} ${follower.bio.last_name}`} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    {follower.bio.first_name[0]}{follower.bio.last_name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {follower.bio.first_name} {follower.bio.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {follower.bio.headline || 'No headline'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openBlockConfirmation(follower._id)}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors duration-200"
              >
                Block
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Block Follower"
        message={`Are you sure you want to block ${getSelectedFollowerName()}? They will no longer be able to follow your company page or see your company's updates.`}
        confirmText="Block"
        isSubmitting={isBlocking}
        onConfirm={handleBlockFollower}
      />
    </div>
  );
};

export default FollowersManagement;