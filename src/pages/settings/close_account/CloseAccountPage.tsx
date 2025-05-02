import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { FormCheckbox } from "@/components";
import { closeAccount } from "@/endpoints/settingsEndpoints";

const CloseAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = Cookies.get("linkup_user_id") || "";
  const token = Cookies.get("linkup_auth_token");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [typedUserId, setTypedUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isUserIdMatch = typedUserId === userId;

  const handleDone = async () => {
    if (!confirmChecked || !isUserIdMatch) return;
    setSubmitting(true);
    try {
      const response = await closeAccount(token as string);
      toast.success(response.message);
      navigate('/goodbye')
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SettingsLayoutPage>
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="bg-white dark:bg-[#111827] rounded-lg shadow-md dark:shadow-lg p-6 w-full max-w-lg">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#666] dark:text-[rgba(255,255,255,0.6)] hover:text-[#0891b2] dark:hover:text-[#0891b2] mb-4 flex items-center"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold text-black dark:text-[rgba(255,255,255,0.87)] mb-2">
            Close Your Account
          </h1>
          <p className="text-base text-[#444] dark:text-[rgba(255,255,255,0.6)] mb-6">
            This action is <strong>permanent</strong>. All your data will be
            deleted and cannot be recovered.
          </p>

          <div className="mb-4">
            <p className="text-sm text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
              To confirm, please type your User ID <strong>{userId}</strong>{" "}
              below:
            </p>
            <input
              type="text"
              value={typedUserId}
              onChange={(e) => setTypedUserId(e.target.value)}
              className="mt-2 w-full border border-gray-300 dark:border-[rgba(255,255,255,0.2)] rounded px-3 py-2 bg-white dark:bg-[#1f2937] text-black dark:text-white"
              placeholder="Enter your User ID"
            />
            {!isUserIdMatch && typedUserId.length > 0 && (
              <p className="text-sm text-red-600 mt-1">
                User ID does not match.
              </p>
            )}
          </div>

          <div className="flex items-center mb-6">
            <FormCheckbox
              onCheckedChange={() => setConfirmChecked((prev) => !prev)}
              label="I understand this cannot be undone."
              id="confirm-delete-checkbox"
              name="confirm-check-box"
              checked={confirmChecked}
            />
          </div>

          <button
            onClick={handleDone}
            disabled={!confirmChecked || !isUserIdMatch || submitting}
            className="w-full bg-[#0891b2] text-white rounded-full px-6 py-3 text-base font-medium 
              transition-colors duration-200 hover:bg-[#067a99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Closing Account..." : "Close Account"}
          </button>
        </div>
      </main>
    </SettingsLayoutPage>
  );
};

export default CloseAccountPage;
