import { useState } from "react";
import BlueButton from "../buttons/BlueButton";
import TransparentButton from "../buttons/TransparentButton";
import { Button } from "@/components/ui/button";

interface ReportPostModalProps {
  onClose: () => void;
  postId: string;
  onSubmit: (reason: string) => void;
}

const reportReasons = [
  "Harassment",
  "Fraud or scam",
  "Spam",
  "Misinformation",
  "Hateful speech",
  "Threats or violence",
  "Self-harm",
  "Graphic content",
  "Dangerous or extremist organizations",
  "Sexual content",
  "Fake account",
  "Child exploitation",
  "Illegal goods and services",
  "Infringement",
] as const;

type ReportReason = (typeof reportReasons)[number];

const ReportPostModal: React.FC<ReportPostModalProps> = ({
  onClose,
  postId,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  );

  return (
    <div className="flex-col flex py-6">
      <h1 className="border-b dark:border-gray-600 pb-4 px-5 text-xl font-medium">
        Report this post
      </h1>

      <div className="px-5 py-4">
        <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select our policy that applies
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {reportReasons.map((reason) => (
            <Button
              key={reason}
              variant={selectedReason === reason ? "secondary" : "ghost"}
              className={`justify-start text-left ${
                selectedReason === reason
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              onClick={() => setSelectedReason(reason)}
            >
              {reason}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex w-full justify-end gap-2 px-5 border-t pt-5 dark:border-gray-700 mt-auto">
        <TransparentButton id="back-button" onClick={onClose}>
          Back
        </TransparentButton>
        <BlueButton
          onClick={() => {
            if (selectedReason) {
              onSubmit(selectedReason);
              onClose();
            }
          }}
          disabled={!selectedReason}
          id="next-button"
        >
          Next
        </BlueButton>
      </div>
    </div>
  );
};

export default ReportPostModal;
