import { Button, Card } from "@/components";
import { Link, useSearchParams } from "react-router-dom";
import EmailVerificationLayout from "../auth/components/EmailVerificationLayout";
import NotFoundPage from "../404/NotFoundPage";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  if (!status) {
    return <NotFoundPage />;
  }

  return (
    <EmailVerificationLayout>
      <Card className="max-w-fit w-full px-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center">
          {/* Left Column - Image (Only if status is success) */}
          {status === "success" && (
            <div className="flex justify-center">
              <div className="sprite celebrate-pixel w-32 h-32 animate-bounce" />
            </div>
          )}

          {/* Right Column - Text Content */}
          <div
            className={`text-center lg:text-left ${
              status !== "success" && "col-span-2"
            }`}
          >
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
              {status === "success" ? `Hooray! 🎉` : ""}
              {status === "failure" ? `Oops! Something went wrong.` : ""}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {status === "success" &&
                `You are now a premium member. Enjoy your plan and exclusive features!`}
              {status === "failure" &&
                `There was an issue with your payment. Please try again or contact support.`}
              {status !== "failure" &&
                status !== "success" &&
                `Something went wrong. Please check your URL or try again.`}
            </p>

            <Button
              asChild
              className="w-full  py-3 affirmativeBtn font-medium rounded-md transition-colors"
            >
              <Link to="/feed" replace className="block text-center">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </EmailVerificationLayout>
  );
};

export default PaymentStatusPage;
