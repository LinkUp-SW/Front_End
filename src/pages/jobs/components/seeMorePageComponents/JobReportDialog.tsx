import React, { useState } from "react";
import { Job } from "../../types";
import { ReportReasonEnum, reportJob } from "../../../../endpoints/jobs";

interface JobReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

const JobReportDialog: React.FC<JobReportDialogProps> = ({ open, onOpenChange, job }) => {
  const [selectedReason, setSelectedReason] = useState<ReportReasonEnum | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Map of reasons for reporting with icons
  const reasons = [
    { 
      value: ReportReasonEnum.spam, 
      label: "Spam",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M2.25 4.5A2.25 2.25 0 014.5 2.25h15a2.25 2.25 0 012.25 2.25v15a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-15zm1.5 0v15a.75.75 0 00.75.75h15a.75.75 0 00.75-.75v-15a.75.75 0 00-.75-.75h-15a.75.75 0 00-.75.75zm10.5 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.5 0a3 3 0 11-6 0 3 3 0 016 0zm-9-3h3v-3H6.75v3zm3 1.5H6.75v3h3v-3z" />
        </svg>
      )
    },
    { 
      value: ReportReasonEnum.harassment, 
      label: "Harassment",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 013.622 3.375c.18-1.02 1.098-1.717 2.126-1.717H8.25a.75.75 0 010 1.5H5.748c-.35.0-.644.246-.688.589A10.63 10.63 0 004.054 6c-.22.67-.354 1.382-.354 2.124 0 .742.134 1.454.354 2.123a.75.75 0 01.788.557c.16.495.44.873.805 1.13a41.804 41.804 0 001.046-5.839A.75.75 0 017.444 5.25H9a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V7.687C7.994 10.503 7.56 12.211 7 13.5h4.173c.343 0 .678-.045 1-.125V6a.75.75 0 01.75-.75zM5.748 4.5h1.019c.03-.104.059-.207.085-.311.153-.63.345-1.207.673-1.719a3.617 3.617 0 01-.401.03H5.748c-.681 0-1.078.46-1.125.904a10.639 10.639 0 00-.11 1.596c.173-.413.48-.739.959-.739a.75.75 0 01.276.048z" />
        </svg>
      )
    },
    { 
      value: ReportReasonEnum.nudity, 
      label: "Nudity",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
          <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
          <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
        </svg>
      )
    },
    { 
      value: ReportReasonEnum.hate_speech, 
      label: "Hate Speech",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-12.75 3a.75.75 0 100-1.5.75.75 0 000 1.5zm2.25-3a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.375 9.5a.125.125 0 00-.125.125V14a.125.125 0 00.125.125h5.25a.125.125 0 00.125-.125V9.625a.125.125 0 00-.125-.125h-5.25z" />
        </svg>
      )
    },
    { 
      value: ReportReasonEnum.scam, 
      label: "Scam",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5zm8.25-3.75a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-2.25v2.25a.75.75 0 01-1.5 0v-2.25H7.5a.75.75 0 010-1.5h2.25V7.5a.75.75 0 01.75-.75z" />
        </svg>
      )
    },
    { 
      value: ReportReasonEnum.other, 
      label: "Other",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" />
        </svg>
      )
    }
  ];

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    try {
      await reportJob(job.id!, selectedReason);
      setIsSubmitted(true);
      setTimeout(() => {
        onOpenChange(false);
        // Reset state after closing
        setTimeout(() => {
          setIsSubmitted(false);
          setSelectedReason(null);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error reporting job:", error);
      alert("Failed to report job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Report Submitted</h3>
            <p className="text-gray-600 dark:text-gray-400">Thank you for helping keep LinkUp safe.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3">
                    <svg 
                    className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    >
                    <path d="M3 3l18 18" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Report Job</h3>
              </div>
              <button 
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Why are you reporting this job?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {reasons.map((reason) => (
                  <div 
                    key={reason.value}
                    onClick={() => setSelectedReason(reason.value)}
                    className={`
                      flex items-center p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedReason === reason.value 
                        ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                        : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                    `}
                  >
                    <div className={`
                      flex items-center justify-center rounded-full p-1 mr-3
                      ${selectedReason === reason.value 
                        ? 'text-blue-500 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      {reason.icon}
                    </div>
                    <div className="flex-1">
                      <label 
                        htmlFor={`reason-${reason.value}`}
                        className={`block text-sm cursor-pointer ${
                          selectedReason === reason.value 
                            ? 'text-blue-700 dark:text-blue-300 font-medium' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {reason.label}
                      </label>
                    </div>
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        id={`reason-${reason.value}`}
                        name="reportReason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={() => {}} // Handled by parent div onClick
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white focus:outline-none transition-colors ${
                  !selectedReason || isSubmitting
                    ? 'bg-blue-400 dark:bg-blue-500/70 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobReportDialog;