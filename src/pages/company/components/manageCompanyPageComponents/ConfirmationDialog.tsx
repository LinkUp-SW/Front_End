import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  isSubmitting = false,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="w-full max-w-md p-0 bg-white dark:bg-gray-900 dark:text-gray-200">
        <DialogHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="dark:text-white">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="px-4 py-4">
          <div className="mb-5">
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>
          
          <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              disabled={isSubmitting}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`px-4 py-2 ${confirmButtonClass} rounded disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? `${confirmText}...` : confirmText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;