import { Button } from "@/components";
import { Copy, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const ProfileUrlSection = () => {
  const [isCopied, setIsCopied] = useState(false);
  const location = useLocation();

  const profileUrl = import.meta.env.VITE_FRONTEND_URL + location.pathname;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  return (
    <section className="bg-white w-full dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Your Profile URL
      </h2>

      <div className="flex items-center justify-between space-x-4">
        <a
          href={profileUrl}
          className="text-sm font-medium text-blue-700 underline dark:text-blue-200"
        >
          {profileUrl}
        </a>

        <div className="relative">
          <Button
            onClick={handleCopy}
            type="button"
            size="sm"
            className="affirmativeBtn text-white rounded-md px-4 py-2 flex items-center gap-2 transition-colors"
          >
            {isCopied ? (
              <ClipboardCheck className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            <span className="sr-only">Copy</span>
          </Button>

          {isCopied && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-sm text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 p-2 rounded-md shadow-lg">
              Copied!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileUrlSection;
