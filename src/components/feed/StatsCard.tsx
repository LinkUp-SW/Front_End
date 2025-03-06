import React from "react";
import { Card, CardContent } from "../ui/card";

interface StatsCardProps {
  profileViewers: number;
  postImpressions: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  profileViewers,
  postImpressions,
}) => {
  return (
    <Card className="mb-2 bg-white border-0 w-full h-full">
      <CardContent className="text-gray-900">
        <div className="flex justify-between text-sm font-medium hover:underline hover:cursor-pointer">
          <span>Profile viewers</span>
          <span className="text-blue-600">{profileViewers}</span>
        </div>
        <div className="flex justify-between text-sm mt-2 font-medium hover:underline hover:cursor-pointer">
          <span>Post impressions</span>
          <span className="text-blue-600">{postImpressions}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
