// UserInfo.tsx
import { useEffect } from "react";
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

const UserInfo = () => {
  const token = Cookies.get("linkup_auth_token");
  const { id } = useParams();

  const { data, loading, error } = useFetchData(
    () => (token && id ? getUserBio(token, id) : Promise.resolve(null)),
    [token, id]
  );

  useEffect(() => {
    if (data) console.log(data); // Remove in production
  }, [data]);

  if (error) return <ErrorFallback />;
  if (loading) return <ProfileSkeleton />;
  if (!data) return null;

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <CoverPhoto src={data.cover_photo} isOwner={data.is_me}>
        <ProfileAvatar
          src={data.profile_photo}
          isOwner={data.is_me}
          onEdit={() => console.log("Edit profile")}
        />
      </CoverPhoto>

      <div className="pt-20 px-6 pb-6">
        <ProfileHeader
          user={data.bio}
          connectionsCount={data.number_of_connections}
        />

        <ProfileActionButtons
          isOwner={data.is_me}
          followStatus={{
            isFollowing: data.isAlreadyFollowing,
            isPending: data.is_in_sent_connections,
            followPrimary: data.follow_primary,
            isInConnection:data.isInConnections
          }}
        />


      </div>
    </section>
  );
};

const ErrorFallback = () => (
  <div className="text-red-500 p-4 bg-red-100 rounded-lg">
    Error loading profile information
  </div>
);

export default UserInfo;
