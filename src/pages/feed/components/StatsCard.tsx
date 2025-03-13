import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

interface StatsCardProps {
  profileViewers: number;
  postImpressions: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  profileViewers,
  postImpressions,
}) => {
  return (
    <Card className="mb-2 bg-white border-0 w-full py-4 dark:bg-zinc-900 ">
      <CardContent className="text-gray-900 dark:text-neutral-200 text-xs">
        <div className="flex justify-between font-medium hover:underline hover:cursor-pointer ">
          <span>Profile viewers</span>
          <span className="text-blue-600 dark:text-blue-400">
            {profileViewers}
          </span>
        </div>
        <div className="flex justify-between mt-2 font-medium hover:underline hover:cursor-pointer">
          <span>Post impressions</span>
          <span className="text-blue-600 dark:text-blue-400">
            {postImpressions}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
