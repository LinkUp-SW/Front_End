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
                      id="confirm-unfollow-button"
                      onClick={() => {
                        onConfirm();
                        dispatch(closeModal());
                      }}
                      className=" destructiveBtn px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-base whitespace-nowrap"
                    >
                      Confirm
                    </button>
                    <button
            id="cancel-unfollow-button"
            onClick={onCancel}
            className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-300 dark:bg-gray-700 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConnectionModal;
