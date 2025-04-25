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
             className=" destructiveBtn px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-base whitespace-nowrap"
          >
            Confirm
          </button>
          <button
            id="cancel-withdraw-invitation-button"
            onClick={onCancel} // Use the passed onCancel handler
           className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-300 dark:bg-gray-700 rounded-lg cursor-pointer"
          
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawInvitationModal;