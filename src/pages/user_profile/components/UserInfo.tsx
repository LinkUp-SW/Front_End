import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import Header from "./modals/components/Header";
import AddProfileSectionModal from "./modals/add_profile_section_modal/AddProfileSectionModal";
import useFetchData from "@/hooks/useFetchData";
import { getUserBio } from "@/endpoints/userProfile";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { FaBirthdayCake } from "react-icons/fa";
import { formatIsoDateToHumanReadable } from "@/utils";
import { AiFillPhone } from "react-icons/ai";
import { CiHome } from "react-icons/ci";

const UserInfo = () => {
  const token = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const { data, loading, error } = useFetchData(
    () => (token && id ? getUserBio(token, id) : Promise.resolve(null)),
    [token, id]
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (error) {
    return <>Error...</>;
  }

  // Skeleton Loading State
  if (loading) {
    return (
      <section className="animate-pulse bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        {/* Cover Photo Skeleton */}
        <div className="relative h-48 bg-gray-200">
          <div className="w-full h-full bg-gray-300" />
          {/* Avatar Skeleton */}
          <div className="absolute -bottom-16 left-4">
            <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white" />
          </div>
        </div>

        {/* Profile Info Skeleton */}
        <div className="pt-20 px-6 pb-6 space-y-4">
          <div className="mb-4">
            {/* Name Skeleton */}
            <div className="h-6 bg-gray-300 w-1/2 rounded" />
            {/* Headline Skeleton */}
            <div className="h-4 bg-gray-300 w-1/3 rounded mt-2" />
            {/* Location Skeleton */}
            <div className="h-4 bg-gray-300 w-1/4 rounded mt-1" />
            {/* Connections Skeleton */}
            <div className="h-4 bg-gray-300 w-1/6 rounded mt-1" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex max-w-xl flex-wrap gap-2">
            <div className="bg-blue-600 flex-grow rounded-full h-8" />
            <div className="border-blue-600 flex-grow rounded-full border-2 h-8" />
            <div className="border-blue-600 flex-grow rounded-full border-2 h-8" />
            <div className="border border-gray-300 flex-grow rounded-full h-8" />
          </div>

          {/* Contact Info Skeleton */}
          <div className="space-y-1">
            <div className="h-4 bg-gray-300 w-full rounded" />
            <div className="h-4 bg-gray-300 w-1/2 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={data.cover_photo}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {data.is_me && (
          <>
            <button
              id="edit-cover-photo-btn"
              className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full  top-3 right-3"
            >
              <span className="hidden">edit cover photo</span>
              <FaPencilAlt size={20} />
            </button>
            <button
              id="edit-bio-btn"
              className="absolute hover:opacity-85 transition-all duration-300 cursor-pointer bg-gray-300 dark:bg-gray-800 p-2 rounded-full -bottom-10 right-3"
            >
              <span className="hidden">edit bio</span>
              <FaPencilAlt size={20} />
            </button>
          </>
        )}
        {/* Avatar */}
        <div className="absolute -bottom-16 left-4">
          <img
            src={data.profile_photo}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-6 pb-6">
        <div className="mb-4 grid gap-1">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {data.bio.first_name} {data.bio.last_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-200">
            {data.bio.headline}
          </p>
          <p className="text-sm inline-flex gap-2 items-start text-gray-500 dark:text-gray-200 mt-1">
            <span>
              {data.bio.location.city}, {data.bio.location.country_region}
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  id="open-contact-info-btn"
                  className="text-blue-600 cursor-pointer font-semibold dark:text-blue-400"
                >
                  Contact Info
                </button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-900 dark:border-gray-900">
                <DialogHeader className="underline">
                  <DialogTitle className="text-2xl">
                    {data.bio.first_name} {data.bio.last_name}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6">
                  <h2 className="font-bold text-xl">Contact Info</h2>
                  <span className="inline-flex items-start gap-2">
                    <LinkIcon
                      size={20}
                      className="text-gray-500 mt-1 dark:text-gray-300"
                    />
                    <span className="grid gap-1">
                      <h2>Website</h2>
                      <Link to={data.bio.website}>{data.bio.website}</Link>
                    </span>
                  </span>
                  <span className="inline-flex items-start gap-2">
                    <FaBirthdayCake
                      size={20}
                      className="text-gray-500 mt-1 dark:text-gray-300"
                    />
                    <span className="grid gap-1">
                      <h2>Birthday</h2>
                      <p>
                        {formatIsoDateToHumanReadable(
                          data.bio.contact_info.birthday
                        )}
                      </p>
                    </span>
                  </span>
                  <span className="inline-flex items-start gap-2">
                    <AiFillPhone
                      size={20}
                      className="text-gray-500 mt-1 dark:text-gray-300"
                    />
                    <span className="grid gap-1">
                      <h2>Phone Number</h2>
                      <p>
                        {data.bio.contact_info.country_code}{" "}
                        {data.bio.contact_info.phone_number}
                      </p>
                    </span>
                  </span>
                  <span className="inline-flex items-start gap-2">
                    <CiHome
                      size={20}
                      className="text-gray-500 mt-1 dark:text-gray-300"
                    />
                    <span className="grid gap-1">
                      <h2>Address</h2>
                      <p>{data.bio.contact_info.address}</p>
                    </span>
                  </span>
                </div>
              </DialogContent>
            </Dialog>
          </p>
          <Link
            to={"#"}
            className="text-blue-600 w-fit hover:underline font-semibold dark:text-blue-400"
          >
            {data.number_of_connections} connections
          </Link>
        </div>

        {/* Action Buttons */}
        {data.is_me ? (
          <>
            <div className="flex max-w-xl flex-wrap gap-2 mb-4">
              <button className="bg-blue-600 flex-grow text-white cursor-pointer hover:bg-blue-800 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                Open to work
              </button>
              <Dialog>
                <DialogTrigger asChild>
                  <button className=" border-blue-600 flex-grow text-blue-600 font-semibold border-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm ">
                    Add profile section
                  </button>
                </DialogTrigger>
                <DialogContent className="!max-w-5xl gap-0 md:!w-[33rem] overflow-y-auto overflow-x-hidden rounded-lg p-6 max-h-[45rem] !w-full">
                  <DialogHeader>
                    <DialogTitle>
                      <Header title="Add To Profile" />
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-300"></DialogDescription>
                  <AddProfileSectionModal />
                </DialogContent>
              </Dialog>
              <button className=" border-blue-600 flex-grow text-blue-600 font-semibold border-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm ">
                Enhance Profile
              </button>
              <button className="border border-gray-300 flex-grow cursor-pointer hover:bg-gray-200 dark:hover:text-black transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                Resources
              </button>
            </div>
          </>
        ) : (
          <>
            {data.follow_primary ? (
              <div className="flex max-w-xl flex-wrap gap-2 mb-4">
                <button className="bg-blue-600 flex-grow text-white cursor-pointer hover:bg-blue-800 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                  {data.isAlreadyFollowing ? "UnFollow" : "Follow"}
                </button>
                <button className="bg-blue-600 flex-grow text-white cursor-pointer hover:bg-blue-800 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                  Message
                </button>
                <button className="border border-gray-300 flex-grow cursor-pointer hover:bg-gray-200 dark:hover:text-black transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                  Resources
                </button>
              </div>
            ) : (
              <div className="flex max-w-xl flex-wrap gap-2 mb-4">
                <button className="bg-blue-600 flex-grow text-white cursor-pointer hover:bg-blue-800 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                  {data.is_in_sent_connections ? "Withdraw" : "pending"}
                </button>
                <button className="bg-blue-600 flex-grow text-white cursor-pointer hover:bg-blue-800 transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                  Message
                </button>
                <button className="border border-gray-300 flex-grow cursor-pointer hover:bg-gray-200 dark:hover:text-black transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium">
                  Resources
                </button>
              </div>
            )}
          </>
        )}

        {/* Contact Info */}
        <div className="text-sm text-gray-500 dark:text-gray-200 space-y-1">
          <p>
            Study at {data.bio.education[data.bio.education.length - 1]} (
            {data.email})
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserInfo;
