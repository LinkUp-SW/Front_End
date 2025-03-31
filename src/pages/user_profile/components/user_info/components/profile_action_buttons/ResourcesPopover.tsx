// src/components/ResourcesPopover.tsx
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components";
import CustomButton from "./CustomButton";
import { FaUsersSlash, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { CiCirclePlus, CiClock2 } from "react-icons/ci";
import { BsInfoSquareFill } from "react-icons/bs";
import { ImBlocked } from "react-icons/im";
import { PiNewspaperBold } from "react-icons/pi";

export interface ResourcesPopoverProps {
  title: string;
  isOwner: boolean;
  followPrimary?: boolean;
  isFollowing?: boolean;
  isPendingConnection?: boolean;
  isInConnection?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onConnect?: () => void;
  onCancelRequest?: () => void;
  onRemoveConnection?: () => void;
  onBlock?: () => void;
  onViewActivity?: () => void;
  onViewBlockedUsers?: () => void;
  onAboutProfile?: () => void;
}

const ResourcesPopover: React.FC<ResourcesPopoverProps> = (props) => {
  const {
    title,
    isOwner,
    followPrimary,
    isFollowing,
    isPendingConnection,
    isInConnection,
    onFollow,
    onUnfollow,
    onConnect,
    onCancelRequest,
    onRemoveConnection,
    onBlock,
    onAboutProfile,
    onViewActivity,
    onViewBlockedUsers,
  } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CustomButton variant="outline">{title}</CustomButton>
      </PopoverTrigger>
      <PopoverContent className="w-44 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
        {isOwner ? (
          <OwnerPopoverContent
            onViewBlockedUsers={onViewBlockedUsers}
            onViewActivity={onViewActivity}
            onAboutProfile={onAboutProfile}
          />
        ) : (
          <NonOwnerPopoverContent
            followPrimary={followPrimary}
            isFollowing={isFollowing}
            isPendingConnection={isPendingConnection}
            isInConnection={isInConnection}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            onConnect={onConnect}
            onCancelRequest={onCancelRequest}
            onRemoveConnection={onRemoveConnection}
            onBlock={onBlock}
            onAboutProfile={onAboutProfile}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

interface OwnerPopoverContentProps {
  onViewBlockedUsers?: () => void;
  onViewActivity?: () => void;
  onAboutProfile?: () => void;
}

const OwnerPopoverContent: React.FC<OwnerPopoverContentProps> = ({
  onViewBlockedUsers,
  onViewActivity,
  onAboutProfile,
}) => (
  <div className="grid gap-2">
    <button
      onClick={onViewBlockedUsers}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <FaUsersSlash size={16} />
      <span>Blocked users</span>
    </button>
    <button
      onClick={onViewActivity}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <PiNewspaperBold size={16} />
      <span>Activity</span>
    </button>
    <button
      onClick={onAboutProfile}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <BsInfoSquareFill size={16} />
      <span>About this profile</span>
    </button>
  </div>
);

interface NonOwnerPopoverContentProps {
  followPrimary?: boolean;
  isFollowing?: boolean;
  isPendingConnection?: boolean;
  isInConnection?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onConnect?: () => void;
  onCancelRequest?: () => void;
  onRemoveConnection?: () => void;
  onBlock?: () => void;
  onAboutProfile?: () => void;
}

const NonOwnerPopoverContent: React.FC<NonOwnerPopoverContentProps> = ({
  followPrimary,
  isFollowing,
  isPendingConnection,
  isInConnection,
  onFollow,
  onUnfollow,
  onConnect,
  onCancelRequest,
  onRemoveConnection,
  onBlock,
  onAboutProfile,
}) => (
  <div className="grid gap-2">
    {!followPrimary ? (
      <button
        onClick={isFollowing ? onUnfollow : onFollow}
        className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
      >
        {isFollowing ? (
          <>
            <IoCloseCircle size={16} />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <CiCirclePlus size={16} />
            <span>Follow</span>
          </>
        )}
      </button>
    ) : (
      <button
        onClick={
          isPendingConnection
            ? onCancelRequest
            : isInConnection
            ? onRemoveConnection
            : onConnect
        }
        className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
      >
        {isPendingConnection ? (
          <>
            <CiClock2 size={16} />
            <span>Pending</span>
          </>
        ) : isInConnection ? (
          <>
            <FaUserMinus size={14} />
            <span>Remove Connection</span>
          </>
        ) : (
          <>
            <FaUserPlus size={14} />
            <span>Connect</span>
          </>
        )}
      </button>
    )}
    <button
      onClick={onBlock}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <ImBlocked size={14} />
      <span>Report/Block</span>
    </button>
    <button
      onClick={onAboutProfile}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <BsInfoSquareFill size={14} />
      <span>About</span>
    </button>
  </div>
);

export default ResourcesPopover;
