import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PiSquareHalfFill } from "react-icons/pi";

const PremiumBanner = () => {
  const premiumOptions = [
    "Unlock 4x more profile visits",
    "Get hired 2.6x faster with Premium",
    "Accelerate your career with Premium",
    "Achieve your career goals",
  ];
  const randomOption =
    premiumOptions[Math.floor(Math.random() * premiumOptions.length)];
  return (
    <Card className="py-1 bg-white border-0 hover:cursor-pointer dark:bg-zinc-900">
      <CardContent className="text-gray-700 py-1">
        <p className="text-xs dark:text-neutral-400 font-medium">
          {randomOption}
        </p>

        <div className="flex mt-1 text-sm items-center gap-x-1 w-full">
          <PiSquareHalfFill color="orange" />
          <p className="font-medium text-xs dark:text-neutral-200">
            Try for EGP0
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

{
  /* <Card className="mb-4 w-full h-full bg-white border-0 hover:cursor-pointer">
      <CardContent className="text-gray-700">
     
        
      </CardContent>
    </Card> */
}

export default PremiumBanner;
