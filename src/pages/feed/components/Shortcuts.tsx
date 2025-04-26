import { Card, CardContent } from "../../../components/ui/card";
import { FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

const Shortcuts = () => {
  const listItems = [
    {
      title: "Saved items",
      icon: <FaBookmark className="mr-2" />,
      link: "/my-items",
    },
  ];
  return (
    <Card className="py-2 my-2 dark:bg-gray-900 border-0">
      <CardContent className="text-gray-700 dark:text-neutral-200 font-medium text-xs my-2">
        <div className="flex flex-col gap-y-4">
          {listItems.map((item, index) => (
            <Link
              key={index}
              className="flex items-center hover:cursor-pointer hover:underline"
              to={item.link}
            >
              {item.icon} {item.title}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Shortcuts;
