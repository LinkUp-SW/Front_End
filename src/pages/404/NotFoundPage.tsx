import { useNavigate } from "react-router-dom";
import EmailVerificationLayout from "../auth/components/EmailVerificationLayout";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <EmailVerificationLayout>
      <main className="flex min-h-full w-full max-w-md flex-col gap-4 justify-center items-center p-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            Page Not Found
          </p>
        </header>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Sorry, the page you are looking for does not exist.
        </p>
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
        >
          Go Home
        </button>
      </main>
    </EmailVerificationLayout>
  );
};

export default NotFoundPage;
