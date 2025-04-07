import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import { FaUniversity } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage, Button } from "../../components";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { refetchUserBio } from "@/slices/user_profile/userBioSlice";
import { RootState, AppDispatch } from "@/store"; // Ensure AppDispatch is exported from your store
import { getErrorMessage } from "@/utils/errorHandler";
import { BiSolidBriefcase } from "react-icons/bi";

const ProfileCard: React.FC = () => {
  // Use the correctly typed dispatch
  const dispatch = useDispatch<AppDispatch>();

  const token = Cookies.get("linkup_auth_token");
  const userId = Cookies.get("linkup_user_id");

  const { data, loading, error } = useSelector(
    (state: RootState) => state.userBio
  );

  if (error) {
    return (
      <Card
        id="profile-card-error"
        className="mb-2 bg-white border-0 dark:bg-gray-900 dark:text-neutral-200 w-full"
      >
        <CardContent
          id="profile-card-error-content"
          className="flex flex-col items-center justify-center w-full md:px-6 px-0 py-6"
        >
          <p
            id="profile-card-error-message"
            className="text-red-500 text-center"
          >
            {getErrorMessage(error)}
          </p>
          <Button
            id="profile-card-retry-button"
            onClick={() => {
              if (token && userId) {
                dispatch(refetchUserBio({ token, userId }));
              }
            }}
            variant="outline"
            className="mt-4 px-4 py-2 rounded cursor-pointer transition-colors bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card
        id="profile-card-loading"
        className="mb-2 bg-white border-0 dark:bg-gray-900 dark:text-neutral-200 w-full animate-pulse"
      >
        <CardContent
          id="profile-card-loading-content"
          className="flex flex-col items-center w-full md:px-6 px-0"
        >
          <div
            id="profile-card-loading-wrapper"
            className="flex flex-col gap-y-1 items-start w-full relative"
          >
            <header
              id="profile-card-loading-header"
              className="absolute md:-left-6 -top-6 h-15 md:w-60 w-full bg-gray-200 rounded-t-xl"
            >
              <div className="w-full h-full bg-gray-300 rounded-t-md" />
            </header>
            <section id="profile-card-loading-section" className="md:px-0 px-6">
              <div
                id="profile-card-loading-avatar"
                className="h-19 w-19 rounded-full bg-gray-300"
              />
              <div
                id="profile-card-loading-avatar-border"
                className="absolute border-white border-3 top-0 px-0 rounded-full h-19 w-19"
              />
              <div id="profile-card-loading-details" className="mt-4 space-y-2">
                <div
                  id="profile-card-loading-name"
                  className="h-6 w-32 bg-gray-300 rounded"
                />
                <div
                  id="profile-card-loading-headline"
                  className="h-4 w-48 bg-gray-300 rounded"
                />
                <div
                  id="profile-card-loading-subheadline"
                  className="h-4 w-24 bg-gray-300 rounded"
                />
              </div>
              <footer
                id="profile-card-loading-footer"
                className="flex items-center gap-1 pt-3"
              >
                <FaUniversity className="text-gray-300" />
                <div
                  id="profile-card-loading-education"
                  className="h-4 w-20 bg-gray-300 rounded"
                />
              </footer>
            </section>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      id="profile-card"
      className="mb-2 bg-white border-0 dark:bg-gray-900 dark:text-neutral-200 w-full"
    >
      <CardContent
        id="profile-card-content"
        className="flex flex-col items-center w-full relative md:px-6 px-0 "
      >
        <Link
          id="profile-card-link"
          className="flex flex-col gap-y-1 items-start hover:cursor-pointer w-full"
          to={`/user-profile/${userId}`}
        >
          <header
            id="profile-card-header"
            className="absolute md:-left-0 -top-6 h-15 w-full bg-gray-200 rounded-t-xl"
          >
            <img
              id="profile-card-cover-photo"
              src={data?.cover_photo}
              alt="Cover"
              className="w-full h-full min-h-20 rounded-t-md"
            />
          </header>
          <section id="profile-card-section" className="md:px-0 px-6">
            <Avatar id="profile-card-avatar" className="h-19 w-19">
              <AvatarImage
                id="profile-card-avatar-image"
                src={data?.profile_photo}
                alt="user-profile"
              />
              <AvatarFallback id="profile-card-avatar-fallback">
                {"name.charAt(0)"}
              </AvatarFallback>
            </Avatar>
            <div
              id="profile-card-avatar-border"
              className="absolute border-white border-3 top-0 px-0 rounded-full h-19 w-19"
            ></div>
            <h1 id="profile-card-name" className="text-xl font-medium">
              {data?.bio.first_name} {data?.bio.last_name}
            </h1>
            <h2
              id="profile-card-headline"
              className="text-xs text-ellipsis line-clamp-2"
            >
              {data?.bio.headline}
            </h2>
            <h3
              id="profile-card-location"
              className="text-xs text-gray-500 dark:text-neutral-400"
            >
              {data?.bio.location.city} {data?.bio.location.country_region}
            </h3>
            <footer id="profile-card-footer" className="grid gap-1 pt-3">
              {data?.education && (
                <div className="flex items-center gap-2">
                  <FaUniversity />
                  <h1
                    id="profile-card-education"
                    className="text-xs font-semibold"
                  >
                    {data?.education?.name}
                  </h1>
                </div>
              )}
              {data?.work_experience && (
                <div className="flex items-center gap-2">
                  <BiSolidBriefcase />
                  <h1
                    id="profile-card-education"
                    className="text-xs font-semibold"
                  >
                    {data?.work_experience?.name}
                  </h1>
                </div>
              )}
            </footer>
          </section>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
