// UserInfo.tsx
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import useFetchData from "@/hooks/useFetchData";
import { getUserBio } from "@/endpoints/userProfile";
import {
  ProfileSkeleton,
  CoverPhoto,
  ProfileAvatar,
  ProfileHeader,
  ProfileActionButtons,
} from "./components";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getErrorMessage } from "@/utils/errorHandler";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, SubscribeNowCard } from "@/components";

interface UserInfoProps {
  setIsProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInfo: React.FC<UserInfoProps> = ({ setIsProfileVisible }) => {
  const token = Cookies.get("linkup_auth_token");
  const myUserId = Cookies.get("linkup_user_id");

  const { id } = useParams();

  const shouldFetch = myUserId !== id;
  // Global state from Redux for the user bio.
  const userBioState = useSelector((state: RootState) => state.userBio);

  // If we need to fetch (i.e. viewing someone else's profile), use the custom hook.
  // Otherwise, the hook will resolve to null.
  const fetchData = useFetchData(
    () =>
      token && id && shouldFetch
        ? getUserBio(token, id)
        : Promise.resolve(null),
    [token, id, shouldFetch]
  );

  // Choose which data to display:
  // If we're not fetching (i.e. the profile is the logged-in user's), use the global state.
  // Otherwise, use the data from the custom hook.
  const { data, loading, error } = shouldFetch ? fetchData : userBioState;
  const [numOfConnections, setNumOfConnections] = useState(0);
  const [isInConnections, setIsInConnections] = useState<boolean | undefined>(
    undefined
  );
  const [openSubscribeNowDialog, setOpenSubscribeNowDialog] = useState(false);
  useEffect(() => {
    if (data) {
      setNumOfConnections(data.number_of_connections);
      setIsInConnections(data.isInConnections);
      setIsProfileVisible(
        data.is_me ||
          (data.profile_visibility === "Connections only" &&
            !!data.isInConnections) ||
          data.profile_visibility === "Public"
      );
    }
  }, [data]);
  if (!id || getErrorMessage(error).toLocaleLowerCase() === "user not found") {
    window.location.replace("/user-not-found");
    return null;
  }

  if (error) return <ErrorFallback error={error} />;
  if (loading) return <ProfileSkeleton />;
  if (!data) return null;

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <CoverPhoto src={data.cover_photo} isOwner={data.is_me}>
        <ProfileAvatar
          src={data.profile_photo}
          isOwner={data.is_me}
        />
      </CoverPhoto>

      <div className="pt-20 px-6 pb-6">
        <ProfileHeader
          userid={id}
          user={data.bio}
          intros={{
            work_experience: data.work_experience,
            education: data.education,
          }}
          connectionsCount={numOfConnections}
          isOwner={data.is_me}
          isInConnection={isInConnections}
          isPremium={data.isSubscribed}
        />

        <ProfileActionButtons
          isOwner={data.is_me}
          isConnectByEmail={data.isConnectByEmail}
          setNumOfConnections={setNumOfConnections}
          setIsInConnections={setIsInConnections}
          connectionCount={numOfConnections}
          email={data.email}
          resume={data.resume}
          setOpenSubscribeNowDialog={setOpenSubscribeNowDialog}
          isAllowingMessage={data.allow_messaging}
          isViewerSubscribed={data.viewer_user_is_subscribed}
          followStatus={{
            isFollowing: data.isAlreadyFollowing,
            isPending: data.is_in_sent_connections,
            followPrimary: data.follow_primary,
            isInConnection: data.isInConnections,
            isInRecievedConnections: data.is_in_received_connections,
          }}
          isPremium={data.isSubscribed}
        />
      </div>
      <Dialog
        open={openSubscribeNowDialog}
        onOpenChange={setOpenSubscribeNowDialog}
      >
        <DialogContent className="bg-white dark:bg-gray-900 dark:border-gray-500">
          <SubscribeNowCard />
        </DialogContent>
      </Dialog>
    </section>
  );
};

const ErrorFallback = ({ error }: { error: unknown }) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 403) {
      window.location.replace("/user-not-found");
    }
  }
  return (
    <div className="text-red-500 p-4 bg-red-100 rounded-lg">
      {getErrorMessage(error)}
    </div>
  );
};

export default UserInfo;
