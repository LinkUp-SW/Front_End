import React, { useState, useMemo, useCallback } from "react";
import CustomButton from "./CustomButton";
import AddSectionModal from "./AddSectionModal";
import ResourcesPopover from "./ResourcesPopover";
import { IoCheckmarkSharp, IoCloseCircle } from "react-icons/io5";
import { CiCirclePlus, CiClock2 } from "react-icons/ci";
import { FaUserPlus, FaUserMinus, FaPaperPlane } from "react-icons/fa";
import {
  acceptInvitation,
  connectWithUser,
  followUser,
  removeUserFromConnection,
  unfollowUser,
  withdrawInvitation,
} from "@/endpoints/myNetwork";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormInput,
} from "@/components";
import { blockUser } from "@/endpoints/userProfile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { editUserBio } from "@/slices/user_profile/userBioSlice";
import { socketService } from "@/services/socket";
import { UserProfileBio } from "@/types";
import { checkConversationExists } from "@/endpoints/messaging";
import {
  setShowPopup,
  setUser2IdPop,
  setUser2NamePop,
  setUser2ProfilePicturePop,
  setUser2HeadlinePop,
} from "@/slices/messaging/messagingSlice";

export type FollowStatus = {
  isFollowing?: boolean;
  isPending?: boolean;
  followPrimary?: boolean;
  isInConnection?: boolean;
  isInRecievedConnections?: boolean;
};

