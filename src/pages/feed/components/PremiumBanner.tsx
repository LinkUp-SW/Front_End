import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PiSquareHalfFill } from "react-icons/pi";
import { Link } from "react-router-dom";

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
    <Card className="py-1 bg-white border-0 hover:cursor-pointer dark:bg-gray-900">
      <Link to={"#"}>
        <CardContent className=" py-1 hover:text-blue-600 ">
          <p className="text-xs dark:text-neutral-400 font-medium text-gray-700">
            {randomOption}
          </p>

          <div className="flex mt-1 text-sm items-center gap-x-1 w-full">
            <PiSquareHalfFill color="orange" />
            <p className="font-medium text-xs dark:text-neutral-200 dark:hover:text-blue-400 ">
              Try for EGP0
            </p>
          </div>
        </CardContent>
      </Link>
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
