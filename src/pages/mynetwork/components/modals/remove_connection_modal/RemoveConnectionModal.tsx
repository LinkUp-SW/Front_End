import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "@/slices/modal/modalSlice";
import { RemoveConnectionData } from "@/types";

interface RemoveConnectionModalProps {
  userData: RemoveConnectionData;
  onConfirm: () => void;
}

const RemoveConnectionModal: React.FC<RemoveConnectionModalProps> = ({
  userData,
  onConfirm,
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
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Confirm
          </button>
          <button
            id="cancel-remove-connection-button"
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded cursor-pointer hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConnectionModal;
