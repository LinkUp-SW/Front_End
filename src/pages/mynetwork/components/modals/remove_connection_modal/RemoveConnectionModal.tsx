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
    <div className="w-full flex items-center justify-center md:w-40">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Remove Connection</h2>
        <p className="mt-2">
          Are you sure you want to remove <strong>{userData.userName}</strong>?
        </p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => {
              onConfirm();
              dispatch(closeModal());
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConnectionModal;
