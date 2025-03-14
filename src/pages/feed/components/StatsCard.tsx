import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Link } from "react-router-dom";

interface StatsCardProps {
  profileViewers: number;
  postImpressions: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  profileViewers,
  postImpressions,
}) => {
  return (
    <Card className="mb-2 bg-white border-0 w-full py-4 dark:bg-gray-900 ">
      <CardContent className="text-gray-900 dark:text-neutral-200 text-xs">
        <Link
          className="flex justify-between font-medium hover:underline hover:cursor-pointer "
          to={"#"}
        >
          <span>Profile viewers</span>
          <span className="text-blue-600 dark:text-blue-400">
            {profileViewers}
          </span>
        </Link>
        <Link
          className="flex justify-between mt-2 font-medium hover:underline hover:cursor-pointer"
          to={"#"}
        >
          <span>Post impressions</span>
          <span className="text-blue-600 dark:text-blue-400">
            {postImpressions}
          </span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
