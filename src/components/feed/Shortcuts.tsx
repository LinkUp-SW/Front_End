import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  FaBookmark,
  FaCalendarAlt,
  FaNewspaper,
  FaUsers,
} from "react-icons/fa";

const Shortcuts = () => {
  return (
    <Card className="p-4">
      <CardContent className="text-gray-700 space-y-2">
        <div className="flex items-center">
          <FaBookmark className="mr-2" /> Saved items
        </div>
        <div className="flex items-center">
          <FaUsers className="mr-2" /> Groups
        </div>
        <div className="flex items-center">
          <FaNewspaper className="mr-2" /> Newsletters
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2" /> Events
        </div>
      </CardContent>
    </Card>
  );
};

export default Shortcuts;
