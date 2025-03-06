import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  FaBookmark,
  FaCalendarAlt,
  FaNewspaper,
  FaUsers,
} from "react-icons/fa";

const Shortcuts = () => {
  const listItems = [
    { title: "Saved items", icon: <FaBookmark className="mr-2" />, link: "#" },
    { title: "Groups", icon: <FaUsers className="mr-2" />, link: "#" },
    { title: "Newsletters", icon: <FaNewspaper className="mr-2" />, link: "#" },
    { title: "Events", icon: <FaCalendarAlt className="mr-2" />, link: "#" },
  ];
  return (
    <Card className="py-2 my-2">
      <CardContent className="text-gray-700  font-medium text-xs my-2">
        <div className="flex flex-col gap-y-4">
          {listItems.map((item, index) => (
            <a
              key={index}
              className="flex items-center hover:cursor-pointer hover:underline"
              href={item.link}
            >
              {item.icon} {item.title}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Shortcuts;
