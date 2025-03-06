import React from "react";
import { Card, CardContent } from "../ui/card";
import { FaUniversity } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Profile {
  coverImage: string;
  profileImage: string;
  name: string;
  headline: string;
  location: string;
  university: string;
}

interface ProfileCardProps {
  fullWidth?: boolean;
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ fullWidth, profile }) => {
  const { coverImage, profileImage, name, headline, location, university } =
    profile;

  return (
    <Card className="mb-2 bg-white border-0">
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-col gap-y-1 items-start w-full relative">
          <div
            className={`absolute h-15 ${
              fullWidth ? "w-[107.2%]" : "w-60"
            } -left-6 -top-6 bg-gray-200 rounded-t-xl`}
          >
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full rounded-t-md"
            />
          </div>
          <Avatar className="h-19 w-19">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute border-white border-3 rounded-full h-19 w-19"></div>
          <h1 className="text-xl font-medium">{name}</h1>
          <h2 className="text-xs text-ellipsis line-clamp-2">{headline}</h2>
          <h3 className="text-xs text-gray-500">{location}</h3>
          <div className="flex items-center gap-1 pt-2">
            <FaUniversity />
            <h1 className="text-xs font-semibold">{university}</h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
