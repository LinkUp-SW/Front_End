import React, { useState, useMemo, useCallback } from "react";
import CustomButton from "./CustomButton";
import AddSectionModal from "./AddSectionModal";
import ResourcesPopover from "./ResourcesPopover";
import { IoCloseCircle } from "react-icons/io5";
import { CiCirclePlus, CiClock2 } from "react-icons/ci";
import { FaUserPlus, FaUserMinus, FaPaperPlane } from "react-icons/fa";
import {
  connectWithUser,
  FollowUser,
  removeUserFromConnection,
  UnfollowUser,
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

export type FollowStatus = {
  isFollowing?: boolean;
  isPending?: boolean;
  followPrimary?: boolean;
  isInConnection?: boolean;
};

export interface ProfileActionButtonsProps {
  isOwner: boolean;
  followStatus: FollowStatus;
  isConnectByEmail: boolean;
  email: string;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  isOwner,
  followStatus,
  isConnectByEmail,
  email,
}) => {
  const { id } = useParams();
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
    console.log("Follow clicked");
    try {
      const response = await FollowUser(authToken as string, id as string);
      console.log(response);
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
    console.log("Unfollow clicked");
    try {
      const response = await UnfollowUser(authToken as string, id as string);
      console.log(response);
      toast.success(response.message);
      setLocalFollowStatus((prev) => ({ ...prev, isFollowing: false }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLocalFollowStatus((prev) => ({ ...prev, isFollowing: true }));
    }
  }, []);

  const handleConnect = useCallback(async (email: string) => {
    console.log("Connect clicked");
    try {
      const response = await connectWithUser(
        authToken as string,
        id as string,
        email
      );
      console.log(response);
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

  const handleCancelRequest = useCallback(async () => {
    console.log("Cancel request clicked");
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
        <p className="text-gray-600">
          If you withdraw the request, you won’t be able to send another request
          for <strong>3 weeks</strong>.
        </p>
      ),
      cancel: {
        label: "Undo",
        onClick: () => {
          console.log("Cancel button clicked");
          resolveDelay("cancel"); // Resolve the delay promise early
        },
      },
      // Custom styling for the cancel button
      cancelButtonStyle: {
        backgroundColor: "#f87171", // Tailwind's red-400
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "8px 12px",
        marginLeft: "8px",
        border: "none",
        cursor: "pointer",
      },
    });

    // Wait for either the timeout or cancel click
    const delayResult = await delayPromise;
    toast.dismiss(loadingToast);
    // If cancel was clicked, show a toast after a slight delay and exit early
    if (delayResult === "cancel") {
      console.log("Operation canceled by the user.");
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
    console.log("Remove Connection clicked");
    let resolveDelay: (result: string) => void;
    // Create a promise that resolves after 4000ms or when cancel is clicked
    const delayPromise = new Promise<string>((resolve) => {
      resolveDelay = resolve;
      setTimeout(() => {
        resolve("timeout");
      }, 4000);
    });
    const loadingToast = toast.loading("Unfollow user request", {
      description: "Are you sure you want to remove this user?",
      action: {
        label: "remove",
        onClick: () => {
          console.log("Cancel button clicked");
          resolveDelay("remove"); // Resolve the delay promise early
        },
      },
      actionButtonStyle: {
        backgroundColor: "#f87171", // Tailwind's red-400
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0px 12px",
        marginLeft: "8px",
        border: "none",
        cursor: "pointer",
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
        console.log(response);
        toast.success(response.message);
        setLocalFollowStatus((prev) => ({ ...prev, isInConnection: false }));
      } catch (error) {
        toast.error(getErrorMessage(error));
        setLocalFollowStatus((prev) => ({ ...prev, isInConnection: true }));
      }
    }
  }, []);

  //-- If isConnectByEmail true open a Dialog

  // --- Other Handlers ---
  const handleMessage = useCallback(() => alert("Message clicked"), []);
  const handleBlock = useCallback(async () => {
    console.log("Remove Connection clicked");
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
          console.log("Cancel button clicked");
          resolveDelay("block"); // Resolve the delay promise early
        },
      },
      actionButtonStyle: {
        backgroundColor: "#f87171", // Tailwind's red-400
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0px 12px",
        marginLeft: "8px",
        border: "none",
        cursor: "pointer",
      },
    });
    // Wait for either the timeout or cancel click
    const delayResult = await delayPromise;
    toast.dismiss(loadingToast);
    if (delayResult === "block") {
      try {
        const response = await blockUser(authToken as string, id as string);
        console.log(response);
        toast.success(response.message);
        setTimeout(() => {
          navigate("/feed", { replace: true });
        }, 1000);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
  }, []);
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
        email={email}
        isConnectByEmail={isConnectByEmail}
        setOpenEmailDialog={setOpenEmailDialog}
        onCancelRequest={handleCancelRequest}
        onRemoveConnection={handleRemoveConnection}
        onBlock={handleBlock}
        onAboutProfile={handleAboutProfile}
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Does this user know you?</DialogTitle>
          <DialogDescription>
            To verify this member knows you, please enter their email to
            connect.{" "}
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
            size="sm"
            className="px-3"
          >
            send
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
