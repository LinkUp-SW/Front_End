import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "@/slices/modal/modalSlice";
import { UnfollowUserType } from "@/types";

interface UnfollowUserModalProps {
  userData: UnfollowUserType;
  onConfirm: () => void;
}

const UnfollowUserModal: React.FC<UnfollowUserModalProps> = ({
  userData,
  onConfirm,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-6 w-full md:w-96 lg:w-[30rem] text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Unfollow User
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Do you want to unfollow <strong>{userData.userName}</strong>?
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            id="confirm-unfollow-button"
            onClick={() => {
              onConfirm();
              dispatch(closeModal());
            }}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Confirm
          </button>
          <button
            id="cancel-unfollow-button"
            onClick={() => dispatch(closeModal())}
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

export default UnfollowUserModal;
