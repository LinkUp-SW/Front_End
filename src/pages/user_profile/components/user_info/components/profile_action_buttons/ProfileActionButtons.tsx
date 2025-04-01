import React, { useState, useMemo, useCallback } from "react";
import CustomButton from "./CustomButton";
import AddSectionModal from "./AddSectionModal";
import ResourcesPopover from "./ResourcesPopover";
import { IoCloseCircle } from "react-icons/io5";
import { CiCirclePlus, CiClock2 } from "react-icons/ci";
import { FaUserPlus, FaUserMinus, FaPaperPlane } from "react-icons/fa";

export type FollowStatus = {
  isFollowing?: boolean;
  isPending?: boolean;
  followPrimary?: boolean;
  isInConnection?: boolean;
};

export interface ProfileActionButtonsProps {
  isOwner: boolean;
  followStatus: FollowStatus;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  isOwner,
  followStatus,
}) => {
  const [localFollowStatus, setLocalFollowStatus] =
    useState<FollowStatus>(followStatus);

  const effectiveStatus = useMemo(
    () => (isOwner ? followStatus : localFollowStatus),
    [isOwner, followStatus, localFollowStatus]
  );

  // --- Follow/Connection Handlers ---
  const handleFollow = useCallback(() => {
    console.log("Follow clicked");
    setLocalFollowStatus((prev) => ({
      ...prev,
      isFollowing: true,
      isPending: false,
      isInConnection: false,
    }));
  }, []);

  const handleUnfollow = useCallback(() => {
    console.log("Unfollow clicked");
    setLocalFollowStatus((prev) => ({ ...prev, isFollowing: false }));
  }, []);

  const handleConnect = useCallback(() => {
    console.log("Connect clicked");
    setLocalFollowStatus((prev) => ({
      ...prev,
      isPending: true,
      isInConnection: false,
    }));
  }, []);

  const handleCancelRequest = useCallback(() => {
    console.log("Cancel request clicked");
    setLocalFollowStatus((prev) => ({ ...prev, isPending: false }));
  }, []);

  const handleRemoveConnection = useCallback(() => {
    console.log("Remove Connection clicked");
    setLocalFollowStatus((prev) => ({ ...prev, isInConnection: false }));
  }, []);

  // --- Other Handlers ---
  const handleMessage = useCallback(() => alert("Message clicked"), []);
  const handleBlock = useCallback(() => alert("Report/Block clicked"), []);
  const handleEnhanceProfile = useCallback(
    () => alert("Enhance Profile clicked"),
    []
  );
  const handleOpenToWork = useCallback(() => alert("Open to Work clicked"), []);
  const handleAboutProfile = useCallback(
    () => alert("About Profile clicked"),
    []
  );
  const handleViewActivity = useCallback(
    () => alert("View Activity clicked"),
    []
  );
  const handleViewBlockedUsers = useCallback(
    () => alert("View Blocked Users clicked"),
    []
  );

  if (isOwner) {
    return (
      <div className="flex max-w-xl flex-wrap gap-2 mb-4">
        <CustomButton
          id="open-to-work-button"
          variant="primary"
          onClick={handleOpenToWork}
        >
          Open to work
        </CustomButton>
        <AddSectionModal />
        <CustomButton
          id="enhance-profile-button"
          variant="secondary"
          onClick={handleEnhanceProfile}
        >
          Enhance Profile
        </CustomButton>
        <ResourcesPopover
          title="Resources"
          isOwner
          onViewActivity={handleViewActivity}
          onViewBlockedUsers={handleViewBlockedUsers}
          onAboutProfile={handleAboutProfile}
        />
      </div>
    );
  }

  return (
    <div className="flex max-w-xl flex-wrap gap-2 mb-4">
      {effectiveStatus.followPrimary ? (
        <>
          <CustomButton
            id="profile-action-follow-button"
            variant="primary"
            onClick={
              effectiveStatus.isFollowing ? handleUnfollow : handleFollow
            }
          >
            {effectiveStatus.isFollowing ? (
              <>
                <IoCloseCircle size={20} />
                Unfollow
              </>
            ) : (
              <>
                <CiCirclePlus size={20} />
                Follow
              </>
            )}
          </CustomButton>
          <CustomButton
            id="profile-action-message-button"
            variant="secondary"
            onClick={handleMessage}
          >
            <FaPaperPlane size={20} />
            Message
          </CustomButton>
        </>
      ) : (
        <>
          <CustomButton
            id="profile-action-connection-button"
            variant="primary"
            onClick={
              effectiveStatus.isPending
                ? handleCancelRequest
                : effectiveStatus.isInConnection
                ? handleRemoveConnection
                : handleConnect
            }
          >
            {effectiveStatus.isPending ? (
              <>
                <CiClock2 size={20} />
                Pending
              </>
            ) : effectiveStatus.isInConnection ? (
              <>
                <FaUserMinus size={16} />
                Remove Connection
              </>
            ) : (
              <>
                <FaUserPlus size={16} />
                Connect
              </>
            )}
          </CustomButton>
          <CustomButton
            id="profile-action-message-button"
            variant="secondary"
            onClick={handleMessage}
          >
            <FaPaperPlane size={20} />
            Message
          </CustomButton>
        </>
      )}
      <ResourcesPopover
        title="More"
        isOwner={false}
        followPrimary={effectiveStatus.followPrimary}
        isFollowing={effectiveStatus.isFollowing}
        isPendingConnection={effectiveStatus.isPending}
        isInConnection={effectiveStatus.isInConnection}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onConnect={handleConnect}
        onCancelRequest={handleCancelRequest}
        onRemoveConnection={handleRemoveConnection}
        onBlock={handleBlock}
        onAboutProfile={handleAboutProfile}
      />
    </div>
  );
};

export default ProfileActionButtons;
