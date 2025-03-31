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
      <div className="p-6 w-full md:w-96 lg:w-[30rem] text-center">
        <h2 className="text-xl font-semibold">Unfollow User</h2>
        <p className="mt-2">
          Do you want to unfollow  <strong>{userData.userName}</strong>?
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => {
              onConfirm();
              dispatch(closeModal());
            }}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
          >
            Confirm
          </button>
          <button
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer dark:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfollowUserModal;
