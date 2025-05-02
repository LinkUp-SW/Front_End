import { Button, Card } from "@/components";
import { Link } from "react-router-dom";
import EmailVerificationLayout from "../auth/components/EmailVerificationLayout";

const GoodByePage = () => {
  return (
    <EmailVerificationLayout>
      <Card
        className="
        max-w-md w-full p-8 
        bg-gray-200 dark:bg-gray-800 
        text-gray-900 dark:text-gray-100 
        rounded-4xl
        shadow-sm dark:shadow-xl 
        transition-colors
        dark:border-gray-500
        mx-auto
      "
      >
        <div className="space-y-2 grid place-items-center">
          {/* animated sprite */}
          <div className="flex justify-center">
            <div className="sprite pixel w-32 h-32 animate-bounce" />
          </div>

          <h1 className="text-2xl font-semibold">Account Deleted</h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thank you for your time with us.
          </p>

          <Button
            asChild
            className="
            w-full py-3 affirmativeBtn font-medium 
            rounded-md 
            transition-colors
          "
          >
            <Link to="/" replace className="block">
              Return Home
            </Link>
          </Button>
        </div>
      </Card>
    </EmailVerificationLayout>
  );
};

export default GoodByePage;
