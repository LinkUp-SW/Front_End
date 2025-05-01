import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components";
import CustomButton from "./CustomButton";
import { FaUsersSlash, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { IoCloseCircle, IoCheckmarkSharp } from "react-icons/io5";
import { CiCirclePlus, CiClock2 } from "react-icons/ci";
import { BsInfoSquareFill } from "react-icons/bs";
import { ImBlocked } from "react-icons/im";
import { PiNewspaperBold } from "react-icons/pi";
import { TbFileCv } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export interface ResourcesPopoverProps {
  title: string;
  isOwner: boolean;
  followPrimary?: boolean;
  isFollowing?: boolean;
  isPendingConnection?: boolean;
  isInConnection?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onConnect?: (email: string) => void;
  onCancelRequest?: () => void;
  onRemoveConnection?: () => void;
  onBlock?: () => void;
  onViewActivity?: () => void;
  onViewBlockedUsers?: () => void;
  onAboutProfile?: () => void;
  email: string;
  isConnectByEmail: boolean;
  setOpenEmailDialog(open: boolean): void;
  isInRecievedConnection?: boolean;
  onAccept?: () => void;
  resume?: string | null;
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
    email,
    isConnectByEmail,
    setOpenEmailDialog,
    isInRecievedConnection,
    onAccept,
    resume,
  } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CustomButton id="resources-popover-trigger" variant="outline">
          {title}
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent className="w-48 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
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
            isInRecievedConnection={isInRecievedConnection}
            onAccept={onAccept}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            onConnect={onConnect}
            onCancelRequest={onCancelRequest}
            onRemoveConnection={onRemoveConnection}
            onBlock={onBlock}
            onAboutProfile={onAboutProfile}
            isConnectByEmail={isConnectByEmail}
            email={email}
            setOpenEmailDialog={setOpenEmailDialog}
            resume={resume}
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
}) => {
  const userBio = useSelector((state: RootState) => state.userBio.data);
  console.log(userBio);
  return (
    <div className="grid gap-2">
      <button
        id="owner-popover-blocked-users-button"
        onClick={onViewBlockedUsers}
        className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
      >
        <FaUsersSlash size={16} />
        <span>Blocked users</span>
      </button>
      <button
        id="owner-popover-activity"
        onClick={onViewActivity}
        className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
      >
        <PiNewspaperBold size={16} />
        <span>Activity</span>
      </button>
      {userBio?.resume && (
        <a
          href={userBio.resume}
          target="_blank"
          id="view-resume"
          className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
        >
          <TbFileCv size={16} />
          <span>View Resume</span>
        </a>
      )}

      <button
        id="owner-popover-about-profile-button"
        onClick={onAboutProfile}
        className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
      >
        <BsInfoSquareFill size={16} />
        <span>About this profile</span>
      </button>
    </div>
  );
};

interface NonOwnerPopoverContentProps {
  followPrimary?: boolean;
  isFollowing?: boolean;
  isPendingConnection?: boolean;
  isInConnection?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onConnect?: (email: string) => void;
  onCancelRequest?: () => void;
  onRemoveConnection?: () => void;
  onBlock?: () => void;
  onAboutProfile?: () => void;
  isInRecievedConnection?: boolean;
  onAccept?: () => void;
  email: string;
  isConnectByEmail: boolean;
  setOpenEmailDialog(open: boolean): void;
  resume?: string | null;
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
  isInRecievedConnection,
  onAccept,
  email,
  isConnectByEmail,
  setOpenEmailDialog,
  resume,
}) => (
  <div className="grid gap-2">
    {!followPrimary ? (
      <button
        id="non-owner-follow-button"
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
        id="non-owner-connection-button"
        onClick={
          isPendingConnection
            ? onCancelRequest
            : isInConnection
            ? onRemoveConnection
            : isInRecievedConnection
            ? onAccept
            : isConnectByEmail
            ? () => setOpenEmailDialog(true)
            : onConnect
            ? () => onConnect(email as string)
            : undefined
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
        ) : isInRecievedConnection ? (
          <>
            <IoCheckmarkSharp size={14} />
            <span>Accept Request</span>
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
      id="non-owner-report-block-button"
      onClick={onBlock}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <ImBlocked size={14} />
      <span>Report/Block</span>
    </button>
    {resume && (
      <a
        href={resume}
        target="_blank"
        id="view-resume"
        className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
      >
        <TbFileCv size={16} />
        <span>View Resume</span>
      </a>
    )}
    <button
      id="non-owner-about-button"
      onClick={onAboutProfile}
      className="w-full dark:hover:bg-gray-700 inline-flex text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 p-2 rounded items-center gap-2"
    >
      <BsInfoSquareFill size={14} />
      <span>About</span>
    </button>
  </div>
);

export default ResourcesPopover;
