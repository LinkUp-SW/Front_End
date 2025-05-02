import { useState } from "react";
import BlueButton from "../buttons/BlueButton";
import TransparentButton from "../buttons/TransparentButton";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { reportContent } from "@/endpoints/feed";

interface ReportModalProps {
  onClose: () => void;
  type: string;
  contentId: string;
}

const reportReasons = [
  "Spam",
  "Harrasment",
  "Nudity",
  "Hate Speech",
  "Scam",
  "Other",
] as const;

type ReportReason = (typeof reportReasons)[number];
const token = Cookies.get("linkup_auth_token");

const ReportModal: React.FC<ReportModalProps> = ({
  onClose,
  type,
  contentId,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  );
  const navigate = useNavigate();

  const submitReport = async () => {
    onClose();
    if (!token) {
      toast.error("You must be logged in to view comments.");
      navigate("/login", { replace: true });
      return;
    }

    const postPayload = {
      contentRef: contentId,
      contentType: type,
      reason: selectedReason?.toLowerCase() || "",
    };

    try {
      const response = await reportContent(postPayload, token);
      if (response.message === "You already reported this before.") {
        toast.info(response.message);
        return;
      }

      toast.success("Report submitted successfully");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="flex-col flex py-6  bg-white dark:bg-gray-900">
      <h1 className="border-b border-gray-200 dark:border-gray-700 pb-4 px-5 text-xl font-medium dark:text-gray-100">
        Report this post
      </h1>

      <div className="px-5 py-4">
        <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select our policy that applies
        </h2>

        <div className="grid grid-cols-1 gap-2">
          {reportReasons.map((reason) => (
            <Button
              key={reason}
              variant="ghost"
              className={`justify-start text-left rounded-full px-4 py-2 transition-all duration-200
                ${
                  selectedReason === reason
                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
              onClick={() => setSelectedReason(reason)}
            >
              {reason}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex w-full justify-end gap-2 px-5 border-t border-gray-200 dark:border-gray-700 pt-5 mt-auto">
        <TransparentButton
          id="back-button"
          onClick={onClose}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            if (selectedReason) {
              submitReport();
            }
          }}
          disabled={!selectedReason}
          id="next-button"
          className={`rounded-full ${
            !selectedReason
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 dark:hover:bg-blue-600"
          }`}
        >
          Submit report
        </BlueButton>
      </div>
    </div>
  );
};
export default ReportModal;
