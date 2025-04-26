import React from "react";
import {
    Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Briefcase, CheckCircle2, MessageSquare, Users, X } from "lucide-react";

const SubscribeNowCard = () => {
  return (
    <Card className="
        flex flex-col h-full relative
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        border border-gray-200 dark:border-gray-700
      ">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">
          Premium Plan
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Unlock all features and grow your network
        </CardDescription>

        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold">
            $9.99
          </span>
          <span className="ml-1 text-gray-600 dark:text-gray-400">
            /month
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <ul className="space-y-4">
          <FeatureItem available>
            Create a profile with basic information
          </FeatureItem>
          <FeatureItem available icon={<Users className="h-5 w-5 text-green-500 dark:text-green-400" />}>
            Connect with 500+ people
            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
              Unlimited
            </span>
          </FeatureItem>
          <FeatureItem available icon={<Briefcase className="h-5 w-5 text-green-500 dark:text-green-400" />}>
            Unlimited job applications
            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
              Unlimited
            </span>
          </FeatureItem>
          <FeatureItem available icon={<MessageSquare className="h-5 w-5 text-green-500 dark:text-green-400" />}>
            Unlimited messaging
            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
              Unlimited
            </span>
          </FeatureItem>
          <FeatureItem available>
            Priority customer support
          </FeatureItem>
        </ul>
      </CardContent>

      <CardFooter>
        <Button className="w-full affirmativeBtn" variant="default">
          Upgrade Now
        </Button>
      </CardFooter>
    </Card>
  );
};

interface FeatureItemProps {
  icon?: React.ReactNode;
  available: boolean;
  children: React.ReactNode;
}

function FeatureItem({ icon, available, children }: FeatureItemProps) {
  return (
    <li className="flex items-start">
      <div className="mr-2 mt-0.5">
        {available
          ? icon ?? <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
          : <X className="h-5 w-5 text-gray-400 dark:text-gray-600" />
        }
      </div>
      <span className={available
        ? ""
        : "text-gray-500 dark:text-gray-600"
      }>
        {children}
      </span>
    </li>
  );
}

export default SubscribeNowCard;
