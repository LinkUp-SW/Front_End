import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "@/slices/modal/modalSlice";
import { RemoveConnectionData } from "@/types";

interface RemoveConnectionModalProps {
  userData: RemoveConnectionData;
  onConfirm: () => void;
  onCancel: () => void; 

}

const RemoveConnectionModal: React.FC<RemoveConnectionModalProps> = ({
  userData,
  onConfirm,
  onCancel,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-6 w-full md:w-96 lg:w-[30rem] text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Remove Connection
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Are you sure you want to remove <strong>{userData.userName}</strong>?
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            id="confirm-remove-connection-button"
            onClick={() => {
              onConfirm();
              dispatch(closeModal());
            }}
            className="affirmativeBtn px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-base whitespace-nowrap"
          >
            Confirm
          </button>
          <button
            id="cancel-remove-connection-button"
            onClick={onCancel}
            className="destructiveBtn px-2 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center text-xs sm:text-base whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConnectionModal;
