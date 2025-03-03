import { Card, CardContent } from "../ui/card";

const StatsCard = () => {
  return (
    <Card className="mb-2 bg-white border-0 w-full h-full">
      <CardContent className="text-gray-900">
        <div className="flex justify-between text-sm font-medium hover:underline hover:cursor-pointer">
          <span>Profile viewers</span>
          <span className="text-blue-600">27</span>
        </div>
        <div className="flex justify-between text-sm mt-2 font-medium hover:underline hover:cursor-pointer">
          <span>Post impressions</span>
          <span className="text-blue-600">22</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