export interface ProfileActionButtonsProps {
  isOwner: boolean;
  followStatus: FollowStatus;
  isConnectByEmail: boolean;
  email: string;
  resume: string | null;
  setNumOfConnections: React.Dispatch<React.SetStateAction<number>>;
  setIsInConnections: React.Dispatch<React.SetStateAction<undefined | boolean>>;
  connectionCount: number;
  isAllowingMessage: boolean;
  isViewerSubscribed: boolean;
  setOpenSubscribeNowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isPremium: boolean;
  data:UserProfileBio
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  isOwner,
  followStatus,
  isConnectByEmail,
  email,
  setNumOfConnections,
  setIsInConnections,
  connectionCount,
  resume,
  isAllowingMessage,
  isViewerSubscribed,
  setOpenSubscribeNowDialog,
  isPremium,
  data
}) => {
  const { id } = useParams();
  const userBioState = useSelector((state: RootState) => state.userBio);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = Cookies.get("linkup_auth_token");
  const [localFollowStatus, setLocalFollowStatus] =
    useState<FollowStatus>(followStatus);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  const effectiveStatus = useMemo(
    () => (isOwner ? followStatus : localFollowStatus),
    [isOwner, followStatus, localFollowStatus]
  );

  // --- Follow/Connection Handlers ---
  const handleFollow = useCallback(async () => {
    try {
      const response = await followUser(authToken as string, id as string);
      toast.success(response.message);
      setLocalFollowStatus((prev) => ({
        ...prev,
        isFollowing: true,
      }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLocalFollowStatus((prev) => ({
        ...prev,
        isFollowing: false,
      }));
    }
  }, []);

  const handleUnfollow = useCallback(async () => {
    try {
      const response = await unfollowUser(authToken as string, id as string);
      toast.success(response.message);
      setLocalFollowStatus((prev) => ({ ...prev, isFollowing: false }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLocalFollowStatus((prev) => ({ ...prev, isFollowing: true }));
    }
  }, []);

  const handleConnect = useCallback(async (email: string) => {
    try {
      const response = await connectWithUser(
        authToken as string,
        id as string,
        email
      );
      socketService.sendNotification(id as string, Cookies.get('linkup_user_id') as string, 'connection_request',undefined,'new connection request')
      toast.success(response.message);
      setLocalFollowStatus((prev) => ({
        ...prev,
        isPending: true,
        isInConnection: false,
        isFollowing: true,
      }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLocalFollowStatus((prev) => ({
        ...prev,
        isPending: false,
        isInConnection: false,
      }));
    }
  }, []);

  const handleAcceptConnection = useCallback(async () => {
    try {
      const response = await acceptInvitation(
        authToken as string,
        id as string
      );
      toast.success(response.message);
      setLocalFollowStatus((prev) => ({
        ...prev,
        isFollowing: true,
        isInConnection: true,
      }));
      setNumOfConnections((prev: number) => prev + 1);
      setIsInConnections(true);
      dispatch(
        editUserBio({
          ...userBioState,
          number_of_connections: connectionCount + 1,
        })
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLocalFollowStatus((prev) => ({ ...prev, isInConnection: false }));
    }
  }, []);

  const handleCancelRequest = useCallback(async () => {
    let resolveDelay: (result: string) => void;

    // Create a promise that resolves after 4000ms or when cancel is clicked
    const delayPromise = new Promise<string>((resolve) => {
      resolveDelay = resolve;
      setTimeout(() => {
        resolve("timeout");
      }, 4000);
    });

    const loadingToast = toast.loading("Withdraw connection request", {
      description: (
        <p className="text-gray-600 dark:text-gray-300">
          If you withdraw the request, you won’t be able to send another request
          for <strong>3 weeks</strong>.
        </p>
      ),
      cancel: {
        label: "Undo",
        onClick: () => {
          resolveDelay("cancel"); // Resolve the delay promise early
        },
      },
      // Custom styling for the cancel button
      cancelButtonStyle: {
        backgroundColor: "oklch(0.525 0.223 3.958)", // Tailwind's red-400
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "8px 12px",
        marginLeft: "8px",
        border: "none",
        cursor: "pointer",
      },
      style: {
        background: theme === "light" ? "white" : "#1e2939",
        color: theme === "light" ? "black" : "white",
      },
    });

    // Wait for either the timeout or cancel click
    const delayResult = await delayPromise;
    toast.dismiss(loadingToast);
    // If cancel was clicked, show a toast after a slight delay and exit early
    if (delayResult === "cancel") {
      setTimeout(() => {
        toast.info(`Withdraw request Canceled`);
      }, 100);
      return;
    }

    // Otherwise, execute the withdraw logic
    try {
      const response = await withdrawInvitation(
        authToken as string,
        id as string
      );
      toast.success(response.message);
      setLocalFollowStatus((prev) => ({ ...prev, isPending: false }));
    } catch (error) {
      setLocalFollowStatus((prev) => ({ ...prev, isPending: false }));
      toast.error(getErrorMessage(error));
    }
  }, []);

  const handleRemoveConnection = useCallback(async () => {
    let resolveDelay: (result: string) => void;
    // Create a promise that resolves after 4000ms or when cancel is clicked
    const delayPromise = new Promise<string>((resolve) => {
      resolveDelay = resolve;
      setTimeout(() => {
        resolve("timeout");
      }, 4000);
    });
    const loadingToast = toast.loading("Remove Connection request", {
      description:
        "Are you sure you want to remove this user from your connections?",
      action: {
        label: "remove",
        onClick: () => {
          resolveDelay("remove"); // Resolve the delay promise early
        },
      },
      actionButtonStyle: {
        backgroundColor: "oklch(0.525 0.223 3.958)", // Tailwind's red-400
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0px 12px",
        marginLeft: "8px",
        border: "none",
        cursor: "pointer",
      },
      style: {
        background: theme === "light" ? "white" : "#1e2939",
        color: theme === "light" ? "black" : "white",
      },
    });
    // Wait for either the timeout or cancel click
    const delayResult = await delayPromise;
    toast.dismiss(loadingToast);
    if (delayResult === "remove") {
      try {
        const response = await removeUserFromConnection(
          authToken as string,
          id as string
        );
        toast.success(response.message);
        setLocalFollowStatus((prev) => ({ ...prev, isInConnection: false }));
        dispatch(
          editUserBio({
            ...userBioState,
            number_of_connections: connectionCount - 1,
          })
        );
        setNumOfConnections((prev) => prev - 1);
        setIsInConnections(false);
      } catch (error) {
        toast.error(getErrorMessage(error));
        setLocalFollowStatus((prev) => ({ ...prev, isInConnection: true }));
      }
    }
  }, []);

  //-- If isConnectByEmail true open a Dialog

  // --- Other Handlers ---
  const handleMessage = useCallback(
    async (
      user2Id: string,
      name: string,
      profilePicture: string,
      headline: string
    ) => {
      if (
        followStatus.isInConnection ||
        isAllowingMessage ||
        isViewerSubscribed
      ) {
       try {
             const result = await checkConversationExists(authToken!, user2Id);
       
             if (result.conversationExists) {
               dispatch(setShowPopup(false));
               navigate("/messaging");
             } else {
               dispatch(setUser2IdPop(user2Id));
               dispatch(setUser2NamePop(name));
               dispatch(setUser2ProfilePicturePop(profilePicture));
               dispatch(setUser2HeadlinePop(headline));
               dispatch(setShowPopup(true));
             }
           } catch (error) {
             console.error("Error checking conversation:", error);
           }
      } else {
        setOpenSubscribeNowDialog(true);
      }
    },
    []
  );

  const handleBlock = useCallback(async () => {
    let resolveDelay: (result: string) => void;
    // Create a promise that resolves after 4000ms or when cancel is clicked
    const delayPromise = new Promise<string>((resolve) => {
      resolveDelay = resolve;
      setTimeout(() => {
        resolve("timeout");
      }, 4000);
    });
    const loadingToast = toast.loading("Block user request", {
      description: "Are you sure you want to block this user?",
      action: {
        label: "block",
        onClick: () => {
          resolveDelay("block"); // Resolve the delay promise early
        },
      },
      actionButtonStyle: {
        backgroundColor: "oklch(0.525 0.223 3.958)", // Tailwind's red-400
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0px 12px",
        marginLeft: "8px",
        border: "none",
        cursor: "pointer",
      },
      style: {
        background: theme === "light" ? "white" : "#1e2939",
        color: theme === "light" ? "black" : "white",
      },
    });
    // Wait for either the timeout or cancel click
    const delayResult = await delayPromise;
    toast.dismiss(loadingToast);
    if (delayResult === "block") {
      try {
        const response = await blockUser(authToken as string, id as string);
        toast.success(response.message);
        setTimeout(() => {
          navigate("/feed", { replace: true });
        }, 1000);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
  }, []);
  const handleEnhanceProfile = useCallback(() => {
    setOpenSubscribeNowDialog(true);
  }, []);
  const handleOpenToWork = useCallback(() => alert("Open to Work clicked"), []);
  const handleAboutProfile = useCallback(
    () => alert("About Profile clicked"),
    []
  );
  const handleViewActivity = useCallback(
    () => navigate(`/user-profile/${id}/posts`),
    []
  );
  const handleViewBlockedUsers = useCallback(
    () => navigate(`/settings/visibility/blocking`),
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
        {!isPremium && (
          <CustomButton
            id="enhance-profile-button"
            variant="secondary"
            onClick={handleEnhanceProfile}
          >
            Enhance Profile
          </CustomButton>
        )}

        <ResourcesPopover
          title="Resources"
          isOwner
          email={email}
          setOpenEmailDialog={setOpenEmailDialog}
          isConnectByEmail={isConnectByEmail}
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
            onClick={()=>handleMessage(id!,data.bio.first_name,data.profile_photo,data.bio.headline)}
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
                : effectiveStatus.isInRecievedConnections
                ? handleAcceptConnection
                : isConnectByEmail
                ? () => setOpenEmailDialog(true)
                : () => handleConnect(email)
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
            ) : effectiveStatus.isInRecievedConnections ? (
              <>
                <IoCheckmarkSharp size={14} />
                Accept Request
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
            onClick={()=>handleMessage(id!,data.bio.first_name,data.profile_photo,data.bio.headline)}
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
        isInRecievedConnection={effectiveStatus.isInRecievedConnections}
        onAccept={handleAcceptConnection}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onConnect={handleConnect}
        email={email}
        isConnectByEmail={isConnectByEmail}
        setOpenEmailDialog={setOpenEmailDialog}
        onCancelRequest={handleCancelRequest}
        onRemoveConnection={handleRemoveConnection}
        onBlock={handleBlock}
        onAboutProfile={handleAboutProfile}
        resume={resume}
      />
      <EmailConnectionDialog
        onOpenChange={setOpenEmailDialog}
        open={openEmailDialog}
        handleConnect={handleConnect}
      />
    </div>
  );
};

export default ProfileActionButtons;

const EmailConnectionDialog = ({
  open,
  onOpenChange,
  handleConnect,
}: {
  onOpenChange?(open: boolean): void;
  open: boolean;
  handleConnect(email?: string): void;
}) => {
  const [email, setEmail] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg text-black dark:text-white">
            Does this user know you?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700 dark:text-gray-300">
            To verify this member knows you, please enter their email to
            connect.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <FormInput
              label="Email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value.toLowerCase());
              }}
              type="text"
              id="email"
              name="email"
              extraClassName="pt-0"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={() => {
              handleConnect(email);
              onOpenChange?.(false);
            }}
            type="submit"
            className="affirmativeBtn"
          >
            Send
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="destructiveBtn">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
