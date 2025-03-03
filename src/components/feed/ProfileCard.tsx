import React from "react";
import { Card, CardContent } from "../ui/card";
import { FaUniversity } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileCard = () => {
  return (
    <Card className="mb-4 bg-white border-0">
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-col gap-y-1 items-start w-full relative">
          <div className="absolute h-15 w-60 -left-6 -top-6 bg-gray-200 rounded-t-xl">
            <img
              src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              alt="Cover"
              className="w-full h-full rounded-t-md"
            />
          </div>
          <Avatar className="h-19 w-19">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="absolute border-white border-3 rounded-full h-19 w-19"></div>
          <h1 className="text-xl font-medium">Amr Doma</h1>
          <h2 className="text-xs text-ellipsis line-clamp-2">
            Ex-SWE Intern at Valeo | Ex-Clinical Engineering Intern at As-Salam
            International Hospital{" "}
          </h2>
          <h3 className="text-xs text-gray-500">Qesm el Maadi, Cairo</h3>
          <div className="flex items-center gap-1 pt-2">
            <FaUniversity></FaUniversity>
            <h1 className="text-xs font-semibold">Cairo University</h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
