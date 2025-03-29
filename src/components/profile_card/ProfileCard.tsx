import React from "react";
import { Card, CardContent } from "../ui/card";
import { FaUniversity } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage, Button } from "../../components";
import { Link } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import { getUserBio } from "@/endpoints/userProfile";
import Cookies from "js-cookie";

const ProfileCard: React.FC = () => {
  // const { data, loading, error, refetch } = useFetchData(
  //   () => getProfileCardData(),
  //   []
  // );
  const token = Cookies.get("linkup_auth_token");

  const userId = Cookies.get("linkup_user_id");

  const { data, loading, error, refetch } = useFetchData(
    () => (token && userId ? getUserBio(token, userId) : Promise.resolve(null)),
    [token, userId]
  );

  if (error) {
    return (
      <Card className="mb-2 bg-white border-0 dark:bg-gray-900 dark:text-neutral-200 w-full">
        <CardContent className="flex flex-col items-center justify-center w-full md:px-6 px-0 py-6">
          <p className="text-red-500 text-center">
            Error loading profile data.
          </p>
          <Button
            onClick={refetch}
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
      <Card className="mb-2 bg-white border-0 dark:bg-gray-900 dark:text-neutral-200 w-full animate-pulse">
        <CardContent className="flex flex-col items-center w-full md:px-6 px-0">
          <div className="flex flex-col gap-y-1 items-start w-full relative">
            <header className="absolute md:-left-6 -top-6 h-15 md:w-60 w-full bg-gray-200 rounded-t-xl">
              <div className="w-full h-full bg-gray-300 rounded-t-md" />
            </header>
            <section className="md:px-0 px-6 ">
              <div className="h-19 w-19 rounded-full bg-gray-300" />
              <div className="absolute border-white border-3 top-0 px-0 rounded-full h-19 w-19" />
              <div className="mt-4 space-y-2">
                <div className="h-6 w-32 bg-gray-300 rounded" />
                <div className="h-4 w-48 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
              <footer className="flex items-center gap-1 pt-3">
                <FaUniversity className="text-gray-300" />
                <div className="h-4 w-20 bg-gray-300 rounded" />
              </footer>
            </section>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-2 bg-white border-0 dark:bg-gray-900 dark:text-neutral-200 w-full">
      <CardContent className="flex flex-col  items-center w-full relative md:px-6 px-0 ">
        <Link
          className="flex flex-col gap-y-1 items-start w-full   hover:cursor-pointer"
          to={`/user-profile/${userId}`}
        >
          <header
            className="absolute md:-left-0 -top-6 h-15 
            w-full  bg-gray-200 rounded-t-xl"
          >
            <img
              src={data?.cover_photo}
              alt="Cover"
              className="w-full h-full min-h-20 rounded-t-md "
            />
          </header>
          <section className="md:px-0 px-6">
            <Avatar className="h-19 w-19">
              <AvatarImage src={data?.profile_photo} alt={"user-profile"} />
              <AvatarFallback>{"name.charAt(0)"}</AvatarFallback>
            </Avatar>
            <div className="absolute border-white border-3 top-0 px-0 rounded-full h-19 w-19"></div>
            <h1 className="text-xl font-medium">
              {data?.bio.first_name} {data?.bio.last_name}
            </h1>
            <h2 className="text-xs text-ellipsis line-clamp-2">
              {data?.bio.headline}
            </h2>
            <h3 className="text-xs text-gray-500 dark:text-neutral-400">
              {data?.bio.location.city} {data?.bio.location.country_region}
            </h3>
            <footer className="flex items-center gap-1 pt-3">
              <FaUniversity />
              <h1 className="text-xs font-semibold">
                {data?.bio.education[data?.bio.education.length - 1]}
              </h1>
            </footer>
          </section>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
