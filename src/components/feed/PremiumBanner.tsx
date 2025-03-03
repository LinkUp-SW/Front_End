import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const PremiumBanner = () => {
  return (
    <Card className="mb-4 p-4">
      <CardContent className="text-gray-700">
        <p>Unlock 4x more profile visits</p>
        <Button className="mt-2 w-full bg-yellow-500 text-white">
          Try Premium for EGP0
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumBanner;
