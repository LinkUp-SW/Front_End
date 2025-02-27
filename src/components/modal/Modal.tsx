// Modal.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { closeModal } from "../../slices/modal/modalSlice";

const Modal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, content } = useSelector((state: RootState) => state.modal);

  // Local state to control if the modal should be rendered
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Local state to trigger the animation classes
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When opening, ensure the modal is rendered and then trigger the enter animation.
      setShouldRender(true);
      setAnimate(false);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      // When closing, start the exit animation.
      setAnimate(false);
      // After the animation duration (300ms), unmount the modal.
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      onClick={() => dispatch(closeModal())}
      className={`fixed inset-0 z-50 flex items-center justify-center 
                  bg-black/50 transition-opacity duration-300 w-full
                  ${animate ? "opacity-100" : "opacity-0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg relative transform transition-all duration-300 w-fit
                    ${
                      animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
      >
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-2 right-2 cursor-pointer transition-all duration-200 ease-in-out  text-gray-500 dark:text-gray-300 dark:hover:text-gray-500 hover:text-gray-700 text-4xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {content}
      </div>
    </div>
  );
};

export default Modal;
