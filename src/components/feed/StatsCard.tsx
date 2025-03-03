import { Card, CardContent } from "../ui/card";

const StatsCard = () => {
  return (
    <Card className="mb-4 p-4">
      <CardContent className="text-gray-700">
        <div className="flex justify-between text-sm">
          <span>Profile viewers</span>
          <span className="text-blue-600">27</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Post impressions</span>
          <span className="text-blue-600">22</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
