import Cookies from "js-cookie";
import { Card, CardContent } from "../../../components/ui/card";
import { PiSquareHalfFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { initiateSubscriptionSession } from "@/endpoints/subscriptions";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";

const PremiumBanner = () => {
  const token = Cookies.get("linkup_auth_token");

  const premiumOptions = [
    "Unlock 4x more profile visits",
    "Get hired 2.6x faster with Premium",
    "Accelerate your career with Premium",
    "Achieve your career goals",
  ];
  const randomOption =
    premiumOptions[Math.floor(Math.random() * premiumOptions.length)];
  const handleSubscription = async () => {
    try {
      const response = await initiateSubscriptionSession(token as string);
      window.location.href = response.url;
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="py-1 bg-white border-0 hover:cursor-pointer dark:bg-gray-900">
      <Link to={"#"}>
        <CardContent className=" py-1 hover:text-blue-600 ">
          <p className="text-xs dark:text-neutral-400 font-medium text-gray-700">
            {randomOption}
          </p>

          <div className="flex mt-1 text-sm items-center gap-x-1 w-full">
            <PiSquareHalfFill color="orange" />
            <p
              onClick={handleSubscription}
              className="font-medium text-xs dark:text-neutral-200 dark:hover:text-blue-400 "
            >
              Try for $9.99
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
