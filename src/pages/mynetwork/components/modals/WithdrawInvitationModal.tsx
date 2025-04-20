import React from "react";
import { WithdrawInvitationType } from "@/types";

interface WithdrawInvitationTypeModalProps {
  userData: WithdrawInvitationType;
  onConfirm: () => void;
  onCancel: () => void; // Added onCancel prop
}

const WithdrawInvitationModal: React.FC<WithdrawInvitationTypeModalProps> = ({
  userData,
  onConfirm,
  onCancel, // Added onCancel prop
}) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-6 w-full md:w-96 lg:w-[30rem] text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Withdraw Request
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          If you withdraw now, you won't be able to resend to{" "}
          <strong>{userData.userName}</strong> for up to 3 weeks.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            id="confirm-withdraw-invitation-button"
            onClick={() => {
              onConfirm();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Confirm
          </button>
          <button
            id="cancel-withdraw-invitation-button"
            onClick={onCancel} // Use the passed onCancel handler
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded cursor-pointer hover:bg-gray-400 
            dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawInvitationModal;