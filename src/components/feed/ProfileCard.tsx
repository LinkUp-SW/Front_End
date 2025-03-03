import React from "react";
import { Card, CardContent } from "../ui/card";
import { FaUniversity } from "react-icons/fa";

const ProfileCard = () => {
  return (
    <Card className="mb-4 p-4 text-center bg-white">
      <CardContent className="flex flex-col items-center">
        <img
          src="https://via.placeholder.com/80"
          className="rounded-full"
          alt="Profile"
        />
        <h3 className="text-lg font-semibold mt-2">Amr Doma</h3>
        <p className="text-gray-500 text-sm">
          Ex-SWE Intern at Valeo | Ex-Clinical Engineering Intern
        </p>
        <p className="text-gray-500 text-sm">Qesm El Maadi, Cairo</p>
        <div className="flex items-center mt-2 text-gray-700">
          <FaUniversity className="mr-1" /> Cairo University
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
